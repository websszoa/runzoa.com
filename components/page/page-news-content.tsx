import Link from "next/link";
import { ArrowRight, CalendarDays, Inbox, Rss } from "lucide-react";

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

          <div className="mt-9 border-t pt-6 border-b pb-6 mb-10">
            <h3 className="flex items-center gap-2 font-paperlogy text-lg font-semibold">
              <Rss aria-hidden="true" className="size-5" />
              새로운 소식
            </h3>
            <p className="mt-3 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
              새로운 글이 등록되면 최신순으로 확인할 수 있습니다. 중요한 운영
              안내는 공지사항을 통해 먼저 전달합니다.
            </p>
          </div>
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
