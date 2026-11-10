import { NextResponse } from "next/server";
import { z } from "zod";

import { reserveCalendarEvent } from "@/lib/calendar/reserve-event";
import { getMarathons } from "@/lib/marathons";
import {
  createNaverCalendarEvent,
  getValidNaverAccessToken,
  type NaverConnection,
} from "@/lib/naver/calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  getEffectiveRegistrationSchedule,
  getMarathonVenueAddress,
} from "@/lib/utils";

const requestSchema = z.object({
  slug: z.string().trim().min(1).max(200),
  kind: z.enum(["race", "registration"]).default("race"),
});

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다.", code: "INVALID_ORIGIN" },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "로그인이 필요합니다.", code: "AUTH_REQUIRED" },
      { status: 401 },
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "올바른 대회를 선택해 주세요.", code: "INVALID_REQUEST" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: connection, error: connectionError } = await admin
    .from("naver_connections")
    .select("user_id, access_token, refresh_token, expires_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (connectionError || !connection) {
    return NextResponse.json(
      { error: "네이버 캘린더 연결이 필요합니다.", code: "RECONNECT_REQUIRED" },
      { status: 403 },
    );
  }

  const accessToken = await getValidNaverAccessToken(
    admin,
    connection as NaverConnection,
  ).catch(() => null);
  if (!accessToken) {
    return NextResponse.json(
      { error: "네이버 연결이 만료되었습니다.", code: "RECONNECT_REQUIRED" },
      { status: 403 },
    );
  }

  const { marathons } = await getMarathons();
  const marathon = marathons.find((item) => item.slug === parsed.data.slug);
  if (!marathon) {
    return NextResponse.json(
      { error: "대회 정보를 찾을 수 없습니다.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }

  const kind = parsed.data.kind;
  const schedule =
    kind === "registration"
      ? getEffectiveRegistrationSchedule(marathon)
      : marathon.event;
  if (!schedule.startDate) {
    return NextResponse.json(
      { error: "접수 일정이 아직 공개되지 않았어요.", code: "NO_REGISTRATION_SCHEDULE" },
      { status: 400 },
    );
  }

  const location = getMarathonVenueAddress(marathon);
  const reservation = await reserveCalendarEvent(admin, {
    userId: user.id,
    provider: "naver",
    slug: marathon.slug,
    name: marathon.name,
    kind,
    startDate: schedule.startDate,
    endDate: schedule.endDate ?? schedule.startDate,
    location: location || null,
  });

  if (reservation.status === "exists") {
    return NextResponse.json({ success: true, alreadyAdded: true });
  }
  if (reservation.status === "pending") {
    return NextResponse.json(
      { error: "캘린더에 추가하고 있습니다.", code: "ALREADY_PROCESSING" },
      { status: 409 },
    );
  }
  if (reservation.status === "error") {
    console.error("캘린더 일정 예약 실패:", reservation.message);
    return NextResponse.json(
      { error: "캘린더 저장소 설정이 필요합니다.", code: "STORAGE_NOT_READY" },
      { status: 503 },
    );
  }

  const uid = `${user.id}-${marathon.slug}-${kind}@runzoa.com`;
  const result = await createNaverCalendarEvent(
    accessToken,
    marathon,
    uid,
    kind,
  );
  if (!result.success) {
    await admin
      .from("calendar_events")
      .update({
        status: result.uncertain ? "pending" : "failed",
        error_message: result.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", reservation.id);
    return NextResponse.json(
      {
        error: result.message,
        code: result.reconnectRequired ? "RECONNECT_REQUIRED" : "NAVER_ERROR",
      },
      { status: result.reconnectRequired ? 403 : 502 },
    );
  }

  const { error: insertError } = await admin
    .from("calendar_events")
    .update({
      status: "created",
      error_message: null,
      external_event_id: result.eventId,
      provider_calendar_id: result.calendarId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservation.id);

  if (insertError) {
    console.error("캘린더 내역 저장 실패:", insertError.message);
    return NextResponse.json({
      success: true,
      warning: "네이버에는 추가됐지만 런조아 내역 저장에 실패했습니다.",
    });
  }

  return NextResponse.json({ success: true });
}
