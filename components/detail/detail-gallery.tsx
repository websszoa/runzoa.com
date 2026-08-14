"use client";

import Image from "next/image";
import { useState } from "react";
import { Fan, LoaderCircle } from "lucide-react";
import { APP_INSTAGRAM_URL } from "@/lib/constants";

interface DetailGalleryProps {
  name: string;
  images_cover: string | null;
  eventSite: string | null;
}

export default function DetailGallery({
  name,
  images_cover,
}: DetailGalleryProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(Boolean(images_cover));

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-background">
      {/* 인스타그램 링크 */}
      <a
        href={APP_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full hover:opacity-80 transition-opacity"
        aria-label="런조아 인스타그램 보기"
      >
        <Image
          src="/svg/instagram.svg"
          alt=""
          width={20}
          height={20}
          className="invert"
          aria-hidden="true"
        />
      </a>

      <div className="flex min-h-0 flex-1 p-4">
        {images_cover && !imgError ? (
          <div className="relative min-h-48 w-full self-start overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={
                images_cover.startsWith("/") || images_cover.startsWith("http")
                  ? images_cover
                  : `/marathon/cover/${images_cover}`
              }
              alt={`${name} 대회 커버 이미지`}
              width={800}
              height={600}
              loading="eager"
              priority
              sizes="(max-width: 1024px) 100vw, 33vw"
              className={`h-auto w-full object-cover transition-opacity ${imgLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setImgLoading(false)}
              onError={() => {
                setImgError(true);
                setImgLoading(false);
              }}
            />
            {imgLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <LoaderCircle
                  className="size-8 animate-spin"
                  aria-hidden="true"
                />
                <p className="font-anyvid text-sm">이미지 불러오는 중입니다.</p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex min-h-48 w-full flex-1 flex-col items-center justify-center gap-2 rounded-lg bg-gray-100 text-muted-foreground">
            <Fan className="size-8 animate-spin" aria-hidden="true" />
            <p className="font-anyvid text-sm">이미지 준비 중입니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
