"use client";

import { useState } from "react";
import { Construction, Sparkles, TentTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_ENG_NAME } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DialogSiteMaintenance() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden sm:max-w-sm">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center gap-2 font-paperlogy text-xl font-extrabold text-brand uppercase">
            <TentTree className="size-8" aria-hidden="true" />
            {APP_ENG_NAME}
          </div>
          <DialogTitle className="pt-2 font-paperlogy text-xl">
            현재 사이트를 다듬고 있어요! 🚧
          </DialogTitle>
          <DialogDescription className="break-keep font-anyvid text-sm leading-6">
            더 편리한 런조아를 위해 일부 기능을 업데이트하고 있습니다. 현재
            정보는 정확하지 않습니다.
          </DialogDescription>
        </DialogHeader>

        <div
          className="relative mx-auto flex h-32 w-52 items-center justify-center"
          aria-hidden="true"
        >
          <span className="absolute bottom-4 h-2 w-36 rounded-full bg-amber-200/70" />
          <span className="contact-success-cloud absolute bottom-5 left-2 h-6 w-14 rounded-full bg-sky-100" />
          <span className="contact-success-cloud contact-success-cloud--right absolute right-2 bottom-7 h-5 w-12 rounded-full bg-orange-100" />
          <div className="contact-success-mail relative z-10 flex size-20 items-center justify-center rounded-[1.6rem] border border-amber-200 bg-linear-to-br from-white to-amber-50 shadow-[0_12px_30px_rgba(245,158,11,0.18)]">
            <Construction className="size-10 text-amber-500" />
          </div>
          <Sparkles className="contact-success-spark absolute top-5 left-7 size-5 text-brand" />
          <Sparkles className="contact-success-spark contact-success-spark--two absolute top-3 right-7 size-4 text-amber-400" />
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full bg-brand font-anyvid text-white hover:bg-brand/90"
          onClick={() => setOpen(false)}
        >
          확인했어요
        </Button>
      </DialogContent>
    </Dialog>
  );
}
