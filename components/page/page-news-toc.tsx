"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";

import type { NewsPostMetadata } from "@/lib/news";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

type PageNewsTocProps = {
  metadata: NewsPostMetadata;
  posts: readonly NewsPostMetadata[];
};

const EMPTY_SECTIONS: NonNullable<NewsPostMetadata["toc"]> = [];

function getPostHref(post: Pick<NewsPostMetadata, "slug" | "type">) {
  const basePath =
    post.type === "blog"
      ? "/blog"
      : post.type === "newsletter"
        ? "/newsletter"
        : "/new";

  return `${basePath}/${post.slug}`;
}

export default function PageNewsToc({ metadata, posts }: PageNewsTocProps) {
  const router = useRouter();
  const sections = metadata.toc ?? EMPTY_SECTIONS;
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const updateActiveSection = () => {
      const headerOffset = 144;
      let currentId = sections[0]?.id ?? "";

      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (element && element.getBoundingClientRect().top <= headerOffset) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sections]);

  return (
    <div className="sticky top-36">
      <Link
        href={
          metadata.type === "blog"
            ? "/blog"
            : metadata.type === "newsletter"
              ? "/newsletter"
              : `/new?type=${metadata.type}`
        }
        aria-label={`${metadata.category} 목록으로 돌아가기`}
        className="flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
      </Link>

      <div className="mt-5 border-t pt-5">
        <p className="font-paperlogy font-semibold">{metadata.category}</p>
        <p className="mt-2 flex items-center gap-2 font-anyvid text-sm text-muted-foreground">
          <CalendarDays aria-hidden="true" className="size-4" />
          {metadata.date}
        </p>
      </div>

      <div className="mt-6 border-t pt-6">
        <label
          htmlFor="news-post-select"
          className="font-paperlogy font-semibold"
        >
          {metadata.type === "blog" ? "블로그 목록" : "글 목록"}
        </label>
        <Select
          value={metadata.slug}
          onValueChange={(value) => {
            if (value && value !== metadata.slug) {
              const post = posts.find((item) => item.slug === value);
              if (post) {
                router.push(getPostHref(post));
              }
            }
          }}
        >
          <SelectTrigger id="news-post-select" className="mt-3 w-full">
            <span className="min-w-0 flex-1 truncate text-left">
              {metadata.title}
            </span>
          </SelectTrigger>
          <SelectContent align="start">
            {posts.map((post) => (
              <SelectItem key={post.slug} value={post.slug}>
                {post.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sections.length > 0 && (
        <nav aria-label="본문 목차" className="mt-7 border-t pt-6">
          <p className="font-paperlogy font-semibold">목차</p>
          <ol className="mt-4 space-y-2 border-l">
            {sections.map((item) => {
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    onClick={() => setActiveId(item.id)}
                    className={cn(
                      "block border-l border-transparent py-1 pl-4 font-anyvid text-sm leading-5 text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand",
                      isActive &&
                        "-ml-px border-l-2 border-brand font-medium text-brand",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}
    </div>
  );
}
