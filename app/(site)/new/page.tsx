import type { Metadata } from "next";

import PageNews from "@/components/page/page-news";
import { getNewsSection } from "@/lib/news";

export const metadata: Metadata = {
  title: "소식",
  description: "런조아 공지사항과 서비스 업데이트를 확인하세요.",
  alternates: {
    canonical: "/new",
  },
};

type NewPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function NewPage({ searchParams }: NewPageProps) {
  const params = await searchParams;
  const requestedType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;
  const type = requestedType === "updates" ? "updates" : "notice";

  return <PageNews item={getNewsSection(type)} />;
}
