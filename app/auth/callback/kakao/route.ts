import { NextResponse, type NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { completeLogin } from "@/lib/auth/complete-login";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const baseUrl = requestUrl.origin;
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (!code && requestUrl.searchParams.get("calendar") === "1") {
    return NextResponse.redirect(new URL("/calendar-add?provider=kakao&calendarError=cancelled", baseUrl));
  }

  if (!code) {
    return redirectWithAuthError(baseUrl, "missing_code");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithAuthError(baseUrl, "exchange_failed");
  }

  if (data.user) {
    const result = await completeLogin(supabase, data.user);

    if (result.status === "deleted") {
      const deletedUrl = new URL("/", baseUrl);
      deletedUrl.searchParams.set("error", "deleted");
      return NextResponse.redirect(deletedUrl);
    }

    if (result.status === "success") {
      if (requestUrl.searchParams.get("calendar") === "1") {
        try {
          const accessToken = data.session?.provider_token;
          if (!accessToken || !data.session?.provider_refresh_token) throw new Error("Missing provider token");
          // Verify the granted permission, including when consent was partially declined.
          const check = await fetch("https://kapi.kakao.com/v2/api/calendar/calendars", {
            headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store",
          });
          if (!check.ok) {
            const failure = await check.json().catch(() => null) as { code?: unknown } | null;
            const code = typeof failure?.code === "number" ? failure.code : null;
            // Log only diagnostic codes, never provider tokens or account details.
            console.error("톡캘린더 권한 확인 실패", { status: check.status, code });
            const reason = code === -5 ? "app_permission"
              : code === -402 ? "consent"
              : code === -501 ? "talk_account"
              : check.status === 401 ? "token"
              : "calendar_api";
            return NextResponse.redirect(new URL(`/calendar-add?provider=kakao&calendarError=${reason}`, baseUrl));
          }
          const admin = createAdminClient();
          const { error: saveError } = await admin.from("kakao_connections").upsert({
            user_id: data.user.id,
            access_token: accessToken,
            refresh_token: data.session?.provider_refresh_token ?? null,
            // Supabase session expiry is not the Kakao token expiry. Refresh before use.
            expires_at: null,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
          if (saveError) return NextResponse.redirect(new URL("/calendar-add?provider=kakao&calendarError=storage", baseUrl));
        } catch {
          return NextResponse.redirect(new URL("/calendar-add?provider=kakao&calendarError=connection", baseUrl));
        }
      }
      const successUrl = new URL(next, baseUrl);
      successUrl.searchParams.set(
        "login",
        result.isFirstLogin ? "welcome" : "success",
      );
      return NextResponse.redirect(successUrl);
    }
  }

  return redirectWithAuthError(baseUrl, "profile_failed");
}

function redirectWithAuthError(baseUrl: string, reason: string) {
  const destination = new URL("/", baseUrl);
  destination.searchParams.set("authError", reason);
  return NextResponse.redirect(destination);
}
