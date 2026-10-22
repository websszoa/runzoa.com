"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("링크를 복사했어요!");
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("링크 복사에 실패했어요. 다시 시도해 주세요.");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label="페이지 링크 복사"
      className="rounded-full"
    >
      {copied ? (
        <Check className="size-4 text-brand" />
      ) : (
        <Share2 className="size-4" />
      )}
    </Button>
  );
}
