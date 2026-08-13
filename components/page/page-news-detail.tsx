import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import PageNav from "@/components/page/page-nav";
import PageNewsToc from "@/components/page/page-news-toc";
import PageTitle from "@/components/page/page-title";
import {
  NEWS_ITEMS,
  getNewsItem,
  getNewsPosts,
  type NewsPostMetadata,
} from "@/lib/news";

type PageNewsDetailProps = {
  metadata: NewsPostMetadata;
  children: React.ReactNode;
};

export default async function PageNewsDetail({
  metadata,
  children,
}: PageNewsDetailProps) {
  const newsType = getNewsItem(metadata.type);
  const relatedPosts = await getNewsPosts(metadata.type);

  return (
    <>
      <PageTitle
        icon={newsType.icon}
        eyebrow={newsType.eyebrow}
        title={metadata.title}
        description={metadata.description}
        meta={`게시일 ${metadata.date}`}
      />
      <PageNav
        ariaLabel="런조아 소식 유형"
        items={NEWS_ITEMS.map((item) => ({
          label: item.label,
          href: `/news?type=${item.type}`,
          active: item.type === metadata.type,
        }))}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8 lg:py-16">
        <aside className="hidden lg:block">
          <PageNewsToc metadata={metadata} posts={relatedPosts} />
        </aside>

        <div className="min-w-0">
          <div className="mb-6 flex items-center lg:hidden">
            <Link
              href={`/news?type=${metadata.type}`}
              aria-label={`${metadata.category} 목록으로 돌아가기`}
              className="flex size-9 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:border-brand/30 hover:bg-brand/5 hover:text-brand"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {metadata.toc && metadata.toc.length > 0 && (
            <details className="mb-8 rounded-sm border bg-muted/20 p-4 lg:hidden">
              <summary className="cursor-pointer font-paperlogy text-base font-semibold">
                목차 보기
              </summary>
              <ol className="mt-4 grid gap-2 border-t pt-4 sm:grid-cols-2">
                {metadata.toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block py-1 font-anyvid text-sm leading-6 text-muted-foreground hover:text-brand"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <article className="min-w-0 space-y-7">{children}</article>
        </div>
      </div>
    </>
  );
}
