import type { LucideIcon } from "lucide-react";

import PageNav from "@/components/page/page-nav";
import PageTitle from "@/components/page/page-title";
import PageDocumentContent from "@/components/page/page-document-content";
import type { LegalDocument } from "@/lib/document";

const DOCUMENT_LINKS = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "운영정책", href: "/policy" },
];

type PageDocumentProps = {
  document: LegalDocument;
  icon: LucideIcon;
};

export default function PageDocument({ document, icon }: PageDocumentProps) {
  return (
    <>
      <PageTitle
        icon={icon}
        eyebrow={document.eyebrow}
        title={document.title}
        description={document.description}
      />
      <PageNav
        ariaLabel="정책 문서"
        items={DOCUMENT_LINKS.map((item) => ({
          ...item,
          active: item.label === document.title,
        }))}
      />
      <PageDocumentContent document={document} />
    </>
  );
}
