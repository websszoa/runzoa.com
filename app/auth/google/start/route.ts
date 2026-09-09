import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const callback = new URL("/auth/callback/google", request.nextUrl.origin);
  callback.searchParams.set("next", "/calendar-add?provider=google");
  callback.searchParams.set("calendar", "1");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callback.toString(),
      scopes: "openid email profile https://www.googleapis.com/auth/calendar.events.owned",
      queryParams: { access_type: "offline", prompt: "consent select_account" },
    },
  });
  return NextResponse.redirect(error || !data.url
    ? new URL("/calendar-add?provider=google&calendarError=login", request.nextUrl.origin)
    : data.url);
}
