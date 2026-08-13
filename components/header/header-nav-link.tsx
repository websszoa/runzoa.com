"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface HeaderNavLinkProps {
  item: {
    label: string;
    href: string;
    icon: LucideIcon;
  };
  onNavigate: () => void;
}

export default function HeaderNavLink({
  item,
  onNavigate,
}: HeaderNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      prefetch
      aria-current={isActive ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "mx-2 flex items-center justify-between gap-3 rounded-md px-4 py-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-brand/5 text-brand"
          : "text-muted-foreground hover:bg-brand/10 hover:text-brand",
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        <span className="font-anyvid">{item.label}</span>
      </div>
      <ChevronRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
