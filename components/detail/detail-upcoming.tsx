import Link from "next/link";
import {
  AlarmClock,
  ArrowRight,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";

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

export default function DetailUpcoming({
  marathons,
}: {
  marathons: Marathon[];
}) {
  if (marathons.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-none">
      <div className="flex min-h-16 items-center gap-2.5 border-b px-5 sm:px-6">
        <AlarmClock className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <h2 className="font-paperlogy text-lg font-semibold">
          곧 접수 오픈 예정
        </h2>
        <span className="ml-auto font-anyvid text-xs text-muted-foreground">
          예정 대회 <strong className="font-semibold text-brand">{marathons.length}개</strong>
        </span>
      </div>

      <div className="divide-y">
        {marathons.map((marathon) => {
          const registrationDate = marathon.registration.startDate as string;
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
                </div>

                <div className="min-w-0 flex-1 sm:border-l sm:pl-5">
                  <div className="mb-1.5 flex flex-wrap gap-1.5">
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
                    <p className="text-xs text-muted-foreground">접수 시작일</p>
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
    </section>
  );
}
