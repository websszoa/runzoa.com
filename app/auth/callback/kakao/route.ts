import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
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
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return redirectWithAuthError(requestUrl, "exchange_failed");
  }

  await supabase.rpc("increment_visit_count");

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

function redirectWithAuthError(url: URL, reason: string) {
  const destination = new URL("/", url.origin);
  destination.searchParams.set("authError", reason);
  return NextResponse.redirect(destination);
}
