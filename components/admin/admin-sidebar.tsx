"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ChevronUp,
  ExternalLink,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MessagesSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { APP_ENG_NAME } from "@/lib/constants";

const navigation = [
  { icon: LayoutDashboard, label: "대시보드", href: "/admin" },
  { icon: MessagesSquare, label: "문의사항", href: "/admin/contact" },
  { icon: Users, label: "회원관리", href: "/admin/users" },
  { icon: CalendarDays, label: "마라톤", href: "/admin/marathons" },
  { icon: Mail, label: "뉴스레터", href: "/admin/newsletter" },
  { icon: Heart, label: "리액션", href: "/admin/reactions" },
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

      <div className="hidden border-t p-4 lg:block">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl border bg-background p-2.5 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
            <Avatar size="lg">
              <AvatarFallback className="bg-brand/10 font-paperlogy font-semibold text-brand">
                A
              </AvatarFallback>
              <AvatarBadge className="bg-emerald-500" />
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-paperlogy text-sm font-semibold">
                런조아 관리자
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 font-anyvid text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                로그인됨
              </span>
            </span>
            <ChevronUp
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuLabel className="font-anyvid">
              관리자 계정
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="font-anyvid">
              <ShieldCheck aria-hidden="true" />
              관리자 권한
            </DropdownMenuItem>
            <DropdownMenuItem disabled className="font-anyvid">
              <LogOut aria-hidden="true" />
              로그아웃 준비 중
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
