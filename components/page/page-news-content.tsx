import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  HandHeart,
  Inbox,
  MailOpen,
  Rss,
} from "lucide-react";

import DialogNewsletter from "@/components/dialog/dialog-newsletter";
import { getNewsPosts, type NewsItem } from "@/lib/news";

type PageNewsContentProps = {
  item: NewsItem;
};

export default async function PageNewsContent({ item }: PageNewsContentProps) {
  const Icon = item.icon;
  const posts = await getNewsPosts(item.type);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
        <section
          aria-labelledby="news-guide-title"
          className="lg:sticky lg:top-36"
        >
          <p className="font-paperlogy text-xs font-semibold tracking-[0.16em] text-brand">
            {item.eyebrow}
          </p>
          <h2
            id="news-guide-title"
            className="mt-3 flex items-center gap-2 break-keep font-paperlogy text-xl font-semibold tracking-tight"
          >
            <Icon aria-hidden="true" className="size-5 shrink-0" />
            {item.title}
          </h2>
          <p className="mt-4 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>

          <div className="mt-9 border-y py-6">
            <h3 className="flex items-center gap-2 font-paperlogy text-lg font-semibold">
              <Rss aria-hidden="true" className="size-5" />
              새로운 소식
            </h3>
            <p className="mt-3 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
              새로운 글이 등록되면 최신순으로 확인할 수 있습니다. 중요한 운영
              안내는 공지사항을 통해 먼저 전달합니다.
            </p>
          </div>

          {item.type === "newsletter" && (
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-brand/15 bg-linear-to-br from-brand/[0.06] via-background to-amber-50 p-5">
              <span
                className="absolute -top-8 -right-8 size-24 rounded-full bg-brand/[0.07]"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-sm">
                    <MailOpen className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="break-keep font-paperlogy text-base font-semibold">
                    매주 정보를 받고 싶다면
                  </h3>
                </div>
                <p className="mt-3 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
                  새로 등록된 대회와 접수 일정, 놓치기 아쉬운 러닝 소식을
                  한눈에 보기 좋게 정리해 보내드려요.
                </p>
                <DialogNewsletter
                  subscriptionSource="뉴스레터 페이지"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 font-anyvid text-sm font-semibold text-white transition-colors hover:bg-brand/90 sm:w-auto"
                >
                  <HandHeart className="size-4" aria-hidden="true" />
                  뉴스레터 구독하기
                </DialogNewsletter>
              </div>
            </div>
          )}
        </section>

        <section aria-labelledby="news-list-title">
          <div className="mb-6">
            <h2
              id="news-list-title"
              className="font-paperlogy text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {item.label}
            </h2>
            <p className="mt-2 font-anyvid text-sm leading-6 text-muted-foreground">
              최신 소식을 순서대로 확인해 보세요.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.title}
                  href={`/news/${post.slug}`}
                  className="group flex min-h-64 flex-col rounded-2xl border bg-background p-5 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-lg hover:shadow-red-950/5 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-brand/10 px-3 py-1 font-anyvid text-xs font-medium text-brand">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 font-anyvid text-xs text-muted-foreground">
                      <CalendarDays aria-hidden="true" className="size-3.5" />
                      {post.date}
                    </span>
                  </div>
                  <div className="mt-auto pt-10">
                    <h3 className="break-keep font-paperlogy font-semibold text-xl leading-7">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-5 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
                      {post.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-anyvid text-sm font-medium text-brand">
                      글 읽기
                      <ArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 px-6 text-center">
              <Inbox
                aria-hidden="true"
                className="size-8 text-muted-foreground"
              />
              <p className="mt-4 font-paperlogy text-lg font-semibold">
                아직 등록된 글이 없습니다
              </p>
              <p className="mt-2 font-anyvid text-sm text-muted-foreground">
                새로운 소식을 준비하고 있어요.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
