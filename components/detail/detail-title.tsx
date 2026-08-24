import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

export default function DetailTitle({ marathon }: { marathon: Marathon }) {
  const registrationStatus = getRegistrationStatus(marathon);
  const location = [marathon.location.region, marathon.location.venue]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="relative overflow-hidden border-b bg-[linear-gradient(135deg,#fff7f6_0%,#ffffff_48%,#fff4e8_100%)]">
      <div
        aria-hidden="true"
        className="absolute -top-28 right-[4%] size-80 rounded-full bg-brand/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-44 left-[18%] size-72 rounded-full bg-orange-300/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {marathon.info.type ? (
            <Badge
              variant="outline"
              className="border-brand/40 bg-background/80 text-brand"
            >
              {marathon.info.type}
            </Badge>
          ) : null}
          <Badge
            variant="outline"
            className={getRegistrationBadgeClassName(registrationStatus)}
          >
            {getRegistrationLabel(registrationStatus)}
          </Badge>
        </div>

        <h1 className="break-keep font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {marathon.name}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:mt-4 sm:text-[15px]">
          {marathon.description}
        </p>

        <div className="mt-5 sm:mt-7 flex flex-col gap-2 sm:gap-3 font-anyvid text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-7">
          <span className="flex items-center gap-2">
            <CalendarDays
              aria-hidden="true"
              className="size-4 shrink-0 text-blue-600"
            />
            {formatMarathonDate(marathon.event.startDate)}
          </span>
          {location ? (
            <span className="flex min-w-0 items-center gap-2">
              <MapPin
                aria-hidden="true"
                className="size-4 shrink-0 text-pink-500"
              />
              <span className="truncate">{location}</span>
            </span>
          ) : null}
          {marathon.info.scale ? (
            <span className="flex items-center gap-2">
              <Users
                aria-hidden="true"
                className="size-4 shrink-0 text-amber-500"
              />
              약 {marathon.info.scale.toLocaleString("ko-KR")}명
            </span>
          ) : null}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 overflow-hidden"
      >
        <div className="detail-title-track absolute inset-x-0 bottom-1.5 h-px opacity-45" />
        <div className="detail-title-runner detail-title-runner--one absolute bottom-0.5 left-0">
          <span className="detail-title-runner-icon block text-xl leading-none drop-shadow-sm">
            🏃🏻‍♂️
          </span>
        </div>
        <div className="detail-title-runner detail-title-runner--two absolute bottom-0 left-0">
          <span className="detail-title-runner-icon detail-title-runner-icon--two block text-lg leading-none drop-shadow-sm">
            🏃🏽‍♀️
          </span>
        </div>
        <div className="detail-title-runner detail-title-runner--three absolute bottom-1 left-0">
          <span className="detail-title-runner-icon detail-title-runner-icon--three block text-[22px] leading-none drop-shadow-sm">
            🏃🏿
          </span>
        </div>
      </div>
    </section>
  );
}
