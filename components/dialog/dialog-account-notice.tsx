"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, TentTree } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { APP_ENG_NAME } from "@/lib/constants";

export type AccountNotice = "deleted" | "withdrawn";

const noticeContent: Record<
  AccountNotice,
  { title: string; description: string; tone: "warning" | "success" }
> = {
  deleted: {
    title: "탈퇴한 계정입니다",
    description:
      "이미 탈퇴 처리된 계정으로는 로그인할 수 없습니다. 도움이 필요하면 고객지원으로 문의해 주세요.",
    tone: "warning",
  },
  withdrawn: {
    title: "회원 탈퇴가 완료되었습니다",
    description:
      "그동안 런조아와 함께해 주셔서 감사합니다. 현재 계정은 로그아웃 처리되었습니다.",
    tone: "success",
  },
};

export default function DialogAccountNotice({
  notice,
}: {
  notice: AccountNotice;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const content = noticeContent[notice];
  const isWarning = content.tone === "warning";

  const closeNotice = () => {
    setOpen(false);
    router.replace("/", { scroll: false });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeNotice()}>
      <DialogContent className="overflow-hidden sm:max-w-sm">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center gap-2 font-paperlogy text-xl font-extrabold uppercase text-brand">
            <TentTree className="size-8" aria-hidden="true" />
            {APP_ENG_NAME}
          </div>
          <div
            className={`mx-auto mt-3 flex size-16 items-center justify-center rounded-2xl ${
              isWarning
                ? "bg-red-50 text-red-500"
                : "bg-emerald-50 text-emerald-500"
            }`}
            aria-hidden="true"
          >
            {isWarning ? (
              <AlertTriangle className="size-8" />
            ) : (
              <CheckCircle2 className="size-8" />
            )}
          </div>
          <DialogTitle className="pt-2 font-paperlogy text-xl font-semibold">
            {content.title}
          </DialogTitle>
          <DialogDescription className="break-keep font-anyvid text-sm leading-6">
            {content.description}
          </DialogDescription>
        </DialogHeader>

        <Button
          type="button"
          size="lg"
          onClick={closeNotice}
          className="w-full bg-brand font-anyvid text-white hover:bg-brand/90"
        >
          확인
        </Button>
      </DialogContent>
    </Dialog>
  );
}
