import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getEffectiveRegistrationSchedule,
  getMarathonVenueAddress,
} from "@/lib/utils";

const NAVER_CALENDAR_URL =
  "https://openapi.naver.com/calendar/createSchedule.json";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";

export type EventKind = "race" | "registration";

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
  let response: Response;
  try {
    response = await fetch(NAVER_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return null;
  }
  const token = (await response.json().catch(() => null)) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: string;
  } | null;

  if (!response.ok || !token?.access_token) return null;

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
  kind: EventKind = "race",
) {
  const schedule =
    kind === "registration"
      ? getEffectiveRegistrationSchedule(marathon)
      : marathon.event;
  if (!schedule.startDate) {
    return {
      success: false as const,
      uncertain: false,
      reconnectRequired: false,
      message: "접수 일정이 아직 공개되지 않았어요.",
    };
  }

  const body = new URLSearchParams({
    calendarId: "defaultCalendarId",
    scheduleIcalString: buildICalendar(marathon, uid, kind),
  });
  let response: Response;
  try {
    response = await fetch(NAVER_CALENDAR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    return {
      success: false as const,
      uncertain: true as const,
      reconnectRequired: false,
      message:
        "추가 결과를 확인하지 못했습니다. 네이버 캘린더에서 저장 여부를 확인해 주세요.",
    };
  }
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
      uncertain: response.status >= 500,
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

function buildICalendar(marathon: Marathon, uid: string, kind: EventKind) {
  const isRegistration = kind === "registration";
  const schedule = isRegistration
    ? getEffectiveRegistrationSchedule(marathon)
    : marathon.event;
  const startDate = compactDate(schedule.startDate!);
  const endDate = compactDate(
    addDays(schedule.endDate ?? schedule.startDate!, 1),
  );
  const venue = marathon.location.venue;
  const address = marathon.location.address;
  const location = getMarathonVenueAddress(marathon);
  const price = formatMarathonPrices(
    marathon.registration.price,
    marathon.registration.currency ?? "KRW",
  );
  const site =
    (isRegistration ? marathon.registration.site : marathon.event.site) ??
    (isRegistration ? marathon.event.site : marathon.registration.site);
  const title = isRegistration ? `[접수] ${marathon.name}` : marathon.name;
  const description = [
    `제목 : ${marathon.name}`,
    `일정 : ${formatMarathonDate(schedule.startDate)}${schedule.startTime ? ` ${schedule.startTime}` : ""}`,
    venue ? `장소 : ${venue}` : null,
    address ? `주소 : ${address}` : null,
    `가격 : ${price}`,
    site ? `링크 : ${site}` : null,
    "",
    "런조아에서 추가한 마라톤 일정, 완주까지 응원할게요!",
    "https://runzoa.com",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
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
    `SUMMARY:${escapeICal(title)}`,
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
