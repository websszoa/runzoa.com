import { NextResponse } from "next/server";
import { z } from "zod";

import { getMarathons } from "@/lib/marathons";
import {
  createNaverCalendarEvent,
  getValidNaverAccessToken,
  type NaverConnection,
} from "@/lib/naver/calendar";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  slug: z.string().trim().min(1).max(200),
});

export async function POST(request: Request) {
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
  );
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

  const location = [marathon.location.venue, marathon.location.address]
    .filter(Boolean)
    .join(" · ");
  const reservation = await reserveCalendarEvent(admin, {
    userId: user.id,
    slug: marathon.slug,
    name: marathon.name,
    startDate: marathon.event.startDate,
    endDate: marathon.event.endDate ?? marathon.event.startDate,
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

  const uid = `${user.id}-${marathon.slug}@runzoa.com`;
  const result = await createNaverCalendarEvent(accessToken, marathon, uid);
  if (!result.success) {
    await admin
      .from("calendar_events")
      .update({
        status: "failed",
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

type CalendarReservationValues = {
  userId: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string | null;
};

async function reserveCalendarEvent(
  admin: ReturnType<typeof createAdminClient>,
  values: CalendarReservationValues,
) {
  const now = new Date().toISOString();
  const inserted = await admin
    .from("calendar_events")
    .insert({
      user_id: values.userId,
      provider: "naver",
      marathon_slug: values.slug,
      marathon_name: values.name,
      event_start_date: values.startDate,
      event_end_date: values.endDate,
      event_location: values.location,
      status: "pending",
      updated_at: now,
    })
    .select("id")
    .single();

  if (!inserted.error && inserted.data) {
    return { status: "reserved" as const, id: inserted.data.id };
  }
  if (inserted.error?.code !== "23505") {
    return {
      status: "error" as const,
      message: inserted.error?.message ?? "일정 예약 실패",
    };
  }

  const existing = await admin
    .from("calendar_events")
    .select("id, status")
    .eq("user_id", values.userId)
    .eq("provider", "naver")
    .eq("marathon_slug", values.slug)
    .single();

  if (existing.error || !existing.data) {
    return {
      status: "error" as const,
      message: existing.error?.message ?? "기존 일정 확인 실패",
    };
  }
  if (existing.data.status === "created") return { status: "exists" as const };
  if (existing.data.status === "pending") return { status: "pending" as const };

  const retried = await admin
    .from("calendar_events")
    .update({ status: "pending", error_message: null, updated_at: now })
    .eq("id", existing.data.id)
    .eq("status", "failed")
    .select("id")
    .maybeSingle();

  if (retried.error) {
    return { status: "error" as const, message: retried.error.message };
  }
  if (!retried.data) return { status: "pending" as const };
  return { status: "reserved" as const, id: retried.data.id };
}
