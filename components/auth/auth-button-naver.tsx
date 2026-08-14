"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface AuthButtonNaverProps {
  disabled?: boolean;
}

export default function AuthButtonNaver({ disabled }: AuthButtonNaverProps) {
  const [showMaintenanceMessage, setShowMaintenanceMessage] = useState(false);

  return (
    <div className="space-y-2">
      <Button
        type="button"
        disabled={disabled}
        onClick={() => setShowMaintenanceMessage(true)}
        className="h-11 w-full gap-2 border border-[#03C75A] bg-[#03C75A] text-white transition-colors hover:bg-[#02b351] disabled:cursor-not-allowed disabled:opacity-50"
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
      {showMaintenanceMessage && (
        <p
          role="alert"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-center font-anyvid text-sm text-emerald-700"
        >
          네이버 로그인은 현재 점검 중입니다.
        </p>
      )}
    </div>
  );
}
