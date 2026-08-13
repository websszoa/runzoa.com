"use client";

import { useEffect, useState } from "react";

import type { LegalSection } from "@/lib/document";
import { cn } from "@/lib/utils";

type PageDocumentToxProps = {
  title: string;
  sections: readonly LegalSection[];
};

export default function PageDocumentTox({
  title,
  sections,
}: PageDocumentToxProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const updateActiveSection = () => {
      const headerOffset = 112;
      let currentId = sections[0]?.id ?? "";

      for (const section of sections) {
        const element = document.getElementById(section.id);

        if (element && element.getBoundingClientRect().top <= headerOffset) {
          currentId = section.id;
        } else {
          break;
        }
      }

      setActiveId(currentId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [sections]);

  return (
    <nav aria-label={`${title} 목차`} className="sticky top-36">
      <p className="font-paperlogy text-lg font-semibold">목차</p>
      <ol className="mt-4 space-y-2 border-l">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-controls={section.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(section.id)}
                className={cn(
                  "block border-l border-transparent py-1 pl-4 font-anyvid text-sm leading-5 text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand-readable",
                  isActive &&
                    "border-brand font-medium text-brand border-l-2 ml-[-1px]",
                )}
              >
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
