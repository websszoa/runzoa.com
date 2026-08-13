"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface AuthButtonGoogleProps {
  disabled?: boolean;
}

export default function AuthButtonGoogle({ disabled }: AuthButtonGoogleProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsPending(true);
    setErrorMessage(null);

    const supabase = createClient();
    const redirectTo = new URL("/auth/callback/google", window.location.origin);
    redirectTo.searchParams.set(
      "next",
      `${window.location.pathname}${window.location.search}`,
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        scopes: "openid email profile",
        queryParams: {
          prompt: "consent select_account",
        },
      },
    });

    if (error) {
      setErrorMessage("구글 로그인을 시작하지 못했습니다.");
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={disabled || isPending}
      onClick={handleGoogleLogin}
      className="h-11 w-full gap-2 bg-gray-100 hover:border-gray-100 hover:bg-gray-200"
      variant="ghost"
      size="lg"
    >
      <Image
        src="/svg/google.svg"
        alt=""
        width={20}
        height={20}
        unoptimized
        className="shrink-0"
      />
      <span className="font-anyvid text-muted-foreground">
        {errorMessage ?? (isPending ? "구글로 이동 중..." : "구글 로그인")}
      </span>
    </Button>
  );
}
