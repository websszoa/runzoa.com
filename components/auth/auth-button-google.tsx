import Image from "next/image";

import { Button } from "@/components/ui/button";

interface AuthButtonGoogleProps {
  disabled?: boolean;
}

export default function AuthButtonGoogle({ disabled }: AuthButtonGoogleProps) {
  return (
    <Button
      type="button"
      disabled={disabled}
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
      <span className="font-anyvid text-muted-foreground">구글 로그인</span>
    </Button>
  );
}
