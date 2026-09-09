import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Marathon } from "@/lib/marathons";

const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";

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

export async function createKakaoCalendarEvent(accessToken: string, marathon: Marathon) {
  const end = new Date(`${marathon.event.endDate ?? marathon.event.startDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const event = {
    title: Array.from(marathon.name).slice(0, 50).join(""),
    time: {
      start_at: `${marathon.event.startDate}T00:00:00Z`,
      end_at: `${end.toISOString().slice(0, 10)}T00:00:00Z`,
      all_day: true,
      time_zone: "Asia/Seoul",
    },
    description: Array.from([marathon.name, marathon.description, marathon.event.site, "런조아에서 추가한 마라톤 일정입니다."].filter(Boolean).join("\n")).slice(0, 5000).join(""),
    ...((marathon.location.venue || marathon.location.address) ? {
      location: { name: marathon.location.venue || marathon.location.address, address: marathon.location.address },
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
