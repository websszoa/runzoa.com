"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { withdrawAccount } from "@/app/(site)/mypage/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

const CONFIRMATION_TEXT = "회원 탈퇴";

export default function AccountWithdrawal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canWithdraw = confirmation.trim() === CONFIRMATION_TEXT;

  const handleOpenChange = (nextOpen: boolean) => {
    if (isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setConfirmation("");
      setErrorMessage(null);
    }
  };

  const handleWithdrawal = () => {
    if (!canWithdraw || isPending) return;

    setErrorMessage(null);
    startTransition(async () => {
      try {
        const result = await withdrawAccount(confirmation);
        if (!result.success) {
          setErrorMessage(result.message);
          return;
        }

        await createClient().auth.signOut();
        setOpen(false);
        router.replace("/?account=withdrawn");
        router.refresh();
      } catch {
        setErrorMessage(
          "회원 탈퇴를 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    });
  };

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/40 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-paperlogy text-base font-semibold text-red-700">
            회원 탈퇴
          </h2>
          <p className="mt-1 break-keep font-anyvid text-xs leading-5 text-red-700/70">
            탈퇴하면 즉시 로그아웃되며 같은 계정으로 다시 로그인할 수 없습니다.
          </p>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 w-full border-red-200 bg-white text-red-600 hover:bg-red-100 hover:text-red-700"
            />
          }
        >
          <Trash2 aria-hidden="true" />
          탈퇴하기
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </div>
            <DialogTitle className="text-center font-paperlogy text-xl font-semibold">
              정말 탈퇴하시겠어요?
            </DialogTitle>
            <DialogDescription className="break-keep text-center font-anyvid leading-6">
              탈퇴한 계정은 다시 로그인할 수 없습니다. 계속하려면 아래에
              <strong className="mx-1 text-foreground">회원 탈퇴</strong>
              를 입력해 주세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="withdrawal-confirmation" className="font-anyvid">
              확인 문구
            </Label>
            <Input
              id="withdrawal-confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder={CONFIRMATION_TEXT}
              autoComplete="off"
              disabled={isPending}
              aria-invalid={Boolean(errorMessage)}
            />
            {errorMessage && (
              <p role="alert" className="font-anyvid text-sm text-red-600">
                {errorMessage}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:justify-stretch">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="sm:flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleWithdrawal}
              disabled={!canWithdraw || isPending}
              className="sm:flex-1"
            >
              {isPending ? "처리 중..." : "회원 탈퇴"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
