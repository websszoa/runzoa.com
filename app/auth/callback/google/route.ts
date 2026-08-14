import { NextResponse, type NextRequest } from "next/server";

import { completeLogin } from "@/lib/auth/complete-login";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const baseUrl = getBaseUrl(request, requestUrl.origin);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (!code) {
    return redirectWithAuthError(requestUrl, "missing_code");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithAuthError(requestUrl, "exchange_failed");
  }

  if (data.user) {
    const result = await completeLogin(supabase, data.user);

    if (result.status === "deleted") {
      const deletedUrl = new URL("/", baseUrl);
      deletedUrl.searchParams.set("error", "deleted");
      return NextResponse.redirect(deletedUrl);
    }

    if (result.status === "success") {
      const successUrl = new URL(next, baseUrl);
      successUrl.searchParams.set(
        "login",
        result.isFirstLogin ? "welcome" : "success",
      );
      return NextResponse.redirect(successUrl);
    }
  }

  return redirectWithAuthError(new URL(baseUrl), "profile_failed");
}

function redirectWithAuthError(url: URL, reason: string) {
  const destination = new URL("/", url.origin);
  destination.searchParams.set("authError", reason);
  return NextResponse.redirect(destination);
}

function getBaseUrl(request: NextRequest, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  return process.env.NODE_ENV !== "development" && forwardedHost
    ? `https://${forwardedHost}`
    : origin;
}
