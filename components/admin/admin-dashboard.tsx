import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ChevronRight,
  CircleAlert,
  Mail,
  MessagesSquare,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

export type DashboardStats = {
  member: { total: number; google: number; kakao: number; naver: number };
  contact: { total: number; pending: number; processing: number; completed: number };
  newsletter: { total: number; active: number; canceled: number };
};

export type DashboardMember = {
  id: string;
  name: string;
  email: string;
  provider: "google" | "kakao" | "naver";
};

export type DashboardContact = {
  id: string;
  title: string;
  type: string;
  status: "대기중" | "처리중" | "처리완료";
  createdAt: string;
};

export type DashboardNewsletter = {
  id: string;
  email: string;
  source: string;
  status: "구독중" | "구독취소";
};

type AdminDashboardProps = {
  hasDataError: boolean;
  stats: DashboardStats;
  recentMembers: DashboardMember[];
  recentContacts: DashboardContact[];
  recentNewsletters: DashboardNewsletter[];
};

const providerColor = {
  google: "text-red-500",
  kakao: "text-yellow-600",
  naver: "text-emerald-600",
};

const providerLabel = {
  google: "구글",
  kakao: "카카오",
  naver: "네이버",
};

const contactStatusColor = {
  대기중: "border-red-200 bg-red-50 text-red-600",
  처리중: "border-amber-200 bg-amber-50 text-amber-600",
  처리완료: "border-emerald-200 bg-emerald-50 text-emerald-600",
};

export default function AdminDashboard({
  hasDataError,
  stats,
  recentMembers,
  recentContacts,
  recentNewsletters,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">대시보드</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          회원, 문의사항과 뉴스레터 현황을 한눈에 확인하세요.
        </p>
      </header>

      {hasDataError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          일부 관리 데이터를 불러오지 못했습니다.
        </div>
      )}

      <dl className="grid gap-4 sm:grid-cols-3">
        <StatCard
          href="/admin/users"
          label="회원"
          value={stats.member.total}
          icon={Users}
          color="text-blue-600"
        >
          <span className="text-red-500">구글 {stats.member.google}</span>
          <span className="text-yellow-600">카카오 {stats.member.kakao}</span>
          <span className="text-emerald-600">네이버 {stats.member.naver}</span>
        </StatCard>
        <StatCard
          href="/admin/contact"
          label="문의"
          value={stats.contact.total}
          icon={MessagesSquare}
          color="text-emerald-600"
        >
          <span className="text-red-600">대기 {stats.contact.pending}</span>
          <span className="text-amber-600">처리중 {stats.contact.processing}</span>
          <span className="text-emerald-600">완료 {stats.contact.completed}</span>
        </StatCard>
        <StatCard
          href="/admin/newsletter"
          label="뉴스레터"
          value={stats.newsletter.total}
          icon={Mail}
          color="text-violet-600"
        >
          <span className="text-emerald-600">구독중 {stats.newsletter.active}</span>
          <span className="text-gray-500">취소 {stats.newsletter.canceled}</span>
        </StatCard>
      </dl>

      <div className="grid gap-4 xl:grid-cols-3">
        <RecentPanel
          title="최근 회원가입"
          icon={Users}
          color="text-blue-500"
          href="/admin/users"
        >
          {recentMembers.length === 0 ? <EmptyList /> : recentMembers.map((member) => (
            <li
              key={member.id}
              className="flex min-h-[65px] items-center gap-3 px-4 py-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-paperlogy text-xs font-semibold">
                {member.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-anyvid text-sm">{member.name}</p>
                <p className="mt-0.5 truncate font-anyvid text-xs text-muted-foreground">
                  {member.email}
                </p>
              </div>
              <span
                className={`shrink-0 font-anyvid text-xs ${providerColor[member.provider]}`}
              >
                {providerLabel[member.provider]}
              </span>
            </li>
          ))}
        </RecentPanel>

        <RecentPanel
          title="최근 문의사항"
          icon={MessagesSquare}
          color="text-emerald-500"
          href="/admin/contact"
        >
          {recentContacts.length === 0 ? <EmptyList /> : recentContacts.map((contact) => (
            <li
              key={contact.id}
              className="flex min-h-[65px] items-center gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-anyvid text-sm">{contact.title}</p>
                <p className="mt-0.5 font-anyvid text-xs text-muted-foreground">
                  {contact.type} · {contact.createdAt}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 font-anyvid text-xs ${contactStatusColor[contact.status]}`}
              >
                {contact.status}
              </Badge>
            </li>
          ))}
        </RecentPanel>

        <RecentPanel
          title="최근 뉴스레터 구독"
          icon={Mail}
          color="text-violet-500"
          href="/admin/newsletter"
        >
          {recentNewsletters.length === 0 ? <EmptyList /> : recentNewsletters.map((newsletter) => (
            <li
              key={newsletter.id}
              className="flex min-h-[65px] items-center gap-3 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-anyvid text-sm">
                  {newsletter.email}
                </p>
                <p className="mt-0.5 truncate font-anyvid text-xs text-muted-foreground">
                  {newsletter.source}
                </p>
              </div>
              <Badge
                variant="outline"
                className={`shrink-0 font-anyvid text-xs ${
                  newsletter.status === "구독중"
                    ? "border-brand bg-brand text-white"
                    : "border-gray-200 bg-gray-50 text-gray-500"
                }`}
              >
                {newsletter.status}
              </Badge>
            </li>
          ))}
        </RecentPanel>
      </div>

    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  icon: Icon,
  color,
  className = "",
  children,
}: {
  href: string;
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group flex min-h-[142px] flex-col gap-2 rounded-lg border bg-white p-4 transition-colors hover:border-brand/40 ${className}`}
    >
      <div className="flex items-center justify-between">
        <dt className="font-paperlogy text-sm text-muted-foreground">
          {label}
        </dt>
        <Icon className={`size-4 ${color}`} aria-hidden="true" />
      </div>
      <dd className={`font-paperlogy text-3xl font-semibold ${color}`}>
        {value.toLocaleString("ko-KR")}
      </dd>
      <div className="mt-auto flex flex-wrap gap-x-2 gap-y-1 font-anyvid text-xs">
        {children}
      </div>
    </Link>
  );
}

function RecentPanel({
  title,
  icon: Icon,
  color,
  href,
  children,
}: {
  title: string;
  icon: LucideIcon;
  color: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-white">
      <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`size-5 ${color}`} aria-hidden="true" />
          <h2 className="font-paperlogy text-base font-semibold">{title}</h2>
        </div>
        <MoreLink href={href} />
      </div>
      <ul className="divide-y">{children}</ul>
    </section>
  );
}

function MoreLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-0.5 font-anyvid text-xs text-muted-foreground transition-colors hover:text-brand"
    >
      전체보기
      <ChevronRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}

function EmptyList() {
  return (
    <li className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
      <Activity className="size-7" aria-hidden="true" />
      <p className="font-anyvid text-sm">데이터가 없습니다.</p>
    </li>
  );
}
