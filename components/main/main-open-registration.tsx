import Link from "next/link";
import { ArrowRight, CalendarCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  getCurrentKoreanDate,
  getRegistrationStatus,
} from "@/lib/utils";

export default function MainOpenRegistration({
  marathons,
}: {
  marathons: Marathon[];
}) {
  const today = getCurrentKoreanDate();
  const openMarathons = marathons
    .filter(
      (marathon) =>
        getRegistrationStatus(marathon) === "접수중" &&
        marathon.event.startDate >= today,
    )
    .sort((a, b) =>
      (a.registration.endDate ?? "9999-12-31").localeCompare(
        b.registration.endDate ?? "9999-12-31",
      ),
    );
  const visibleMarathons = openMarathons.slice(0, 12);

  if (visibleMarathons.length === 0) return null;

  return (
    <section
      aria-labelledby="open-registration-title"
      className="bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_48%,#ffffff_100%)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-paperlogy text-sm tracking-wide text-brand uppercase">
              Registration open
            </p>
            <h2
              id="open-registration-title"
              className="mt-2 font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              지금 접수 중인
              <br />
              대회를 확인하세요!
            </h2>
            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              현재 접수 중인 대회를 마감이 가까운 순서로 확인해 보세요.
            </p>
          </div>

          <Link
            href="/marathon-list?status=open"
            className="inline-flex min-h-11 items-center gap-1.5 self-end font-anyvid text-sm text-brand md:self-auto"
          >
            접수 중 대회 전체 보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-background shadow-sm shadow-red-950/[0.03] sm:mt-12">
          <div className="flex items-center gap-2 border-b bg-brand/[0.035] px-5 py-3 font-anyvid text-xs text-muted-foreground sm:px-6">
            <CalendarCheck className="size-4 text-brand" aria-hidden="true" />
            현재 접수 중
            <strong className="font-semibold text-brand">
              {openMarathons.length.toLocaleString("ko-KR")}개
            </strong>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2">
            {visibleMarathons.map((marathon) => {
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
                      <div className="flex min-w-0 items-center gap-2">
                        <Badge
                          variant="outline"
                          className="shrink-0 border-brand bg-brand font-anyvid text-white"
                        >
                          접수 중
                        </Badge>
                        <h3 className="min-w-0 truncate font-paperlogy text-base font-semibold transition-colors group-hover:text-brand sm:text-lg">
                          {marathon.name}
                        </h3>
                      </div>
                      <div className="mt-1 flex min-w-0 items-center gap-3 font-anyvid text-xs text-muted-foreground">
                        {location && (
                          <p className="flex min-w-0 items-center gap-1.5">
                            <MapPin
                              className="size-3.5 shrink-0 text-rose-500"
                              aria-hidden="true"
                            />
                            <span className="truncate">{location}</span>
                          </p>
                        )}
                      </div>
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
        </div>
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
