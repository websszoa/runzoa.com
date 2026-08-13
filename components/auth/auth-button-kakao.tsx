"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuthButtonKakaoProps {
  disabled?: boolean;
}

export default function AuthButtonKakao({ disabled }: AuthButtonKakaoProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKakaoLogin = async () => {
    if (isPending) return;

    setIsPending(true);
    setErrorMessage(null);

    const supabase = createClient();
    const redirectTo = new URL("/auth/callback/kakao", window.location.origin);
    redirectTo.searchParams.set(
      "next",
      `${window.location.pathname}${window.location.search}`,
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: redirectTo.toString(),
        scopes: "profile_nickname profile_image account_email",
      },
    });

    if (error) {
      setErrorMessage("카카오 로그인을 시작하지 못했습니다.");
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={disabled || isPending}
      onClick={handleKakaoLogin}
      className="h-11 w-full gap-2 bg-[#FEE500] text-black transition-colors hover:bg-[#FEE500]/80 disabled:cursor-not-allowed disabled:opacity-50"
      size="lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 21 21"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          fill="#3C1E1E"
          d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
        />
      </svg>
      <span className="font-anyvid text-black/70">
        {errorMessage ?? (isPending ? "카카오로 이동 중..." : "카카오 로그인")}
      </span>
    </Button>
  );
}
