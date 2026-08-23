import { NextResponse, type NextRequest } from "next/server";

const NAVER_AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";
const OAUTH_COOKIE_MAX_AGE = 10 * 60;

export function GET(request: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID;

  if (!clientId) {
    return redirectWithAuthError(request.nextUrl.origin, "naver_not_configured");
  }

  const requestedNext = request.nextUrl.searchParams.get("next") ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";
  const state = crypto.randomUUID();
  const callbackUrl = new URL("/auth/callback/naver", request.nextUrl.origin);
  const authorizeUrl = new URL(NAVER_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", callbackUrl.toString());
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  const secure = request.nextUrl.protocol === "https:";
  response.cookies.set("naver_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: OAUTH_COOKIE_MAX_AGE,
  });
  response.cookies.set("naver_oauth_next", next, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: OAUTH_COOKIE_MAX_AGE,
  });

  return response;
}

function redirectWithAuthError(baseUrl: string, reason: string) {
  const destination = new URL("/", baseUrl);
  destination.searchParams.set("authError", reason);
  return NextResponse.redirect(destination);
}
