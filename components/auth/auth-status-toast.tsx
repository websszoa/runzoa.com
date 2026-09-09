"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const authErrorMessages: Record<string, string> = {
  invalid_oauth_state: "로그인 요청이 만료되었습니다. 다시 시도해 주세요.",
  missing_code: "로그인 정보를 받지 못했습니다. 다시 시도해 주세요.",
  exchange_failed: "로그인 처리에 실패했습니다. 다시 시도해 주세요.",
  profile_failed: "프로필 정보를 가져오지 못했습니다. 다시 시도해 주세요.",
  naver_not_configured: "네이버 로그인 설정에 문제가 있습니다. 잠시 후 다시 시도해 주세요.",
  naver_profile_incomplete: "네이버 계정에서 이메일 정보를 가져오지 못했습니다.",
  naver_already_connected: "이미 다른 계정에 연결된 네이버 아이디예요.",
  naver_account_link_required:
    "이미 같은 이메일로 가입된 계정이 있어요. 기존 방식으로 로그인한 뒤 네이버를 연결해 주세요.",
  naver_login_failed: "네이버 로그인에 실패했습니다. 다시 시도해 주세요.",
};

export default function AuthStatusToast() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("authError");
  const login = searchParams.get("login");

  useEffect(() => {
    if (!authError && !login) return;

    if (authError) {
      toast.error(authErrorMessages[authError] ?? "로그인에 실패했습니다. 다시 시도해 주세요.");
    } else if (login === "welcome") {
      toast.success("런조아 가입을 환영합니다!");
    } else if (login === "success") {
      toast.success("로그인되었습니다.");
    }

    const next = new URL(window.location.href);
    next.searchParams.delete("authError");
    next.searchParams.delete("login");
    router.replace(`${next.pathname}${next.search}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authError, login]);

  return null;
}
