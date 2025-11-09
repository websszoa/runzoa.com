"use client";

import { RollerCoaster, Send } from "lucide-react";
import { Button } from "../ui/button";
import { notices } from "@/lib/notice";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DialogNoticeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogNotice({
  open,
  onOpenChange,
}: DialogNoticeProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[100dvh] w-full max-w-full p-0 rounded-none sm:h-auto sm:max-w-[600px] sm:p-6 sm:rounded-lg flex flex-col">
        <DialogHeader className="border-b pb-6 px-6 pt-6 sm:p-0 sm:pb-6 shrink-0">
          <DialogTitle className="flex items-center font-black text-brand justify-center gap-1 text-xl">
            <RollerCoaster className="h-5 w-5" />
            공지사항
          </DialogTitle>
          <DialogDescription className="text-center">
            최신 공지사항을 여기서 확인하세요!
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4 sm:px-0">
          {notices.map((notice) => (
            <div key={notice.id} className="border-b pb-4 mb-4 last:mb-0">
              <div className="flex items-end mb-1">
                <h3 className="font-semibold text-sm mr-2">{notice.title}</h3>
                <span className="text-xs text-muted-foreground">
                  {notice.date}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-6 hover:underline underline-offset-4 cursor-pointer">
                {notice.description}
              </p>
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-center px-6 pb-6 sm:p-0 sm:mt-4 shrink-0">
          <DialogClose asChild>
            <Button className="w-full bg-brand hover:bg-brand/90">
              <Send /> 확인 완료
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
