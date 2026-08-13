import type { Metadata } from "next";
import { ScrollText } from "lucide-react";

import { TERMS_DOCUMENT } from "@/lib/document";
import PageDocument from "@/components/page/page-document";

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "런조아 마라톤 정보 서비스의 이용 조건과 권리 및 의무를 안내합니다.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <PageDocument document={TERMS_DOCUMENT} icon={ScrollText} />;
}
