"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  CalendarDays,
  ArrowRight,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";
import {
  cn,
  formatMarathonDate,
  formatMarathonPrices,
  getMarathonDDay,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

import type { Marathon } from "@/lib/marathons";

export default function MarathonDetailCard({
  marathon,
}: {
  marathon: Marathon;
}) {
  const registrationStatus = getRegistrationStatus(marathon);
  const distances = Object.keys(marathon.registration.price);

  return (
    <article className="min-w-0">
      <Card className="group min-w-0 gap-0 rounded-2xl py-0 transition-shadow hover:border-brand hover:shadow-lg">
        <CardContent className="min-w-0 p-5 sm:p-6">
          <h3 className="truncate whitespace-nowrap font-paperlogy text-xl leading-snug font-semibold sm:text-2xl">
            <Link
              href={`/marathon/${marathon.slug}`}
              title={marathon.name}
              className="hover:text-brand"
            >
              {marathon.name}
            </Link>
          </h3>

          <div className="mb-1 flex flex-wrap gap-1.5">
            <Badge variant="outline" className="border-brand/50 text-brand">
              {marathon.info.type ?? "러닝"}
            </Badge>
            <Badge
              variant="outline"
              className="border-brand bg-brand text-white tabular-nums"
            >
              {getMarathonDDay(marathon.event.startDate)}
            </Badge>
            <Badge
              variant="outline"
              className={getRegistrationBadgeClassName(registrationStatus)}
            >
              {getRegistrationLabel(registrationStatus)}
            </Badge>
          </div>

          <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
            <div className="group/image relative aspect-[3/4] overflow-hidden rounded bg-muted">
              <Image
                src={`/marathon/cover/${marathon.id}.webp`}
                alt={`${marathon.name} 포스터`}
                fill
                sizes="120px"
                quality={65}
                className="object-cover"
                onError={(event) => {
                  event.currentTarget.src =
                    "/marathon/cover/Illustratorzoa1-8.webp";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100 group-focus-within/image:opacity-100 motion-reduce:transition-none">
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href={`/marathon/${marathon.slug}`}
                      aria-label={`${marathon.name} 상세페이지 바로가기`}
                    />
                  }
                  size="icon"
                  className="translate-y-2 rounded-full bg-white text-foreground shadow-lg transition-transform duration-200 group-hover/image:translate-y-0 group-focus-within/image:translate-y-0 hover:bg-white/90 motion-reduce:translate-y-0 motion-reduce:transition-none"
                >
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </div>

            <div className="min-w-0 space-y-1">
              <InfoRow
                icon={CalendarDays}
                iconClassName="text-blue-600"
                label="일정"
              >
                {formatMarathonDate(marathon.event.startDate)}
              </InfoRow>
              <InfoRow
                icon={CalendarCheck}
                iconClassName="text-violet-500"
                label="접수"
              >
                {formatMarathonDate(marathon.registration.startDate)}
              </InfoRow>
              <InfoRow icon={MapPin} iconClassName="text-pink-500" label="장소">
                {[marathon.location.region, marathon.location.venue]
                  .filter(Boolean)
                  .join(", ") || "장소 확인"}
              </InfoRow>
              <InfoRow icon={Tag} iconClassName="text-violet-500" label="종목">
                {distances.join(" / ") || "종목 확인"}
              </InfoRow>
              <InfoRow
                icon={WalletCards}
                iconClassName="text-emerald-500"
                label="가격"
              >
                {formatMarathonPrices(marathon.registration.price)}
              </InfoRow>
              <InfoRow icon={Users} iconClassName="text-amber-500" label="규모">
                {marathon.info.scale
                  ? `약 ${marathon.info.scale.toLocaleString("ko-KR")}명`
                  : "규모 확인"}
              </InfoRow>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

function InfoRow({
  icon: Icon,
  iconClassName,
  label,
  children,
}: {
  icon: React.ComponentType<{
    className?: string;
    "aria-hidden"?: boolean;
  }>;
  iconClassName: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 font-anyvid text-sm text-muted-foreground">
      <Icon aria-hidden className={cn("size-4 shrink-0", iconClassName)} />
      <span className="whitespace-nowrap">{label} :</span>
      <span
        title={typeof children === "string" ? children : undefined}
        className="min-w-0 truncate leading-6"
      >
        {children}
      </span>
    </div>
  );
}
