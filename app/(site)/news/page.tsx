import type { Metadata } from "next";

import PageNews from "@/components/page/page-news";
import { getNewsItem } from "@/lib/news";

export const metadata: Metadata = {
  title: "소식",
  description:
    "런조아 공지사항, 러닝 블로그, 서비스 업데이트와 뉴스레터 소식을 확인하세요.",
  alternates: {
    canonical: "/news",
  },
};

type NewsPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;

  return <PageNews item={getNewsItem(type)} />;
}
