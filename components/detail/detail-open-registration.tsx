import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Marathon } from "@/lib/marathons";
import { formatMarathonDate, getCurrentKoreanDate } from "@/lib/utils";

export default function DetailOpenRegistration({
  marathons,
  totalCount,
}: {
  marathons: Marathon[];
  totalCount: number;
}) {
  if (marathons.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <CalendarCheck className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <h2 className="font-paperlogy text-lg font-semibold">
          지금 접수중인 대회
        </h2>
        <Link
          href="/marathon-list?status=open"
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
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge
                      variant="outline"
                      className="shrink-0 border-brand bg-brand font-anyvid text-white"
                    >
                      접수중
                    </Badge>
                    <h3 className="min-w-0 truncate font-paperlogy text-base font-semibold transition-colors group-hover:text-brand sm:text-lg">
                      {marathon.name}
                    </h3>
                  </div>
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

                <div className="hidden shrink-0 flex-col items-center gap-1.5 sm:flex">
                  <span className="font-anyvid text-[11px] font-semibold whitespace-nowrap text-brand">
                    {getClosingLabel(marathon.registration.endDate)}
                  </span>
                  <span className="flex size-7 items-center justify-center rounded-full border border-brand/20 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function getClosingLabel(endDate: string | null) {
  if (!endDate) return "선착순 마감";
  const today = new Date(`${getCurrentKoreanDate()}T00:00:00+09:00`).getTime();
  const closing = new Date(`${endDate}T00:00:00+09:00`).getTime();
  const days = Math.max(0, Math.ceil((closing - today) / 86_400_000));
  return days === 0 ? "오늘 마감" : `마감 D-${days}`;
}
