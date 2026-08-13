import {
  CircleAlert,
  ClipboardPlus,
  FilePenLine,
  MessageCircleQuestion,
  type LucideIcon,
} from "lucide-react";

import PageNav from "@/components/page/page-nav";
import PageTitle from "@/components/page/page-title";
import PageSupportContent from "@/components/page/page-support-content";
import {
  SUPPORT_ITEMS,
  type SupportItem,
  type SupportType,
} from "@/lib/support";

const SUPPORT_TITLES: Record<
  SupportType,
  { icon: LucideIcon; title: string }
> = {
  registration: {
    icon: ClipboardPlus,
    title: "새로운 대회를 알려주세요",
  },
  inquiry: {
    icon: MessageCircleQuestion,
    title: "궁금한 점을 물어보세요",
  },
  complaint: {
    icon: CircleAlert,
    title: "불편한 점을 알려주세요",
  },
  correction: {
    icon: FilePenLine,
    title: "잘못된 정보를 알려주세요",
  },
};

type PageSupportProps = {
  item: SupportItem;
};

export default function PageSupport({ item }: PageSupportProps) {
  const pageTitle = SUPPORT_TITLES[item.type];

  return (
    <>
      <PageTitle
        icon={pageTitle.icon}
        eyebrow="RUNZOA SUPPORT"
        title={pageTitle.title}
        description={item.description}
      />

      <PageNav
        ariaLabel="고객지원 유형"
        items={SUPPORT_ITEMS.map((supportItem) => ({
          label: supportItem.label,
          href: `/support?type=${supportItem.type}`,
          active: supportItem.type === item.type,
        }))}
      />
      <PageSupportContent item={item} />
    </>
  );
}
