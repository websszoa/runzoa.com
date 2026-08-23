import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Marathon } from "@/lib/marathons";

const NAVER_CALENDAR_URL =
  "https://openapi.naver.com/calendar/createSchedule.json";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";

export type NaverConnection = {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
};

export async function getValidNaverAccessToken(
  admin: SupabaseClient,
  connection: NaverConnection,
) {
  const expiresAt = connection.expires_at
    ? new Date(connection.expires_at).getTime()
    : 0;

  if (expiresAt > Date.now() + 60_000) return connection.access_token;
  if (!connection.refresh_token) return null;

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: connection.refresh_token,
  });
  const response = await fetch(NAVER_TOKEN_URL, {
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
    .from("naver_connections")
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
    console.error("네이버 갱신 토큰 저장 실패:", updateError.message);
    return null;
  }

  return token.access_token;
}

export async function createNaverCalendarEvent(
  accessToken: string,
  marathon: Marathon,
  uid: string,
) {
  const body = new URLSearchParams({
    calendarId: "defaultCalendarId",
    scheduleIcalString: buildICalendar(marathon, uid),
  });
  const response = await fetch(NAVER_CALENDAR_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body,
    cache: "no-store",
  });
  const result = (await response.json().catch(() => null)) as {
    result?: string;
    errorCode?: string;
    errorMessage?: string;
    returnValue?: {
      calendarId?: string;
      icalUid?: string;
    };
  } | null;

  if (!response.ok || result?.result !== "success") {
    return {
      success: false as const,
      reconnectRequired: response.status === 401 || response.status === 403,
      message:
        result?.errorMessage ?? "네이버 캘린더에 일정을 추가하지 못했습니다.",
    };
  }

  return {
    success: true as const,
    calendarId: result.returnValue?.calendarId ?? null,
    eventId: result.returnValue?.icalUid ?? uid,
  };
}

function buildICalendar(marathon: Marathon, uid: string) {
  const startDate = compactDate(marathon.event.startDate);
  const endDate = compactDate(
    addDays(marathon.event.endDate ?? marathon.event.startDate, 1),
  );
  const location = [marathon.location.venue, marathon.location.address]
    .filter(Boolean)
    .join(" · ");
  const description = [
    marathon.description,
    marathon.event.site ? `대회 홈페이지: ${marathon.event.site}` : null,
    "런조아에서 추가한 마라톤 일정입니다.",
  ]
    .filter(Boolean)
    .join("\\n");
  const now = new Date().toISOString().replaceAll(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:RUNZOA",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "SEQUENCE:0",
    "CLASS:PUBLIC",
    "TRANSP:TRANSPARENT",
    `UID:${escapeICal(uid)}`,
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `SUMMARY:${escapeICal(marathon.name)}`,
    `DESCRIPTION:${escapeICal(description)}`,
    `LOCATION:${escapeICal(location)}`,
    `CREATED:${now}`,
    `LAST-MODIFIED:${now}`,
    `DTSTAMP:${now}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function escapeICal(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function compactDate(value: string) {
  return value.replaceAll("-", "");
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00+09:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
