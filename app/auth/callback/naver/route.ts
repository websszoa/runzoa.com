import { NextResponse, type NextRequest } from "next/server";

import { completeLogin } from "@/lib/auth/complete-login";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_PROFILE_URL = "https://openapi.naver.com/v1/nid/me";

type NaverTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: string;
  error?: string;
};

type NaverProfileResponse = {
  resultcode?: string;
  message?: string;
  response?: {
    id?: string;
    email?: string;
    name?: string;
    nickname?: string;
    profile_image?: string;
  };
};

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("naver_oauth_state")?.value;
  const requestedNext = request.cookies.get("naver_oauth_next")?.value ?? "/";
  const next =
    requestedNext.startsWith("/") && !requestedNext.startsWith("//")
      ? requestedNext
      : "/";

  if (!code || !state || !savedState || state !== savedState) {
    return clearOAuthCookies(
      redirectWithAuthError(baseUrl, "invalid_oauth_state"),
    );
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return clearOAuthCookies(
      redirectWithAuthError(baseUrl, "naver_not_configured"),
    );
  }

  try {
    const token = await exchangeNaverToken({
      clientId,
      clientSecret,
      code,
      state,
    });
    const profile = await getNaverProfile(token.access_token);

    if (!profile.id) {
      return clearOAuthCookies(
        redirectWithAuthError(baseUrl, "naver_profile_incomplete"),
      );
    }

    const admin = createAdminClient();
    const supabase = await createClient();
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    const fullName = profile.name || profile.nickname || "이름 없음";
    const { data: mappedConnection, error: mappingError } = await admin
      .from("naver_connections")
      .select("user_id")
      .eq("naver_user_id", profile.id)
      .maybeSingle();

    if (mappingError) throw mappingError;
    if (
      mappedConnection &&
      currentUser &&
      mappedConnection.user_id !== currentUser.id
    ) {
      return clearOAuthCookies(
        redirectWithAuthError(baseUrl, "naver_already_connected"),
      );
    }

    // 로그인된 사용자가 처음 연결하는 경우에는 현재 계정에 네이버만 연결합니다.
    if (currentUser && !mappedConnection) {
      await saveNaverConnection(admin, {
        userId: currentUser.id,
        naverUserId: profile.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? null,
        expiresIn: Number(token.expires_in ?? 0),
      });
      return clearOAuthCookies(
        redirectWithLoginResult(baseUrl, next, "connected"),
      );
    }

    // 이미 같은 계정으로 로그인된 상태라면 토큰만 최신 상태로 갱신합니다.
    if (currentUser && mappedConnection?.user_id === currentUser.id) {
      await saveNaverConnection(admin, {
        userId: currentUser.id,
        naverUserId: profile.id,
        accessToken: token.access_token,
        refreshToken: token.refresh_token ?? null,
        expiresIn: Number(token.expires_in ?? 0),
      });
      return clearOAuthCookies(
        redirectWithLoginResult(baseUrl, next, "connected"),
      );
    }

    let loginEmail = profile.email;
    if (mappedConnection) {
      const { data: mappedUser, error: mappedUserError } =
        await admin.auth.admin.getUserById(mappedConnection.user_id);
      if (mappedUserError || !mappedUser.user?.email) {
        throw new Error(mappedUserError?.message || "연결된 사용자 조회 실패");
      }
      loginEmail = mappedUser.user.email;
    }

    if (!loginEmail) {
      return clearOAuthCookies(
        redirectWithAuthError(baseUrl, "naver_profile_incomplete"),
      );
    }

    // 같은 이메일의 기존 계정은 자동 병합하지 않고, 기존 계정으로
    // 로그인한 뒤 네이버를 명시적으로 연결하도록 안내합니다.
    if (!mappedConnection) {
      const { data: sameEmailProfile, error: sameEmailError } = await admin
        .from("profiles")
        .select("id")
        .eq("email", loginEmail)
        .maybeSingle();
      if (sameEmailError) throw sameEmailError;
      if (sameEmailProfile) {
        return clearOAuthCookies(
          redirectWithAuthError(baseUrl, "naver_account_link_required"),
        );
      }
    }

    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({
        type: "magiclink",
        email: loginEmail,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
            avatar_url: profile.profile_image ?? null,
            naver_id: profile.id,
            naver_email: profile.email ?? null,
          },
        },
      });

    if (linkError || !linkData.properties?.hashed_token || !linkData.user) {
      throw new Error(linkError?.message || "Supabase 로그인 링크 생성 실패");
    }

    if (linkData.user.app_metadata.provider === "email") {
      const { error: updateUserError } =
        await admin.auth.admin.updateUserById(linkData.user.id, {
          app_metadata: {
            provider: "custom:naver",
            providers: ["custom:naver"],
          },
          user_metadata: {
            ...linkData.user.user_metadata,
            full_name: fullName,
            name: fullName,
            avatar_url: profile.profile_image ?? null,
            naver_id: profile.id,
          },
        });

      if (updateUserError) throw updateUserError;

      await admin
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: profile.profile_image ?? null,
          signup_provider: "naver",
        })
        .eq("id", linkData.user.id);
    }

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: linkData.properties.hashed_token,
      type: "magiclink",
    });

    if (verifyError || !data.user) {
      throw new Error(verifyError?.message || "Supabase 세션 생성 실패");
    }

    await saveNaverConnection(admin, {
      userId: data.user.id,
      naverUserId: profile.id,
      accessToken: token.access_token,
      refreshToken: token.refresh_token ?? null,
      expiresIn: Number(token.expires_in ?? 0),
    });

    const result = await completeLogin(supabase, data.user);
    if (result.status === "deleted") {
      const deletedUrl = new URL("/", baseUrl);
      deletedUrl.searchParams.set("error", "deleted");
      return clearOAuthCookies(NextResponse.redirect(deletedUrl));
    }

    if (result.status === "success") {
      const successUrl = new URL(next, baseUrl);
      successUrl.searchParams.set(
        "login",
        result.isFirstLogin ? "welcome" : "success",
      );
      return clearOAuthCookies(NextResponse.redirect(successUrl));
    }
  } catch (error) {
    console.error(
      "네이버 로그인 실패:",
      error instanceof Error ? error.message : error,
    );
  }

  return clearOAuthCookies(
    redirectWithAuthError(baseUrl, "naver_login_failed"),
  );
}

async function exchangeNaverToken({
  clientId,
  clientSecret,
  code,
  state,
}: {
  clientId: string;
  clientSecret: string;
  code: string;
  state: string;
}) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    client_secret: clientSecret,
    code,
    state,
  });
  const response = await fetch(NAVER_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const data = (await response.json()) as NaverTokenResponse;

  if (!response.ok || !data.access_token) {
    throw new Error(data.error || "네이버 토큰 발급 실패");
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  };
}

async function getNaverProfile(accessToken: string) {
  const response = await fetch(NAVER_PROFILE_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const data = (await response.json()) as NaverProfileResponse;

  if (!response.ok || data.resultcode !== "00" || !data.response) {
    throw new Error(data.message || "네이버 프로필 조회 실패");
  }

  return data.response;
}

async function saveNaverConnection(
  admin: ReturnType<typeof createAdminClient>,
  values: {
    userId: string;
    naverUserId: string;
    accessToken: string;
    refreshToken: string | null;
    expiresIn: number;
  },
) {
  const expiresAt = values.expiresIn
    ? new Date(Date.now() + values.expiresIn * 1000).toISOString()
    : null;
  const { error } = await admin.from("naver_connections").upsert(
    {
      user_id: values.userId,
      naver_user_id: values.naverUserId,
      access_token: values.accessToken,
      refresh_token: values.refreshToken,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(`네이버 연결 토큰 저장 실패: ${error.message}`);
  }
}

function clearOAuthCookies(response: NextResponse) {
  response.cookies.delete("naver_oauth_state");
  response.cookies.delete("naver_oauth_next");
  return response;
}

function redirectWithAuthError(baseUrl: string, reason: string) {
  const destination = new URL("/", baseUrl);
  destination.searchParams.set("authError", reason);
  return NextResponse.redirect(destination);
}

function redirectWithLoginResult(baseUrl: string, next: string, result: string) {
  const destination = new URL(next, baseUrl);
  destination.searchParams.set("login", result);
  return NextResponse.redirect(destination);
}
