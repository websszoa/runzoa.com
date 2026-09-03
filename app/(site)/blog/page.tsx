import type { Metadata } from "next";

import PageNews from "@/components/page/page-news";
import { getNewsSection } from "@/lib/news";

export const metadata: Metadata = {
  title: "블로그",
  description:
    "대회 준비, 러닝 팁과 전국의 다채로운 레이스 이야기를 확인하세요.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return <PageNews item={getNewsSection("blog")} />;
}
