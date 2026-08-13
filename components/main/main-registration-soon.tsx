import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDDay,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";
import {
  AlarmClock,
  ArrowRight,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";

export default function MainRegistrationSoon({
  marathons,
}: {
  marathons: Marathon[];
}) {
  const upcomingMarathons = marathons
    .filter(
      (marathon) =>
        getRegistrationStatus(marathon) === "접수예정" &&
        marathon.registration.startDate,
    )
    .sort((a, b) =>
      (a.registration.startDate as string).localeCompare(
        b.registration.startDate as string,
      ),
    )
    .slice(0, 4);

  if (upcomingMarathons.length === 0) return null;

  return (
    <section
      aria-labelledby="upcoming-registration-title"
      className="bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_48%,#ffffff_100%)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="font-paperlogy text-sm tracking-wide text-brand uppercase">
              Registration soon
            </p>
            <h2
              id="upcoming-registration-title"
              className="mt-2 font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              곧 접수가 시작되는 대회를
              <br />
              미리 준비하세요!
            </h2>
            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              참가하고 싶은 대회의 접수 시작일을 확인하고 신청 일정을 놓치지
              마세요.
            </p>
          </div>

          <Link
            href="/marathon-list?status=upcoming"
            className="inline-flex items-center gap-1.5 self-end font-anyvid text-sm text-brand md:self-auto"
          >
            전체 대회 살펴보기
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-background sm:mt-12">
          <div className="flex items-center gap-2 border-b bg-muted/30 px-5 py-3 font-anyvid text-xs text-muted-foreground sm:px-7">
            <AlarmClock className="size-4 text-brand" aria-hidden="true" />
            접수 오픈 예정
            <strong className="font-semibold text-brand">
              {upcomingMarathons.length}개
            </strong>
          </div>

          <div className="divide-y">
            {upcomingMarathons.map((marathon) => {
              const registrationDate = marathon.registration
                .startDate as string;
              const registrationStatus = getRegistrationStatus(marathon);
              const distances = Object.keys(marathon.registration.price);
              const location = [
                marathon.location.region,
                marathon.location.venue,
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <article key={marathon.id} className="group min-w-0">
                  <Link
                    href={`/marathon/${marathon.slug}`}
                    className="flex min-w-0 flex-col gap-3 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex min-w-24 items-center gap-3 sm:flex-col sm:gap-1 sm:text-center">
                      <p className="flex items-baseline gap-1 font-paperlogy text-lg font-semibold tabular-nums">
                        {marathon.event.startDate.slice(5).replace("-", ".")}
                        <span className="relative -top-0.5 font-anyvid text-xs font-normal text-muted-foreground">
                          {
                            formatMarathonDate(marathon.event.startDate).match(
                              /\((.+)\)/,
                            )?.[1]
                          }
                        </span>
                      </p>
                      <Badge
                        variant="outline"
                        className="min-w-14 justify-center border-brand bg-brand font-semibold text-white tabular-nums"
                      >
                        {getMarathonDDay(marathon.event.startDate)}
                      </Badge>
                      <div className="ml-auto flex gap-1.5 sm:hidden">
                        <Badge
                          variant="outline"
                          className="border-brand/40 text-brand"
                        >
                          {marathon.info.type ?? "러닝"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getRegistrationBadgeClassName(
                            registrationStatus,
                          )}
                        >
                          {getRegistrationLabel(registrationStatus)}
                        </Badge>
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                      <div className="mb-1.5 hidden flex-wrap gap-1.5 sm:flex">
                        <Badge
                          variant="outline"
                          className="border-brand/40 text-brand"
                        >
                          {marathon.info.type ?? "러닝"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getRegistrationBadgeClassName(
                            registrationStatus,
                          )}
                        >
                          {getRegistrationLabel(registrationStatus)}
                        </Badge>
                      </div>
                      <h3 className="truncate font-paperlogy text-xl font-semibold transition-colors group-hover:text-brand">
                        {marathon.name}
                      </h3>
                      <div className="mt-1 flex min-w-0 flex-wrap gap-x-5 gap-y-1.5 font-anyvid text-sm text-muted-foreground">
                        {location && (
                          <p className="flex min-w-0 items-center gap-1.5">
                            <MapPin
                              className="size-4 shrink-0 text-rose-500"
                              aria-hidden="true"
                            />
                            <span className="truncate">{location}</span>
                          </p>
                        )}
                        <p className="flex items-center gap-1.5">
                          <WalletCards
                            className="size-3.5 shrink-0 text-emerald-500"
                            aria-hidden="true"
                          />
                          {formatMarathonPrices(marathon.registration.price)}
                        </p>
                        {distances.length > 0 && (
                          <p className="flex items-center gap-1.5">
                            <Tag
                              className="size-3.5 shrink-0 text-violet-500"
                              aria-hidden="true"
                            />
                            {distances.join(" / ")}
                          </p>
                        )}
                        {marathon.info.scale && (
                          <p className="flex items-center gap-1.5">
                            <Users
                              className="size-3.5 shrink-0 text-amber-500"
                              aria-hidden="true"
                            />
                            약 {marathon.info.scale.toLocaleString("ko-KR")}명
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex min-w-52 items-center gap-3 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <AlarmClock className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 font-anyvid">
                        <p className="text-xs text-muted-foreground">
                          접수 시작일
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                          {formatMarathonDate(registrationDate)}
                        </p>
                      </div>
                      <ArrowRight
                        className="ml-auto size-4 shrink-0 text-brand transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
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
