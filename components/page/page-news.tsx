import PageNav from "@/components/page/page-nav";
import PageNewsContent from "@/components/page/page-news-content";
import PageTitle from "@/components/page/page-title";
import { NEWS_SECTIONS, type NewsSection } from "@/lib/news";

type PageNewsProps = {
  item: NewsSection;
};

export default function PageNews({ item }: PageNewsProps) {
  return (
    <>
      <PageTitle
        icon={item.icon}
        eyebrow={item.eyebrow}
        title={item.title}
        description={item.description}
      />
      <PageNav
        ariaLabel="런조아 소식 유형"
        items={NEWS_SECTIONS.map((section) => ({
          label: section.label,
          href: section.href,
          active: section.href === item.href,
        }))}
      />
      <PageNewsContent item={item} />
    </>
  );
}
