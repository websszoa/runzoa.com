import { BookOpenText, Check, FileText } from "lucide-react";

type PageSupportLeftProps = {
  title: string;
  description: string;
  items: readonly string[];
};

export default function PageSupportLeft({
  title,
  description,
  items,
}: PageSupportLeftProps) {
  return (
    <section
      aria-labelledby="support-guide-title"
      className="lg:sticky lg:top-36"
    >
      <h2
        id="support-guide-title"
        className="flex items-center gap-2 font-paperlogy text-xl font-semibold tracking-tight"
      >
        <FileText aria-hidden="true" className="size-5 text-foreground" />
        {title}
      </h2>
      <p className="mt-4 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <ul className="mt-7 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 font-anyvid text-sm leading-6 text-muted-foreground"
          >
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand">
              <Check aria-hidden="true" className="size-3 text-white" />
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-9 border-t pt-6">
        <h3 className="flex items-center gap-2 font-paperlogy text-xl font-semibold">
          <BookOpenText aria-hidden="true" className="size-5 text-foreground" />
          문의 처리 안내
        </h3>
        <p className="mt-3 break-keep font-anyvid text-sm leading-6 text-muted-foreground">
          접수된 문의는 내용을 확인한 후 순차적으로 답변드립니다. 문의 내용에
          따라 추가 정보를 요청할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
