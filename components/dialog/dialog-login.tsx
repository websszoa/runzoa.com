"use client";

import { APP_ENG_NAME, APP_NAME } from "@/lib/constants";
import { TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AuthButtonGoogle from "@/components/auth/auth-button-google";
import AuthButtonKakao from "@/components/auth/auth-button-kakao";
import AuthButtonNaver from "@/components/auth/auth-button-naver";

export default function DialogLogin({ compact = false }: { compact?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={compact ? "destructive" : "outline"}
            size="sm"
            className={cn(
              "rounded-full text-xs",
              compact
                ? "h-6 px-2.5 font-paperlogy normal-case"
                : "h-11 px-4",
            )}
          />
        }
      >
        로그인
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 font-paperlogy text-xl font-black uppercase text-brand">
                <TentTree aria-hidden="true" className="size-8" />
                {APP_ENG_NAME}
              </div>
            </div>
            <DialogTitle className="mt-2 font-paperlogy font-semibold text-xl">
              {APP_NAME}에 오신 걸 환영합니다.
            </DialogTitle>
          </div>
          <DialogDescription className="break-keep text-center font-anyvid text-sm leading-6">
            로그인을 하시면{" "}
            <a
              href="/privacy"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-3 transition-colors hover:text-brand"
            >
              개인정보 처리방침
            </a>{" "}
            및{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-3 transition-colors hover:text-brand"
            >
              이용약관
            </a>
            에 <br className="hidden md:block" /> 동의한 것으로 간주됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <AuthButtonGoogle />
          <AuthButtonKakao />
          <AuthButtonNaver />
        </div>
      </DialogContent>
    </Dialog>
  );
}
