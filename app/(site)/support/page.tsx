import type { Metadata } from "next";

import PageSupport from "@/components/page/page-support";
import { getSupportItem } from "@/lib/support";

export const metadata: Metadata = {
  title: "고객지원",
  description:
    "런조아 대회 등록, 정보 수정, 서비스 문의 및 불편사항을 접수합니다.",
  alternates: {
    canonical: "/support",
  },
};

type SupportPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function SupportPage({ searchParams }: SupportPageProps) {
  const params = await searchParams;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;

  return <PageSupport item={getSupportItem(type)} />;
}
