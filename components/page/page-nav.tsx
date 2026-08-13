import Link from "next/link";

import { cn } from "@/lib/utils";

export type PageNavItem = {
  label: string;
  href: string;
  active: boolean;
};

type PageNavProps = {
  ariaLabel: string;
  items: readonly PageNavItem[];
};

export default function PageNav({ ariaLabel, items }: PageNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="border-b bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md bg-gray-50 px-4 py-2 font-anyvid text-sm text-muted-foreground",
              item.active && "bg-brand/10 font-medium text-brand",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
