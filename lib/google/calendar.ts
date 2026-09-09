import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Marathon } from "@/lib/marathons";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleConnection = {
  user_id: string;
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
};

export async function getValidGoogleAccessToken(
  admin: SupabaseClient,
  connection: GoogleConnection,
) {
  const expiresAt = connection.expires_at
    ? new Date(connection.expires_at).getTime()
    : 0;

  if (expiresAt > Date.now() + 60_000) return connection.access_token;
  if (!connection.refresh_token) return null;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: connection.refresh_token,
  });
  const response = await fetch(GOOGLE_TOKEN_URL, {
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
    .from("google_connections")
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
    console.error("구글 갱신 토큰 저장 실패:", updateError.message);
    return null;
  }

  return token.access_token;
}

export async function createGoogleCalendarEvent(accessToken: string, marathon: Marathon, id: string) {
  const end = new Date(`${marathon.event.endDate ?? marathon.event.startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  try {
    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({
        id,
        summary: marathon.name,
        start: { date: marathon.event.startDate },
        end: { date: end.toISOString().slice(0, 10) },
        location: [marathon.location.venue, marathon.location.address].filter(Boolean).join(" · "),
        description: [marathon.description, marathon.event.site, "런조아에서 추가한 마라톤 일정입니다."].filter(Boolean).join("\n"),
      }),
    });
    if (response.ok || response.status === 409) {
      return { success: true as const, eventId: id, calendarId: "primary" };
    }
    return { success: false as const, reconnectRequired: response.status === 401 || response.status === 403,
      message: "구글 캘린더에 추가하지 못했습니다. 권한과 연결 상태를 확인해 주세요." };
  } catch {
    return { success: false as const, reconnectRequired: false, message: "구글 연결에 실패했습니다. 다시 시도해 주세요." };
  }
}
