"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";

import MarathonSearchForm from "@/components/marathon/marathon-search-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cn,
  formatMarathonDate,
  formatMarathonPrices,
  getCurrentKoreanDate,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";
import type { Marathon } from "@/lib/marathons";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function MarathonCalendar({
  marathons,
  hasError = false,
  initialMonth,
}: {
  marathons: Marathon[];
  hasError?: boolean;
  initialMonth?: string;
}) {
  const today = getCurrentKoreanDate();
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [visibleMonth, setVisibleMonth] = useState(
    () => initialMonth ?? today.slice(0, 7),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    initialMonth ? `${initialMonth}-01` : today,
  );
  const deferredQuery = useDeferredValue(
    query.trim().toLocaleLowerCase("ko-KR"),
  );

  const filteredMarathons = useMemo(() => {
    return marathons
      .filter((marathon) => {
        const searchable = [
          marathon.name,
          marathon.location.region,
          marathon.location.venue,
          marathon.hosts.organizer,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ko-KR");
        return !deferredQuery || searchable.includes(deferredQuery);
      })
      .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));
  }, [deferredQuery, marathons]);

  const monthMarathons = useMemo(
    () =>
      filteredMarathons.filter((item) =>
        item.event.startDate.startsWith(visibleMonth),
      ),
    [filteredMarathons, visibleMonth],
  );
  const eventsByDate = useMemo(() => {
    const result = new Map<string, Marathon[]>();
    monthMarathons.forEach((item) => {
      const items = result.get(item.event.startDate) ?? [];
      items.push(item);
      result.set(item.event.startDate, items);
    });
    return result;
  }, [monthMarathons]);
  const selectedMarathons = eventsByDate.get(selectedDate) ?? [];
  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const [year, month] = visibleMonth.split("-").map(Number);

  const moveMonth = (amount: number) => {
    const next = new Date(year, month - 1 + amount, 1);
    const nextMonth = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
    setVisibleMonth(nextMonth);
    setSelectedDate(`${nextMonth}-01`);
  };

  const goToday = () => {
    setVisibleMonth(today.slice(0, 7));
    setSelectedDate(today);
  };

  return (
    <section aria-label="마라톤 캘린더">
      <MarathonSearchForm
        value={searchInput}
        onValueChange={setSearchInput}
        onSearch={() => setQuery(searchInput)}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6">
          <div>
            <h2 className="font-paperlogy text-2xl font-semibold">대회 일정</h2>
            <p className="mt-1 font-anyvid text-sm text-muted-foreground">
              {query
                ? `검색 결과 ${filteredMarathons.length.toLocaleString("ko-KR")}개`
                : "월별 대회 일정을 한눈에 확인해 보세요."}
            </p>
          </div>
        </div>

        {hasError ? (
          <EmptyState>
            대회 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
          </EmptyState>
        ) : (
          <>
            <div className="overflow-hidden rounded-t-2xl border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMonth(-1)}
                  aria-label="이전 달"
                >
                  <ChevronLeft />
                </Button>
                <div className="flex items-center gap-3">
                  <h3 className="font-paperlogy text-xl font-semibold tabular-nums sm:text-2xl">
                    {year}년 {month}월
                  </h3>
                  <Button variant="outline" size="sm" onClick={goToday}>
                    오늘
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => moveMonth(1)}
                  aria-label="다음 달"
                >
                  <ChevronRight />
                </Button>
              </div>

              <div className="grid grid-cols-7 border-b bg-muted/40">
                {WEEKDAYS.map((weekday, index) => (
                  <div
                    key={weekday}
                    className={cn(
                      "py-3 text-center font-anyvid text-xs font-semibold sm:text-sm",
                      index === 0 && "text-brand",
                      index === 6 && "text-blue-600",
                    )}
                  >
                    {weekday}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {calendarDays.map(({ date, currentMonth }) => {
                  const events = eventsByDate.get(date) ?? [];
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      type="button"
                      onClick={() => setSelectedDate(date)}
                      className={cn(
                        "relative min-h-20 border-r border-b p-1.5 text-left transition-colors hover:bg-muted/60 [&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0 sm:min-h-32 sm:p-2",
                        !currentMonth && "bg-muted/25 text-muted-foreground/50",
                        isSelected &&
                          "bg-brand/[0.04] ring-2 ring-inset ring-brand",
                      )}
                      aria-label={`${date}, 대회 ${events.length}개`}
                    >
                      <span
                        className={cn(
                          "mx-auto flex size-7 items-center justify-center rounded-full font-anyvid text-xs tabular-nums sm:mx-0 sm:text-sm",
                          date === today && "bg-brand font-semibold text-white",
                        )}
                      >
                        {Number(date.slice(-2))}
                      </span>
                      <div className="mt-1 hidden space-y-1 sm:block">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            title={event.name}
                            className="truncate rounded bg-brand/10 px-1.5 py-1 font-anyvid text-[11px] font-semibold text-brand"
                          >
                            {event.name}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <p className="px-1 text-[11px] text-muted-foreground">
                            +{events.length - 2}개 더보기
                          </p>
                        )}
                      </div>
                      {events.length > 0 && (
                        <span className="absolute right-2 bottom-2 size-1.5 rounded-full bg-brand sm:hidden" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 font-paperlogy text-xl font-semibold">
                {formatMarathonDate(selectedDate)} 일정{" "}
                <span className="text-brand">{selectedMarathons.length}</span>
              </h3>
              {selectedMarathons.length ? (
                <RaceList marathons={selectedMarathons} />
              ) : (
                <EmptyState>선택한 날짜에 등록된 대회가 없습니다.</EmptyState>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function RaceList({ marathons }: { marathons: Marathon[] }) {
  return (
    <div className="divide-y overflow-hidden rounded-2xl border bg-card">
      {marathons.map((marathon) => {
        const status = getRegistrationStatus(marathon);
        const distances = Object.keys(marathon.registration.price);
        return (
          <article
            key={marathon.id}
            className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="flex min-w-24 items-center gap-3 sm:flex-col sm:gap-1.5 sm:text-center">
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
              <div className="ml-auto flex gap-1.5 sm:hidden">
                <Badge variant="outline" className="border-brand/40 text-brand">
                  {marathon.info.type ?? "러닝"}
                </Badge>
                <Badge
                  variant="outline"
                  className={getRegistrationBadgeClassName(status)}
                >
                  {getRegistrationLabel(status)}
                </Badge>
              </div>
            </div>
            <div className="min-w-0 flex-1 border-t pt-3 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5">
              <div className="mb-1.5 hidden flex-wrap gap-1.5 sm:flex">
                <Badge variant="outline" className="border-brand/40 text-brand">
                  {marathon.info.type ?? "러닝"}
                </Badge>
                <Badge
                  variant="outline"
                  className={getRegistrationBadgeClassName(status)}
                >
                  {getRegistrationLabel(status)}
                </Badge>
              </div>
              <h4 className="truncate font-paperlogy text-lg font-semibold">
                <Link
                  href={`/marathon/${marathon.slug}`}
                  className="hover:text-brand"
                >
                  {marathon.name}
                </Link>
              </h4>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 font-anyvid text-sm text-muted-foreground">
                <p className="flex min-w-0 items-center gap-1.5">
                  <MapPin
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-pink-500"
                  />
                  <span className="truncate">
                    {[marathon.location.region, marathon.location.venue]
                      .filter(Boolean)
                      .join(" · ") || "장소 확인"}
                  </span>
                </p>
                <p className="flex items-center gap-1.5">
                  <WalletCards
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-emerald-500"
                  />
                  {formatMarathonPrices(marathon.registration.price)}
                </p>
                {distances.length > 0 ? (
                  <p className="flex items-center gap-1.5">
                    <Tag
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-violet-500"
                    />
                    {distances.join(" / ")}
                  </p>
                ) : null}
                {marathon.info.scale ? (
                  <p className="flex items-center gap-1.5">
                    <Users
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-amber-500"
                    />
                    약 {marathon.info.scale.toLocaleString("ko-KR")}명
                  </p>
                ) : null}
              </div>
            </div>
            <Button
              nativeButton={false}
              render={<Link href={`/marathon/${marathon.slug}`} />}
              variant="outline"
              size="sm"
              className="self-start sm:self-center"
            >
              대회 보기
            </Button>
          </article>
        );
      })}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed px-4 py-16 text-center font-anyvid text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function getCalendarDays(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const start = new Date(year, month - 1, 1 - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return { date: key, currentMonth: date.getMonth() === month - 1 };
  });
}
