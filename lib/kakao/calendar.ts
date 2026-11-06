import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDistances,
} from "@/lib/utils";

const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

export type EventKind = "race" | "registration";

export type KakaoConnection = {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
};

export async function getValidKakaoAccessToken(
  admin: SupabaseClient,
  connection: KakaoConnection,
) {
  const expiresAt = connection.expires_at
    ? new Date(connection.expires_at).getTime()
    : 0;

  if (expiresAt > Date.now() + 60_000) return connection.access_token;
  if (!connection.refresh_token) return null;

  const clientId = process.env.KAKAO_CLIENT_ID;
  const clientSecret = process.env.KAKAO_CLIENT_SECRET;
  if (!clientId) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: connection.refresh_token,
  });
  if (clientSecret) body.set("client_secret", clientSecret);
  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const token = (await response.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: string;
  };

  if (!response.ok || !token.access_token) return null;

  const expiresIn = Number(token.expires_in ?? 0);
  const { error: updateError } = await admin
    .from("kakao_connections")
    .update({
      access_token: token.access_token,
      refresh_token: token.refresh_token ?? connection.refresh_token,
      expires_at: expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", connection.user_id);

  if (updateError) {
    console.error("카카오 갱신 토큰 저장 실패:", updateError.message);
    return null;
  }

  return token.access_token;
}

// 카카오 시간 포맷(KST 벽시계 시각 -> UTC 인스턴트)으로 변환합니다.
function toKoreanInstantIso(date: string, time: string) {
  return new Date(`${date}T${time}:00+09:00`).toISOString();
}

// 시작 시각이 있으면 시간 지정 일정 + 1일전/1시간전 알림, 없으면 종일 일정 + 1일전 알림만 사용합니다.
function buildEventTime(
  startDate: string,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
) {
  if (startTime) {
    const startAt = toKoreanInstantIso(startDate, startTime);
    const fallbackEndAt = new Date(new Date(startAt).getTime() + 60 * 60 * 1000).toISOString();
    const endAt = endTime ? toKoreanInstantIso(endDate ?? startDate, endTime) : fallbackEndAt;
    return {
      time: {
        start_at: startAt,
        end_at: endAt > startAt ? endAt : fallbackEndAt,
        all_day: false as const,
        time_zone: "Asia/Seoul",
      },
      reminders: [1440, 60],
    };
  }
  const end = new Date(`${endDate ?? startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  return {
    time: {
      start_at: `${startDate}T00:00:00Z`,
      end_at: `${end.toISOString().slice(0, 10)}T00:00:00Z`,
      all_day: true as const,
      time_zone: "Asia/Seoul",
    },
    reminders: [1440],
  };
}

function formatScheduleRange(
  startDate: string,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
) {
  const startLabel = startTime ? `${formatMarathonDate(startDate)} ${startTime}` : formatMarathonDate(startDate);
  if (!endDate || endDate === startDate) return startLabel;
  const endLabel = endTime ? `${formatMarathonDate(endDate)} ${endTime}` : formatMarathonDate(endDate);
  return `${startLabel} ~ ${endLabel}`;
}

function buildEventContent(marathon: Marathon, kind: EventKind) {
  const isRegistration = kind === "registration";
  const title = Array.from(isRegistration ? `[접수] ${marathon.name}` : marathon.name)
    .slice(0, 50)
    .join("");

  const location = [marathon.location.venue, marathon.location.address].filter(Boolean).join(" · ") || null;
  const distances = getMarathonDistances(marathon.registration.price).join(" / ") || null;
  const price = formatMarathonPrices(marathon.registration.price, marathon.registration.currency ?? "KRW");
  const site = (isRegistration ? marathon.registration.site : marathon.event.site)
    ?? (isRegistration ? marathon.event.site : marathon.registration.site);

  const lines = [
    `제목: ${marathon.name}`,
    `대회 일정: ${formatScheduleRange(marathon.event.startDate, marathon.event.endDate, marathon.event.startTime, marathon.event.endTime)}`,
    isRegistration && marathon.registration.startDate
      ? `접수 일정: ${formatScheduleRange(marathon.registration.startDate, marathon.registration.endDate, marathon.registration.startTime, marathon.registration.endTime)}`
      : null,
    location ? `장소: ${location}` : null,
    distances ? `종목: ${distances}` : null,
    `가격: ${price}`,
    site ? `대회 사이트 링크: ${site}` : null,
    "",
    "런조아에서 추가한 마라톤 일정입니다.",
  ].filter((line): line is string => line !== null);

  return { title, description: Array.from(lines.join("\n")).slice(0, 5000).join("") };
}

export async function createKakaoCalendarEvent(
  accessToken: string,
  marathon: Marathon,
  kind: EventKind = "race",
) {
  const schedule = kind === "registration" ? marathon.registration : marathon.event;
  const { startDate, endDate, startTime, endTime } = schedule;
  if (!startDate) {
    return {
      success: false as const,
      uncertain: false,
      reconnectRequired: false,
      message: "접수 일정이 아직 공개되지 않았어요.",
    };
  }

  const { title, description } = buildEventContent(marathon, kind);
  const { time, reminders } = buildEventTime(startDate, endDate, startTime, endTime);
  const locationName = marathon.location.venue || marathon.location.address;

  const event = {
    title,
    time,
    reminders,
    description,
    ...(locationName ? {
      location: { name: locationName, address: marathon.location.address },
    } : {}),
  };
  try {
    const response = await fetch("https://kapi.kakao.com/v2/api/calendar/create/event", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
      body: new URLSearchParams({ calendar_id: "primary", event: JSON.stringify(event) }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const result = await response.json().catch(() => null) as { event_id?: string; code?: number } | null;
    if (response.ok && result?.event_id) return { success: true as const, eventId: result.event_id, calendarId: "primary" };
    return {
      success: false as const,
      uncertain: response.ok || response.status >= 500,
      reconnectRequired: response.status === 401 || result?.code === -402,
      message: response.status === 403
        ? "톡캘린더 사용 권한을 확인해 주세요. 승인 전에는 앱 멤버 계정만 사용할 수 있습니다."
        : "톡캘린더에 추가하지 못했습니다. 연결 상태를 확인해 주세요.",
    };
  } catch {
    // A timed-out create may have succeeded. Keep the reservation to prevent duplicate writes.
    return { success: false as const, uncertain: true, reconnectRequired: false,
      message: "추가 결과를 확인하지 못했습니다. 톡캘린더에서 저장 여부를 확인해 주세요." };
  }
}
