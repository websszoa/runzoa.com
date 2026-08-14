import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/page/page-title";
import AccountWithdrawal from "@/components/mypage/account-withdrawal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "런조아 회원 정보와 이용 내역을 확인하세요.",
  robots: { index: false, follow: false },
};

type ProfileRow = {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  signup_provider: string | null;
  role: "admin" | "user";
  visit_count: number;
  created_at: string;
};

type ContactRow = {
  id: string;
  type: string;
  title: string;
  status: "대기중" | "처리중" | "처리완료";
  reply: string | null;
  created_at: string;
};

type NewsletterRow = {
  status: "구독중" | "구독취소";
  created_at: string;
};

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) redirect("/");

  const [profileResult, contactsResult, newsletterResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, email, avatar_url, signup_provider, role, visit_count, created_at",
      )
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("contacts")
      .select("id, type, title, status, reply, created_at")
      .eq("user_email", user.email)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("newsletters")
      .select("status, created_at")
      .eq("email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const profile = profileResult.data as ProfileRow | null;
  const contacts = (contactsResult.data ?? []) as ContactRow[];
  const newsletter = newsletterResult.data as NewsletterRow | null;
  const fullName =
    profile?.full_name?.trim() ||
    user.user_metadata.full_name ||
    user.user_metadata.name ||
    "러너";
  const avatarUrl =
    profile?.avatar_url ||
    user.user_metadata.avatar_url ||
    user.user_metadata.picture ||
    null;
  const memberSince = profile?.created_at ?? user.created_at;
  const provider = providerLabel(
    profile?.signup_provider ?? user.app_metadata.provider,
  );

  return (
    <>
      <PageTitle
        icon={UserRound}
        eyebrow="RUNZOA MY PAGE"
        title="마이페이지"
        description="나의 회원 정보와 런조아 이용 내역을 한눈에 확인해 보세요."
      />

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8 sm:py-9">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-20 size-64 rounded-full bg-brand/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 left-1/3 size-52 rounded-full bg-emerald-500/15 blur-3xl"
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <Avatar className="size-20 border-4 border-white/10 bg-white/10 sm:size-24">
                <AvatarImage src={avatarUrl ?? undefined} alt="" />
                <AvatarFallback className="bg-brand font-paperlogy text-3xl text-white">
                  {fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge className="bg-brand text-white hover:bg-brand">
                    {profile?.role === "admin" ? "관리자" : "런조아 회원"}
                  </Badge>
                  <span className="font-anyvid text-xs text-slate-400">
                    {provider} 로그인
                  </span>
                </div>
                <h2 className="font-paperlogy text-2xl font-semibold sm:text-3xl">
                  {fullName}님, 반가워요!
                </h2>
                <p className="mt-2 break-all font-anyvid text-sm text-slate-400">
                  {profile?.email ?? user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
              <Sparkles className="size-5 text-amber-300" aria-hidden="true" />
              <div>
                <p className="font-anyvid text-xs text-slate-400">런조아 방문</p>
                <p className="mt-0.5 font-paperlogy text-xl font-semibold">
                  {(profile?.visit_count ?? 1).toLocaleString("ko-KR")}번째
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          aria-label="회원 이용 현황"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatusCard
            icon={CalendarDays}
            label="가입일"
            value={formatKoreanDate(memberSince)}
            color="text-blue-600"
            background="bg-blue-50"
          />
          <StatusCard
            icon={Mail}
            label="뉴스레터"
            value={newsletter?.status ?? "미구독"}
            color={newsletter?.status === "구독중" ? "text-emerald-600" : "text-slate-500"}
            background={newsletter?.status === "구독중" ? "bg-emerald-50" : "bg-slate-100"}
          />
          <StatusCard
            icon={MessageCircle}
            label="최근 문의"
            value={contacts.length > 0 ? `${contacts.length}건 확인` : "문의 없음"}
            color="text-brand"
            background="bg-brand/5"
          />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]">
          <section className="overflow-hidden rounded-2xl border bg-white">
            <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-paperlogy text-lg font-semibold">최근 문의</h2>
                <p className="mt-1 font-anyvid text-xs text-muted-foreground">
                  접수한 문의와 관리자 답변 상태를 확인하세요.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/support?type=inquiry" />}
              >
                문의하기
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>

            {contacts.length > 0 ? (
              <div className="divide-y">
                {contacts.map((contact) => (
                  <article key={contact.id} className="px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="font-anyvid text-[11px]">
                            {contact.type}
                          </Badge>
                          <span className="font-anyvid text-xs text-muted-foreground">
                            {formatKoreanDate(contact.created_at)}
                          </span>
                        </div>
                        <h3 className="mt-2 truncate font-paperlogy text-sm font-semibold">
                          {contact.title}
                        </h3>
                        {contact.reply && (
                          <p className="mt-2 line-clamp-2 whitespace-pre-wrap font-anyvid text-sm leading-6 text-muted-foreground">
                            {contact.reply}
                          </p>
                        )}
                      </div>
                      <ContactStatus status={contact.status} />
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand/5 text-brand">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-4 font-paperlogy text-sm font-semibold">
                  아직 접수한 문의가 없어요.
                </p>
                <p className="mt-1 font-anyvid text-xs text-muted-foreground">
                  궁금한 점이 있다면 언제든 편하게 남겨주세요.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-2xl border bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-brand" aria-hidden="true" />
                <h2 className="font-paperlogy text-lg font-semibold">계정 정보</h2>
              </div>
              <dl className="mt-5 space-y-4 font-anyvid text-sm">
                <InfoRow label="이름" value={fullName} />
                <InfoRow label="이메일" value={profile?.email ?? user.email} breakAll />
                <InfoRow label="로그인" value={provider} />
                <InfoRow label="회원 등급" value={profile?.role === "admin" ? "관리자" : "일반 회원"} />
              </dl>
            </section>

            <section className="rounded-2xl border bg-white p-5 sm:p-6">
              <h2 className="font-paperlogy text-lg font-semibold">빠른 메뉴</h2>
              <div className="mt-4 grid gap-2">
                <QuickLink href="/marathon-search" icon={Search} label="나에게 맞는 대회 찾기" />
                <QuickLink href="/marathon-calendar" icon={CalendarDays} label="대회 일정 확인하기" />
                <QuickLink href="/marathon-map" icon={MapPin} label="가까운 대회 찾아보기" />
                <div className="flex items-center justify-between rounded-xl border border-dashed bg-muted/20 px-4 py-3 text-muted-foreground">
                  <span className="flex items-center gap-3 font-anyvid text-sm">
                    <Heart className="size-4" aria-hidden="true" />
                    즐겨찾기
                  </span>
                  <Badge variant="secondary" className="font-anyvid text-[10px]">준비 중</Badge>
                </div>
              </div>
            </section>

            <AccountWithdrawal />
          </aside>
        </div>
      </div>
    </>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  color,
  background,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  color: string;
  background: string;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border bg-white p-5">
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${background} ${color}`}>
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="font-anyvid text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 truncate font-paperlogy text-base font-semibold">{value}</p>
      </div>
    </article>
  );
}

function ContactStatus({ status }: { status: ContactRow["status"] }) {
  const style =
    status === "처리완료"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "처리중"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-50 text-slate-600";

  return (
    <Badge variant="outline" className={`shrink-0 font-anyvid ${style}`}>
      {status === "처리완료" ? (
        <CheckCircle2 aria-hidden="true" />
      ) : (
        <Clock3 aria-hidden="true" />
      )}
      {status}
    </Badge>
  );
}

function InfoRow({ label, value, breakAll = false }: { label: string; value: string; breakAll?: boolean }) {
  return (
    <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 border-b pb-4 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right font-medium text-foreground ${breakAll ? "break-all" : ""}`}>{value}</dd>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof Search; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border px-4 py-3 transition-colors hover:border-brand/30 hover:bg-brand/5"
    >
      <span className="flex items-center gap-3 font-anyvid text-sm">
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-brand" aria-hidden="true" />
        {label}
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
    </Link>
  );
}

function providerLabel(provider: string | null | undefined) {
  if (provider === "kakao") return "카카오";
  if (provider === "naver" || provider === "custom:naver") return "네이버";
  if (provider === "email") return "이메일";
  return "구글";
}

function formatKoreanDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}
