import { readdir } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  getCurrentKoreanDate,
  getRegistrationStatus,
  getRegistrationLabel,
  getRegistrationBadgeClassName,
  getUpcomingRegistrations,
} from "@/lib/utils";

export default async function MainRacePosters({ marathons }: { marathons: Marathon[] }) {
  const files = new Set(await readdir(path.join(process.cwd(), "public/marathon/cover")));
  const upcoming = new Map(
    getUpcomingRegistrations(marathons).map(({ marathon, schedules }) => [marathon.slug, schedules]),
  );
  const today = getCurrentKoreanDate();
  const races = marathons
    .filter((race) => race.event.startDate >= today && files.has(`${race.slug}.webp`))
    .map((race) => {
      const schedules = upcoming.get(race.slug) ?? [];
      const additional = schedules.some((schedule) => schedule.isAdditional);
      const status = additional ? "접수예정" : getRegistrationStatus(race);
      const priority = additional ? 0 : status === "접수중" ? 1 : status === "접수예정" ? 2 : 3;
      return { race, schedules, additional, status, priority };
    })
    .sort((a, b) => a.priority - b.priority || a.race.event.startDate.localeCompare(b.race.event.startDate));
  if (!races.length) return null;

  const collections = [
    { value: "discover", label: "전체 둘러보기", items: races },
    { value: "open", label: "지금 접수 중", items: races.filter(({ status }) => status === "접수중") },
    { value: "soon", label: "접수 오픈 예정", items: races.filter(({ schedules }) => schedules.length > 0) },
  ];

  return (
    <section aria-labelledby="race-posters-title" className="border-y bg-muted/25">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-paperlogy text-sm tracking-wide text-brand uppercase">Race collection</p>
            <h2 id="race-posters-title" className="mt-2 font-paperlogy text-3xl leading-tight font-semibold tracking-tight sm:text-5xl">
              눈길이 가는 대회,<br />다음 출발선으로.
            </h2>
            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground">
              포스터로 발견하고, 접수 일정까지 확인하세요.
            </p>
          </div>
          <Link href="/marathon-list" className="inline-flex items-center gap-2 rounded-sm font-anyvid text-sm text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-4">
            전체 대회 보기 <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <Tabs defaultValue="discover" className="mt-8 gap-6">
          <TabsList className="max-w-full font-anyvid">
            {collections.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="px-3 shadow-none! focus-visible:ring-0 focus-visible:outline-2">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          {collections.map(({ value, items }) => (
            <TabsContent key={value} value={value}>
              {items.length ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
                  {items.slice(0, 8).map(({ race, schedules, additional, status }) => (
                    <article key={race.slug} className="min-w-0">
                      <Link href={`/marathon/${race.slug}`} className="group block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                        <div className="relative aspect-3/4 overflow-hidden rounded-xl border bg-background">
                          <Image
                            src={`/marathon/cover/${race.slug}.webp`}
                            alt={`${race.name} 대회 포스터`}
                            fill
                            sizes="(max-width: 1023px) 50vw, (max-width: 1280px) 25vw, 286px"
                            className="object-contain transition-transform duration-300 group-hover:scale-103 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          <Badge variant="outline" className={getRegistrationBadgeClassName(status)}>
                            {additional ? "추가 접수" : getRegistrationLabel(status)}
                          </Badge>
                          {race.location.region && <Badge variant="outline">{race.location.region}</Badge>}
                        </div>
                        <h3 className="mt-2 font-paperlogy text-base leading-snug font-semibold group-hover:text-brand sm:text-lg">{race.name}</h3>
                        <p className="mt-2 font-anyvid text-xs text-muted-foreground sm:text-sm">{formatMarathonDate(race.event.startDate)}</p>
                        {schedules.length > 0 && (
                          <p className="mt-2 font-anyvid text-xs leading-5 text-brand">
                            {schedules[0].distance && `${schedules[0].distance} · `}
                            {schedules[0].startDate?.slice(5).replace("-", ".")} {schedules[0].startTime} 접수 오픈
                            {schedules.length > 1 && ` 외 ${schedules.length - 1}개 일정`}
                          </p>
                        )}
                        <span className="mt-3 inline-flex items-center gap-1 font-anyvid text-xs font-semibold">대회 자세히 보기 <ArrowUpRight className="size-3.5" aria-hidden="true" /></span>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border bg-background px-6 py-16 text-center font-anyvid text-sm text-muted-foreground">현재 이 조건에 해당하는 대회가 없습니다. 다른 탭에서 대회를 찾아보세요.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
