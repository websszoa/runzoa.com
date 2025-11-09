"use client";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-450px)]">
      <div className="p-6 w-1/3 text-center">
        <h1 className="text-4xl font-poppins font-light mb-4">Not Found</h1>
        <p className="text-destructive font-nanumNeo">
          어머, 페이지가 숨었나 봐요! 🧐💫
          <br /> 조금만 기다려 주세요, 금방 찾을게요! 🕵️‍♀️✨
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2 mb-10"
          onClick={() => (window.location.href = "/")}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}
