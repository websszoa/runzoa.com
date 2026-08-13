import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

import PageDocument from "@/components/page/page-document";
import { PRIVACY_DOCUMENT } from "@/lib/document";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "런조아의 개인정보 처리 목적, 항목, 보유 기간과 이용자 권리를 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <PageDocument document={PRIVACY_DOCUMENT} icon={ShieldCheck} />;
}
