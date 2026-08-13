import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bookmark,
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Eye,
  Heart,
  Mail,
  MessagesSquare,
  Share2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Marathon } from "@/lib/marathons";
import {
  getCurrentKoreanDate,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

export type DashboardStats = {
  member: { total: number; google: number; kakao: number; naver: number };
  contact: { total: number; pending: number; processing: number; completed: number };
  newsletter: { total: number; active: number; canceled: number };
  reaction: {
    views: number;
    likes: number;
    favorites: number;
    shares: number;
  };
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

export type DashboardReaction = {
  id: string;
  slug: string;
  name: string;
  views: number;
  likes: number;
  favorites: number;
  shares: number;
};

type AdminDashboardProps = {
  marathons: Marathon[];
  hasMarathonError: boolean;
  stats: DashboardStats;
  recentMembers: DashboardMember[];
  recentContacts: DashboardContact[];
  recentNewsletters: DashboardNewsletter[];
  topReactions: DashboardReaction[];
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
  marathons,
  hasMarathonError,
  stats,
  recentMembers,
  recentContacts,
  recentNewsletters,
  topReactions,
}: AdminDashboardProps) {
  const today = getCurrentKoreanDate();
  const marathonStats = {
    total: marathons.length,
    open: marathons.filter(
      (marathon) => getRegistrationStatus(marathon) === "접수중",
    ).length,
    waiting: marathons.filter(
      (marathon) => getRegistrationStatus(marathon) === "접수예정",
    ).length,
    closed: marathons.filter(
      (marathon) => getRegistrationStatus(marathon) === "접수마감",
    ).length,
  };
  const recentMarathons = [...marathons]
    .filter(({ event }) => event.startDate >= today)
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate))
    .slice(0, 5);
  const reactionTotal =
    stats.reaction.likes + stats.reaction.favorites + stats.reaction.shares;

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">대시보드</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          회원, 문의사항, 마라톤과 사용자 반응 현황을 한눈에 확인하세요.
        </p>
      </header>

      {hasMarathonError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          마라톤 API 데이터를 불러오지 못했습니다.
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard
          href="/admin/marathons"
          label="마라톤"
          value={marathonStats.total}
          icon={CalendarDays}
          color="text-brand"
        >
          <span className="text-blue-600">접수중 {marathonStats.open}</span>
          <span className="text-amber-600">예정 {marathonStats.waiting}</span>
          <span className="text-gray-500">마감 {marathonStats.closed}</span>
        </StatCard>
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
        <StatCard
          href="/admin/reactions"
          label="리액션"
          value={reactionTotal}
          icon={Heart}
          color="text-rose-600"
          className="col-span-2 sm:col-span-1"
        >
          <span className="inline-flex items-center gap-1">
            <Heart className="size-3 text-rose-400" aria-hidden="true" />
            {stats.reaction.likes}
          </span>
          <span className="inline-flex items-center gap-1">
            <Bookmark className="size-3 text-amber-400" aria-hidden="true" />
            {stats.reaction.favorites}
          </span>
          <span className="inline-flex items-center gap-1">
            <Share2 className="size-3 text-sky-400" aria-hidden="true" />
            {stats.reaction.shares}
          </span>
        </StatCard>
      </dl>

      <div className="grid gap-4 lg:grid-cols-2">
        <RecentPanel
          title="다가오는 마라톤"
          icon={CalendarDays}
          color="text-brand"
          href="/admin/marathons"
        >
          {recentMarathons.length === 0 ? (
            <EmptyList />
          ) : (
            recentMarathons.map((marathon) => {
              const status = getRegistrationStatus(marathon);
              return (
                <li
                  key={marathon.id}
                  className="flex min-h-[65px] items-center gap-3 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/marathon/${marathon.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-anyvid text-sm hover:text-brand"
                    >
                      {marathon.name}
                    </Link>
                    <p className="mt-0.5 font-anyvid text-xs text-muted-foreground">
                      {marathon.event.startDate.replaceAll("-", ".")} ·{" "}
                      {marathon.location.region ?? "지역 미정"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`shrink-0 font-anyvid text-xs ${getRegistrationBadgeClassName(status)}`}
                  >
                    {getRegistrationLabel(status)}
                  </Badge>
                </li>
              );
            })
          )}
        </RecentPanel>

        <RecentPanel
          title="최근 회원가입"
          icon={Users}
          color="text-blue-500"
          href="/admin/users"
        >
          {recentMembers.map((member) => (
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
          {recentContacts.map((contact) => (
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
          {recentNewsletters.map((newsletter) => (
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

      <section className="space-y-3" aria-labelledby="reaction-ranking-title">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-rose-500" aria-hidden="true" />
            <h2
              id="reaction-ranking-title"
              className="font-paperlogy text-lg font-semibold"
            >
              리액션 TOP {topReactions.length}
            </h2>
          </div>
          <MoreLink href="/admin/reactions" />
        </div>
        <div className="overflow-hidden rounded-lg border bg-white font-anyvid">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[50px] text-center">No</TableHead>
                <TableHead>마라톤명</TableHead>
                <TableHead className="w-[80px] text-center text-blue-500">
                  페이지뷰
                </TableHead>
                <TableHead className="w-[70px] text-center text-rose-500">
                  좋아요
                </TableHead>
                <TableHead className="w-[80px] text-center text-amber-500">
                  즐겨찾기
                </TableHead>
                <TableHead className="w-[70px] text-center text-sky-500">
                  공유
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold">
                  반응 합계
                </TableHead>
                <TableHead className="w-[60px] text-center">상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topReactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <EmptyList />
                  </TableCell>
                </TableRow>
              ) : (
                topReactions.map((marathon, index) => (
                  <TableRow key={marathon.id} className="hover:bg-gray-50">
                    <TableCell className="text-center text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/marathon/${marathon.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block max-w-[320px] truncate text-sm hover:text-brand"
                      >
                        {marathon.name}
                      </Link>
                    </TableCell>
                    <NumberCell value={marathon.views} color="text-blue-500" />
                    <NumberCell value={marathon.likes} color="text-rose-500" />
                    <NumberCell
                      value={marathon.favorites}
                      color="text-amber-500"
                    />
                    <NumberCell value={marathon.shares} color="text-sky-500" />
                    <NumberCell
                      value={
                        marathon.likes + marathon.favorites + marathon.shares
                      }
                      color="font-semibold text-foreground"
                    />
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={
                          <Link
                            href={`/marathon/${marathon.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${marathon.name} 상세 보기`}
                          />
                        }
                      >
                        <Eye className="size-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
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
    <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
      <Activity className="size-7" aria-hidden="true" />
      <p className="font-anyvid text-sm">데이터가 없습니다.</p>
    </div>
  );
}

function NumberCell({ value, color }: { value: number; color: string }) {
  return (
    <TableCell className={`text-center tabular-nums ${color}`}>
      {value.toLocaleString("ko-KR")}
    </TableCell>
  );
}
