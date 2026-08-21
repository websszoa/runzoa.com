"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand, ImageIcon } from "lucide-react";
import type { AnalyticsReport } from "@/lib/analytics-reports";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Attachment = AnalyticsReport["attachments"][number];

export default function PageAnalytics({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [selected, setSelected] = useState<Attachment | null>(null);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {attachments.map((attachment) => (
          <button
            key={attachment.src}
            type="button"
            onClick={() => setSelected(attachment)}
            className="group overflow-hidden rounded-2xl border bg-card text-left transition-colors hover:border-brand/50"
          >
            <div className="relative aspect-[4/3] overflow-hidden border-b bg-muted/30">
              <Image
                src={attachment.src}
                alt={attachment.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute right-3 bottom-3 flex size-8 items-center justify-center rounded-full border bg-background/90 text-foreground">
                <Expand className="size-4" aria-hidden="true" />
              </span>
            </div>
            <span className="flex items-center gap-2 px-4 py-3 font-anyvid text-sm">
              <ImageIcon className="size-4 text-brand" aria-hidden="true" />
              {attachment.title}
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        {selected && (
          <DialogContent className="max-h-[92dvh] max-w-[calc(100%-1rem)] gap-4 overflow-y-auto p-4 shadow-none sm:max-w-6xl sm:p-6">
            <DialogHeader className="pr-10">
              <DialogTitle className="font-paperlogy text-lg font-semibold">
                {selected.title}
              </DialogTitle>
              <DialogDescription>
                원본 통계 자료를 확대해서 확인할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <Image
              src={selected.src}
              alt={selected.alt}
              width={selected.width}
              height={selected.height}
              sizes="95vw"
              className="h-auto w-full rounded-xl border"
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
