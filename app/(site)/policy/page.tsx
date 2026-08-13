import type { Metadata } from "next";
import { Scale } from "lucide-react";

import { OPERATION_DOCUMENT } from "@/lib/document";

import PageDocument from "@/components/page/page-document";

export const metadata: Metadata = {
  title: "운영정책",
  description:
    "런조아의 마라톤 대회 정보 등록, 표시, 수정 및 권리 보호 기준을 안내합니다.",
  alternates: {
    canonical: "/policy",
  },
};

export default function PolicyPage() {
  return <PageDocument document={OPERATION_DOCUMENT} icon={Scale} />;
}
