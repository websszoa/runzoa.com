"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  Users,
} from "lucide-react";

import { APP_ENG_NAME } from "@/lib/constants";

const navigation = [
  { icon: LayoutDashboard, label: "대시보드", href: "/admin" },
  { icon: MessagesSquare, label: "문의사항", href: "/admin/contact" },
  { icon: Users, label: "회원관리", href: "/admin/users" },
  { icon: CalendarDays, label: "마라톤", href: "/admin/marathons" },
  { icon: Mail, label: "뉴스레터", href: "/admin/newsletter" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b bg-background lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex h-14 items-center border-b px-5 lg:h-16 lg:px-6">
        <Link
          href="/admin"
          className="font-paperlogy text-xl pt-1 font-black tracking-tight text-brand uppercase"
        >
          {APP_ENG_NAME}
          <span className="ml-2 font-anyvid text-[10px] font-semibold tracking-normal text-muted-foreground uppercase">
            Admin
          </span>
        </Link>
        <Link
          href="/"
          className="ml-auto flex size-10 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:text-brand lg:hidden"
          aria-label="런조아 사이트 열기"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <nav
        aria-label="관리자 메뉴"
        className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:px-4 lg:py-4"
      >
        {navigation.map(({ icon: Icon, label, href }) => {
          const isCurrent = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              className={`flex shrink-0 py-1 sm:py-3 items-center gap-1 sm:gap-3 rounded-xl px-3.5 font-anyvid text-sm transition-colors ${
                isCurrent
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden p-4 lg:block">
        <Link
          href="/"
          className="flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-background font-anyvid text-sm text-muted-foreground transition-colors hover:text-brand"
        >
          사이트 바로가기
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
