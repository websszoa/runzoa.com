import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AuthButtonNaverProps {
  disabled?: boolean;
}

export default function AuthButtonNaver({ disabled }: AuthButtonNaverProps) {
  return (
    <Button
      type="button"
      disabled={disabled}
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
  );
}
