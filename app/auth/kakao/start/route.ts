import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const callback = new URL("/auth/callback/kakao", request.nextUrl.origin);
  callback.searchParams.set("next", "/calendar-add?provider=kakao");
  callback.searchParams.set("calendar", "1");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: callback.toString(),
      scopes: "profile_nickname profile_image account_email talk_calendar",
    },
  });
  return NextResponse.redirect(error || !data.url
    ? new URL("/calendar-add?provider=kakao&calendarError=login", request.nextUrl.origin)
    : data.url);
}
