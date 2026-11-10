import "server-only";

import type { createAdminClient } from "@/lib/supabase/admin";

export type CalendarProvider = "kakao" | "naver" | "google";
export type CalendarEventKind = "race" | "registration";

type ReserveCalendarEventValues = {
  userId: string;
  provider: CalendarProvider;
  slug: string;
  name: string;
  kind: CalendarEventKind;
  startDate: string;
  endDate: string;
  location: string | null;
};

// 캘린더 제공자(카카오/네이버/구글) 공용 "일정 추가" 중복 방지 로직.
// pending 상태가 2분 넘게 머물러 있으면 멈춘 요청으로 보고 재시도를 허용한다.
export async function reserveCalendarEvent(
  admin: ReturnType<typeof createAdminClient>,
  values: ReserveCalendarEventValues,
) {
  const now = new Date().toISOString();
  const inserted = await admin
    .from("calendar_events")
    .insert({
      user_id: values.userId,
      provider: values.provider,
      marathon_slug: values.slug,
      marathon_name: values.name,
      event_kind: values.kind,
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
    .select("id, status, updated_at")
    .eq("user_id", values.userId)
    .eq("provider", values.provider)
    .eq("marathon_slug", values.slug)
    .eq("event_kind", values.kind)
    .single();

  if (existing.error || !existing.data) {
    return {
      status: "error" as const,
      message: existing.error?.message ?? "기존 일정 확인 실패",
    };
  }
  if (existing.data.status === "created") return { status: "exists" as const };
  if (
    existing.data.status === "pending" &&
    Date.parse(existing.data.updated_at) > Date.now() - 120_000
  ) {
    return { status: "pending" as const };
  }

  const retried = await admin
    .from("calendar_events")
    .update({ status: "pending", error_message: null, updated_at: now })
    .eq("id", existing.data.id)
    .eq("status", existing.data.status)
    .eq("updated_at", existing.data.updated_at)
    .select("id")
    .maybeSingle();

  if (retried.error) {
    return { status: "error" as const, message: retried.error.message };
  }
  if (!retried.data) return { status: "pending" as const };
  return { status: "reserved" as const, id: retried.data.id };
}
