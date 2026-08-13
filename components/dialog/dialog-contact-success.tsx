"use client";

import { Heart, MailCheck, Sparkles, TentTree } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_ENG_NAME } from "@/lib/constants";

export default function DialogContactSuccess({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-paperlogy text-xl font-extrabold text-brand uppercase">
              <TentTree className="size-9" aria-hidden="true" />
              {APP_ENG_NAME}
            </div>
            <DialogTitle className="mt-2 text-center font-paperlogy text-xl">
              💌 문의가 접수되었습니다!
            </DialogTitle>
          </div>
          <DialogDescription className="break-keep pt-1 text-center font-anyvid text-sm leading-6">
            문의를 주셔서 감사합니다.
            <br />
            빠른 시일 내로 답변드리겠습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mx-auto flex h-36 w-52 items-center justify-center overflow-hidden" aria-hidden="true">
          <span className="contact-success-cloud absolute bottom-5 left-5 h-7 w-16 rounded-full bg-sky-100" />
          <span className="contact-success-cloud contact-success-cloud--right absolute right-3 bottom-8 h-6 w-14 rounded-full bg-emerald-100" />

          <div className="contact-success-mail relative z-10 flex size-20 items-center justify-center rounded-[1.6rem] border border-brand/15 bg-linear-to-br from-white to-orange-50 shadow-[0_12px_30px_rgba(255,111,48,0.18)]">
            <MailCheck className="size-10 text-brand" />
          </div>

          <Sparkles className="contact-success-spark contact-success-spark--one absolute top-6 left-8 size-5 text-amber-400" />
          <Heart className="contact-success-spark contact-success-spark--two absolute top-4 right-8 size-4 fill-rose-300 text-rose-300" />
          <Sparkles className="contact-success-spark contact-success-spark--three absolute right-7 bottom-5 size-4 text-sky-400" />
          <span className="contact-success-dot contact-success-dot--one absolute top-12 left-4 size-2 rounded-full bg-emerald-400" />
          <span className="contact-success-dot contact-success-dot--two absolute top-8 right-3 size-2 rounded-full bg-amber-300" />
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full bg-brand font-anyvid text-white hover:bg-brand/90"
          onClick={() => onOpenChange(false)}
        >
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
}
