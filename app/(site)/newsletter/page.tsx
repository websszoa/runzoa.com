import type { Metadata } from "next";

import PageNews from "@/components/page/page-news";
import { getNewsSection } from "@/lib/news";

export const metadata: Metadata = {
  title: "뉴스레터",
  description: "런조아가 엄선한 마라톤 대회와 러닝 소식을 확인하세요.",
  alternates: {
    canonical: "/newsletter",
  },
};

export default function NewsletterPage() {
  return <PageNews item={getNewsSection("newsletter")} />;
}
