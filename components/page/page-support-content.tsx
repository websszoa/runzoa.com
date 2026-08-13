import PageSupportForm from "@/components/page/page-support-form";
import PageSupportLeft from "@/components/page/page-support-left";
import type { SupportItem } from "@/lib/support";

type PageSupportContentProps = {
  item: SupportItem;
};

export default function PageSupportContent({ item }: PageSupportContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <PageSupportLeft
          title={item.guideTitle}
          description={item.guideDescription}
          items={item.guideItems}
        />

        <PageSupportForm key={item.type} item={item} />
      </div>
    </div>
  );
}
