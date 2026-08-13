"use client";

import { useState } from "react";
import { Bookmark, Check, Heart, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DetailButtonsProps {
  marathonName: string;
  likeCount?: number;
  favoriteCount?: number;
  shareCount?: number;
}

export default function DetailButtons({
  marathonName,
  likeCount = 0,
  favoriteCount = 0,
  shareCount = 0,
}: DetailButtonsProps) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(likeCount);
  const [favorites, setFavorites] = useState(favoriteCount);
  const [shares, setShares] = useState(shareCount);

  const handleLike = () => {
    setLiked((active) => {
      setLikes((count) => (active ? Math.max(0, count - 1) : count + 1));
      return !active;
    });
  };

  const handleFavorite = () => {
    setFavorited((active) => {
      setFavorites((count) => (active ? Math.max(0, count - 1) : count + 1));
      return !active;
    });
  };

  const completeShare = () => {
    setShared(true);
    setShares((count) => count + 1);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: marathonName,
          url: window.location.href,
        });
        completeShare();
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      completeShare();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 공유 창을 닫은 경우에는 아무 동작도 하지 않습니다.
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative h-12 w-full gap-1.5 rounded-full border border-border bg-background font-anyvid text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
          liked &&
            "border-brand bg-brand text-white hover:border-brand hover:bg-brand/90 hover:text-white",
        )}
        onClick={handleLike}
        aria-pressed={liked}
      >
        <Heart className={cn("h-4 w-4", liked)} aria-hidden="true" />
        좋아요
        {likes > 0 && (
          <span className="absolute right-4 text-xs font-normal opacity-70">
            {likes.toLocaleString()}
          </span>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative h-12 w-full gap-1.5 rounded-full border border-border bg-background font-anyvid text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
          favorited &&
            "border-brand bg-brand text-white hover:border-brand hover:bg-brand/90 hover:text-white",
        )}
        onClick={handleFavorite}
        aria-pressed={favorited}
      >
        <Bookmark className={cn("h-4 w-4", favorited)} aria-hidden="true" />
        즐겨찾기
        {favorites > 0 && (
          <span className="absolute right-4 text-xs font-normal opacity-70">
            {favorites.toLocaleString()}
          </span>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative h-12 w-full gap-1.5 rounded-full border border-border bg-background font-anyvid text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
          shared &&
            "border-brand bg-brand text-white hover:border-brand hover:bg-brand/90 hover:text-white",
        )}
        onClick={handleShare}
        aria-pressed={shared}
        aria-label={copied ? "주소가 복사되었습니다" : "대회 정보 공유하기"}
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "복사됨" : "공유하기"}
        {shares > 0 && (
          <span className="absolute right-4 text-xs font-normal opacity-70">
            {shares.toLocaleString()}
          </span>
        )}
      </Button>
    </div>
  );
}
