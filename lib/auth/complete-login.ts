import "server-only";

import type { SupabaseClient, User } from "@supabase/supabase-js";

import { sendMemberSignupEmails } from "@/lib/email/member-emails";

type CompleteLoginResult =
  | { status: "success"; isFirstLogin: boolean }
  | { status: "deleted" }
  | { status: "error" };

export async function completeLogin(
  supabase: SupabaseClient,
  user: User,
): Promise<CompleteLoginResult> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_deleted, visit_count")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("프로필 확인 실패:", profileError.message);
    return { status: "error" };
  }

  if (profile?.is_deleted) {
    await supabase.auth.signOut();
    return { status: "deleted" };
  }

  const isFirstLogin = !profile || profile.visit_count === 0;
  const { data: visitCount, error: visitError } = await supabase.rpc(
    "increment_visit_count",
  );

  if (visitError) {
    console.error("방문 횟수 기록 실패:", visitError.message);
    return { status: "error" };
  }

  if (isFirstLogin || visitCount === 1) {
    const emailProps = {
      userName: getUserName(user),
      userEmail: user.email ?? "",
      provider: normalizeProvider(user.app_metadata.provider),
    };
    await sendMemberSignupEmails({
      name: emailProps.userName,
      email: emailProps.userEmail,
      provider: emailProps.provider ?? "소셜 로그인",
    });
  }

  return { status: "success", isFirstLogin };
}

function normalizeProvider(provider: unknown): string | undefined {
  if (provider === "custom:naver") return "naver";
  return typeof provider === "string" ? provider : undefined;
}

function getUserName(user: User): string {
  const metadata = user.user_metadata;
  const name = metadata.full_name ?? metadata.name ?? metadata.user_name;

  return typeof name === "string" && name.trim() ? name.trim() : "이름 없음";
}
