import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import type { Marathon } from "@/lib/marathons";
import { formatMarathonDate } from "@/lib/utils";

export default function DetailMonthly({
  month,
  monthKey,
  marathons,
  totalCount,
}: {
  month: number;
  monthKey: string;
  marathons: Marathon[];
  totalCount: number;
}) {
  if (marathons.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <CalendarDays className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <h2 className="font-paperlogy text-lg font-semibold">
          {month}월에 열리는 대회
        </h2>
        <Link
          href={`/marathon-calendar?month=${monthKey}`}
          className="group/link ml-auto inline-flex items-center gap-1.5 font-anyvid text-xs font-semibold text-brand"
        >
          전체 {totalCount.toLocaleString("ko-KR")}개
          <ArrowRight
            className="size-3.5 transition-transform group-hover/link:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>

      <div className="grid gap-px bg-border md:grid-cols-2">
        {marathons.map((marathon) => {
          const weekday = formatMarathonDate(marathon.event.startDate).match(
            /\((.+)\)/,
          )?.[1];
          const location = [
            marathon.location.region,
            marathon.location.venue,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <article
              key={marathon.slug}
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
    </section>
  );
}
