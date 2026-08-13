import PageNav from "@/components/page/page-nav";
import PageNewsContent from "@/components/page/page-news-content";
import PageTitle from "@/components/page/page-title";
import { NEWS_ITEMS, type NewsItem } from "@/lib/news";

type PageNewsProps = {
  item: NewsItem;
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
        items={NEWS_ITEMS.map((newsItem) => ({
          label: newsItem.label,
          href: `/news?type=${newsItem.type}`,
          active: newsItem.type === item.type,
        }))}
      />
      <PageNewsContent item={item} />
    </>
  );
}
