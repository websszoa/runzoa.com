import PageDocumentTox from "@/components/page/page-document-tox";
import type { LegalDocument } from "@/lib/document";

type PageDocumentContentProps = {
  document: LegalDocument;
};

export default function PageDocumentContent({
  document,
}: PageDocumentContentProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 sm:py-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="hidden lg:block">
        <PageDocumentTox
          title={document.title}
          sections={document.sections}
        />
      </aside>

      <div className="min-w-0">
        <details className="mb-8 rounded-sm border bg-muted/20 p-4 lg:hidden">
          <summary className="cursor-pointer font-paperlogy text-base font-semibold">
            목차 보기
          </summary>
          <ol className="mt-4 grid gap-2 border-t pt-4 sm:grid-cols-2">
            {document.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block py-1 font-anyvid text-sm leading-6 text-muted-foreground hover:text-brand"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </details>

        <article className="divide-y">
          {document.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-24 py-9 first:pt-0 last:pb-0"
            >
              <h2
                id={`${section.id}-title`}
                className="font-paperlogy text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="space-y-1 pt-1 sm:space-y-2">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 size-1 shrink-0 rounded-full bg-brand"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
          <footer className="mt-10 pt-6 text-right font-anyvid text-sm text-muted-foreground">
            시행일 : {document.effectiveDate}
          </footer>
        </article>
      </div>
    </div>
  );
}
