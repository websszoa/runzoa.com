import Link from "next/link";
import type { Marathon } from "@/lib/marathons";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import {
  formatMarathonDate,
  getCurrentKoreanDate,
} from "@/lib/utils";

export default function MainThisMonth({
  marathons,
}: {
  marathons: Marathon[];
}) {
  const today = getCurrentKoreanDate();
  const currentMonth = today.slice(0, 7);
  const monthNumber = Number(currentMonth.slice(5));
  const monthlyMarathons = marathons
    .filter(
      (marathon) =>
        marathon.event.startDate.startsWith(currentMonth) &&
        marathon.event.startDate >= today,
    )
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate))
    .slice(0, 12);

  if (monthlyMarathons.length === 0) return null;

  return (
    <section
      aria-labelledby="this-month-title"
      className="bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_48%,#ffffff_100%)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-paperlogy text-sm tracking-wide text-brand uppercase">
              This month
            </p>
            <h2
              id="this-month-title"
              className="mt-2 font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              {monthNumber}월에 열리는
              <br />
              러닝 대회를 만나보세요!
            </h2>
            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              이번 달 남은 대회 일정을 개최일 순서로 한눈에 확인해 보세요.
            </p>
          </div>

          <Link
            href="/marathon-calendar"
            className="inline-flex min-h-11 items-center gap-1.5 self-start font-anyvid text-sm font-semibold text-brand md:self-auto"
          >
            전체 달력 보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-background shadow-sm shadow-red-950/[0.03] sm:mt-12">
          <div className="flex items-center gap-2 border-b bg-brand/[0.035] px-5 py-3 font-anyvid text-xs text-muted-foreground sm:px-6">
            <CalendarDays className="size-4 text-brand" aria-hidden="true" />
            {monthNumber}월 남은 대회
            <strong className="font-semibold text-brand">
              {monthlyMarathons.length}개
            </strong>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2">
            {monthlyMarathons.map((marathon) => {
              const weekday = formatMarathonDate(
                marathon.event.startDate,
              ).match(/\((.+)\)/)?.[1];
              const location = [
                marathon.location.region,
                marathon.location.venue,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <article
                  key={marathon.id}
                  className="group min-w-0 bg-background"
                >
                  <Link
                    href={`/marathon/${marathon.slug}`}
                    className="flex min-h-20 min-w-0 items-center gap-4 bg-background px-4 py-3.5 transition-colors hover:bg-brand/[0.025] sm:px-5"
                  >
                    <div className="w-[74px] shrink-0 border-r pr-4 text-center">
                      <p className="font-paperlogy text-lg font-semibold text-brand tabular-nums">
                        {marathon.event.startDate.slice(5).replace("-", ".")}
                      </p>
                      <p className="font-anyvid text-[11px] text-muted-foreground">
                        {weekday}요일
                      </p>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-paperlogy text-base font-semibold transition-colors group-hover:text-brand sm:text-lg">
                        {marathon.name}
                      </h3>
                      {location && (
                        <p className="mt-1 flex min-w-0 items-center gap-1.5 font-anyvid text-xs text-muted-foreground">
                          <MapPin
                            className="size-3.5 shrink-0 text-rose-500"
                            aria-hidden="true"
                          />
                          <span className="truncate">{location}</span>
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-brand"
                      aria-hidden="true"
                    />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
