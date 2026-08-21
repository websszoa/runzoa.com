import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarathonHeaderContent } from "@/lib/marathons";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Eye,
  Lightbulb,
  MousePointerClick,
  Search,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  ANALYTICS_REPORTS,
  getAnalyticsReport,
  type AnalyticsMetric,
} from "@/lib/analytics-reports";

import MarathonHeader from "@/components/marathon/marathon-header";
import PageAnalytics from "@/components/page/page-analytics";

export const metadata: Metadata = {
  title: "런조아 통계",
  description:
    "런조아 웹사이트와 소셜 채널의 날짜별 성과, 현재 추이와 개선 과제를 확인하세요.",
  alternates: { canonical: "/analytics" },
};

const metricIcons = [Users, Timer, Eye, Search, Sparkles, MousePointerClick];

const ANALYTICS_HEADER = {
  icon: BarChart3,
  eyebrow: "런조아 데이터 인사이트",
  title: ["숫자를 기록하고,", "더 나은 방향을 찾습니다."],
  description: [
    "웹사이트와 소셜 채널의 성과를 날짜별로 기록하고 현재 흐름을 확인합니다.",
    "발견한 문제와 다음 개선 과제를 함께 정리합니다.",
  ],
  features: [],
} satisfies MarathonHeaderContent;

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const params = await searchParams;
  const requestedDate = Array.isArray(params.date)
    ? params.date[0]
    : params.date;
  const report = getAnalyticsReport(requestedDate);
  const reportIndex = ANALYTICS_REPORTS.findIndex(
    (item) => item.date === report.date,
  );
  const previousReport = ANALYTICS_REPORTS[reportIndex + 1];
  const maxChannelValue = Math.max(
    ...report.channels.map((channel) => channel.value),
  );

  return (
    <>
      <MarathonHeader {...ANALYTICS_HEADER} />
      <div className="bg-muted/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-14">
          <aside
            className="lg:sticky lg:top-24 lg:self-start"
            aria-label="통계 날짜 선택"
          >
            <div className="rounded-2xl border bg-card p-3">
              <p className="flex items-center gap-2 px-2 py-2 font-paperlogy text-sm font-semibold">
                <CalendarDays
                  className="size-4 text-brand"
                  aria-hidden="true"
                />
                날짜별 리포트
              </p>
              <nav className="mt-1 space-y-1">
                {ANALYTICS_REPORTS.map((item) => {
                  const isCurrent = item.date === report.date;
                  return (
                    <Link
                      key={item.date}
                      href={`/analytics?date=${item.date}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 font-anyvid text-sm transition-colors",
                        isCurrent
                          ? "bg-brand text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="min-w-0 space-y-10">
            <header>
              <p className="font-anyvid text-sm text-brand mb-2">
                {report.period}
              </p>
              <div>
                <h2 className="font-paperlogy text-3xl font-semibold">
                  {report.label} 리포트
                </h2>
                <p className="mt-3 font-anyvid text-sm leading-6 text-muted-foreground">
                  {report.summary}
                </p>
              </div>
            </header>

            <section aria-labelledby="analytics-overview-title">
              <SectionTitle
                id="analytics-overview-title"
                icon={BarChart3}
                title="핵심 지표"
                description="웹사이트와 Instagram의 현재 규모를 한눈에 확인합니다."
              />
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {report.metrics.map((metric, index) => (
                  <MetricCard
                    key={metric.label}
                    metric={metric}
                    icon={metricIcons[index]}
                  />
                ))}
              </div>
            </section>

            <section aria-labelledby="analytics-trend-title">
              <SectionTitle
                id="analytics-trend-title"
                icon={TrendingUp}
                title="현재 추이"
                description={
                  previousReport
                    ? "이전 기록과 비교한 변화입니다."
                    : "첫 기록이므로 채널 구성과 현재 전환 흐름을 기준선으로 표시합니다. 다음 리포트부터 날짜별 증감이 추가됩니다."
                }
              />
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                <Card size="sm" className="shadow-none">
                  <CardHeader className="border-b">
                    <CardTitle className="font-paperlogy text-lg font-semibold">
                      웹 유입 채널
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="gap-4">
                    {report.channels.map((channel) => (
                      <div key={channel.label}>
                        <div className="mb-1.5 flex justify-between gap-4 font-anyvid text-sm">
                          <span className="truncate text-muted-foreground">
                            {channel.label}
                          </span>
                          <strong className="font-semibold tabular-nums">
                            {channel.displayValue}
                          </strong>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{
                              width: `${(channel.value / maxChannelValue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card size="sm" className="shadow-none">
                  <CardHeader className="border-b">
                    <CardTitle className="font-paperlogy text-lg font-semibold">
                      발견에서 방문까지
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="gap-5">
                    <FunnelRow
                      label="Instagram 조회"
                      value="105.6만"
                      width="100%"
                    />
                    <FunnelRow
                      label="Instagram 도달"
                      value="24.5만"
                      width="72%"
                    />
                    <FunnelRow
                      label="Instagram 반응"
                      value="3.4만"
                      width="45%"
                    />
                    <FunnelRow label="프로필 방문" value="9,645" width="28%" />
                    <FunnelRow
                      label="외부 링크 클릭"
                      value="1,552"
                      width="16%"
                    />
                    <p className="border-t pt-4 font-anyvid text-xs leading-5 text-muted-foreground">
                      서로 다른 집계 기준의 지표이므로 직접 전환율이 아닌 개선
                      방향을 보는 참고 흐름입니다.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section aria-labelledby="analytics-observation-title">
              <SectionTitle
                id="analytics-observation-title"
                icon={CheckCircle2}
                title="관찰된 흐름"
                description="원본 자료에서 확인되는 긍정적 신호와 이용 패턴입니다."
              />
              <InsightGrid items={report.observations} tone="positive" />
            </section>

            <section aria-labelledby="analytics-problem-title">
              <SectionTitle
                id="analytics-problem-title"
                icon={AlertTriangle}
                title="문제점"
                description="성장 과정에서 우선 확인하거나 보완할 항목입니다."
              />
              <InsightGrid items={report.issues} tone="warning" />
            </section>

            <section aria-labelledby="analytics-improvement-title">
              <SectionTitle
                id="analytics-improvement-title"
                icon={Lightbulb}
                title="개선 제안"
                description="다음 리포트 전까지 실행하고 측정할 수 있는 과제입니다."
              />
              <div className="mt-5 divide-y overflow-hidden rounded-2xl border bg-card">
                {report.improvements.map((item, index) => (
                  <article key={item.title} className="flex gap-4 p-5 sm:p-6">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand font-paperlogy text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-paperlogy font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-1 font-anyvid text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="analytics-content-title">
              <SectionTitle
                id="analytics-content-title"
                icon={Sparkles}
                title="주요 콘텐츠"
                description="웹과 Instagram에서 눈에 띈 콘텐츠를 함께 봅니다."
              />
              <div className="mt-5 overflow-hidden rounded-2xl border bg-card">
                {report.popularContent.map((item) => (
                  <article
                    key={`${item.channel}-${item.title}`}
                    className="grid gap-2 border-b p-4 last:border-b-0 sm:grid-cols-[110px_minmax(0,1fr)_auto] sm:items-center sm:px-5"
                  >
                    <Badge variant="outline">{item.channel}</Badge>
                    <div className="min-w-0">
                      <h3 className="truncate font-paperlogy text-sm font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-0.5 font-anyvid text-xs text-muted-foreground">
                        {item.note}
                      </p>
                    </div>
                    <strong className="font-anyvid text-sm font-semibold text-brand">
                      {item.value}
                    </strong>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="analytics-attachment-title">
              <SectionTitle
                id="analytics-attachment-title"
                icon={Eye}
                title="첨부 자료"
                description="분석에 사용한 원본 이미지를 눌러 크게 확인할 수 있습니다."
              />
              <div className="mt-5">
                <PageAnalytics attachments={report.attachments} />
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

function SectionTitle({
  id,
  icon: Icon,
  title,
  description,
}: {
  id: string;
  icon: typeof BarChart3;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <h2 id={id} className="font-paperlogy text-2xl font-semibold">
          {title}
        </h2>
      </div>
      <p className="mt-1 font-anyvid text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function MetricCard({
  metric,
  icon: Icon,
}: {
  metric: AnalyticsMetric;
  icon: typeof Users;
}) {
  return (
    <Card className="gap-4 p-5 shadow-none">
      <div className="flex items-center justify-between">
        <p className="font-anyvid text-sm text-muted-foreground">
          {metric.label}
        </p>
        <span className="flex size-8 items-center justify-center rounded-full bg-brand/8 text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div>
        <strong className="font-paperlogy text-3xl font-semibold tabular-nums">
          {metric.value}
        </strong>
        <p className="mt-1 font-anyvid text-xs text-muted-foreground">
          {metric.note}
        </p>
      </div>
    </Card>
  );
}

function FunnelRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-4 font-anyvid text-sm">
        <span className="text-muted-foreground">{label}</span>
        <strong className="font-semibold tabular-nums">{value}</strong>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand" style={{ width }} />
      </div>
    </div>
  );
}

function InsightGrid({
  items,
  tone,
}: {
  items: { title: string; description: string }[];
  tone: "positive" | "warning";
}) {
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.title} className="gap-3 p-5 shadow-none">
          <div className="flex items-start gap-3">
            <span
              className={cn(
                "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full",
                tone === "positive"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "bg-amber-500/10 text-amber-600",
              )}
            >
              {tone === "positive" ? (
                <CheckCircle2 className="size-4" aria-hidden="true" />
              ) : (
                <AlertTriangle className="size-4" aria-hidden="true" />
              )}
            </span>
            <div>
              <h3 className="font-paperlogy text-base font-semibold">
                {item.title}
              </h3>
              <p className="mt-1 font-anyvid text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
