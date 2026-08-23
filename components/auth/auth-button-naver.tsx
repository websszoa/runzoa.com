"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AuthButtonNaverProps {
  disabled?: boolean;
}

export default function AuthButtonNaver({ disabled }: AuthButtonNaverProps) {
  const handleNaverLogin = () => {
    const nextUrl = new URL(window.location.href);
    ["authError", "error", "login"].forEach((key) =>
      nextUrl.searchParams.delete(key),
    );
    const next = `${nextUrl.pathname}${nextUrl.search}`;
    const loginUrl = new URL("/auth/naver/start", window.location.origin);
    loginUrl.searchParams.set("next", next);
    window.location.assign(loginUrl);
  };

  return (
    <Button
      type="button"
      disabled={disabled}
      onClick={handleNaverLogin}
      className="h-11 w-full gap-2 border-[#03c75a] bg-[#03c75a] text-white hover:bg-[#02b351] disabled:cursor-not-allowed"
      size="lg"
    >
      <Image
        src="/svg/naver.svg"
        alt=""
        width={14}
        height={14}
        unoptimized
        className="shrink-0 brightness-0 invert"
      />
      <span className="font-anyvid text-white">네이버 로그인</span>
    </Button>
  );
}
