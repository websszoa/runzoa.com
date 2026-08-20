"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Marathon } from "@/lib/marathons";
import {
  ArrowRight,
  Medal,
  MapPin,
  RotateCcw,
  Search,
  Tag,
  Users,
  WalletCards,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatMarathonDate,
  formatMarathonPrices,
  getCurrentKoreanDate,
  getCurrentKoreanTodayLabel,
  getMarathonDDay,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

import MarathonSearchForm from "@/components/marathon/marathon-search-form";

type MarathonListProps = {
  marathons: Marathon[];
  hasError?: boolean;
  initialStatus?: RegistrationFilter;
  initialYear?: number | null;
  initialMonth?: number | null;
  initialRaceType?: string;
  initialRegion?: string;
  initialScale?: ScaleFilter;
  initialIncludePast?: boolean;
};

type SortOrder = "개최일 빠른순" | "개최일 느린순";
export type ScaleFilter =
  | "전체"
  | "5천명 이하"
  | "5천~1만명"
  | "1만~2만명"
  | "2만명 이상";
export type RegistrationFilter =
  | "전체"
  | "접수예정"
  | "접수중"
  | "접수마감";

const PAGE_SIZE = 30;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

export default function MarathonList({
  marathons,
  hasError = false,
  initialStatus = "전체",
  initialYear = null,
  initialMonth = null,
  initialRaceType = "전체",
  initialRegion = "전체",
  initialScale = "전체",
  initialIncludePast = false,
}: MarathonListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [raceType, setRaceType] = useState(initialRaceType);
  const [status, setStatus] = useState<RegistrationFilter>(initialStatus);
  const [year, setYear] = useState<number | null>(initialYear);
  const [month, setMonth] = useState<number | null>(initialMonth);
  const [region, setRegion] = useState(initialRegion);
  const [scale, setScale] = useState<ScaleFilter>(initialScale);
  const [includePast, setIncludePast] = useState(initialIncludePast);
  const [sortOrder, setSortOrder] = useState<SortOrder>("개최일 빠른순");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(
    query.trim().toLocaleLowerCase("ko-KR"),
  );

  useEffect(() => {
    const url = new URL(window.location.href);

    setFilterParam(url.searchParams, "type", raceType, "전체");
    setFilterParam(
      url.searchParams,
      "status",
      status === "접수중"
        ? "open"
        : status === "접수예정"
          ? "upcoming"
          : status === "접수마감"
            ? "closed"
            : null,
    );
    setFilterParam(url.searchParams, "year", year);
    setFilterParam(url.searchParams, "month", month);
    setFilterParam(url.searchParams, "region", region, "전체");
    setFilterParam(url.searchParams, "scale", scale, "전체");
    setFilterParam(url.searchParams, "past", includePast ? "true" : null);

    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, [includePast, month, raceType, region, scale, status, year]);

  const regions = useMemo(
    () =>
      [
        ...new Set(
          marathons.map((item) => item.location.region).filter(Boolean),
        ),
      ].sort(),
    [marathons],
  ) as string[];
  const types = useMemo(
    () =>
      [
        ...new Set(marathons.map((item) => item.info.type).filter(Boolean)),
      ].sort(),
    [marathons],
  ) as string[];
  const years = useMemo(
    () =>
      [
        ...new Set(
          marathons.map((item) => Number(item.event.startDate.slice(0, 4))),
        ),
      ].sort(),
    [marathons],
  );

  const filteredMarathons = useMemo(() => {
    const today = getCurrentKoreanDate();
    const filtered = marathons.filter((marathon) => {
      const searchable = [
        marathon.name,
        marathon.location.region,
        marathon.location.venue,
        marathon.hosts.organizer,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR");

      return (
        (!deferredQuery || searchable.includes(deferredQuery)) &&
        (includePast || marathon.event.startDate >= today) &&
        (raceType === "전체" || marathon.info.type === raceType) &&
        (status === "전체" || getRegistrationStatus(marathon) === status) &&
        (year === null ||
          Number(marathon.event.startDate.slice(0, 4)) === year) &&
        (month === null ||
          Number(marathon.event.startDate.slice(5, 7)) === month) &&
        (region === "전체" || marathon.location.region === region) &&
        matchesScale(marathon.info.scale, scale)
      );
    });

    return filtered.sort((a, b) =>
      sortOrder === "개최일 빠른순"
        ? a.event.startDate.localeCompare(b.event.startDate)
        : b.event.startDate.localeCompare(a.event.startDate),
    );
  }, [
    deferredQuery,
    includePast,
    marathons,
    month,
    raceType,
    region,
    scale,
    sortOrder,
    status,
    year,
  ]);

  const hasActiveFilters = Boolean(
    query ||
    raceType !== "전체" ||
    status !== "전체" ||
    year !== null ||
    month !== null ||
    region !== "전체" ||
    scale !== "전체" ||
    includePast,
  );
  const updateFilter = (callback: () => void) => {
    callback();
    setVisibleCount(PAGE_SIZE);
  };
  const resetFilters = () => {
    setSearchInput("");
    setQuery("");
    setRaceType("전체");
    setStatus("전체");
    setYear(null);
    setMonth(null);
    setRegion("전체");
    setScale("전체");
    setIncludePast(false);
    setSortOrder("개최일 빠른순");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section aria-label="마라톤 리스트">
      <MarathonSearchForm
        value={searchInput}
        onValueChange={setSearchInput}
        onSearch={() => updateFilter(() => setQuery(searchInput))}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-paperlogy text-2xl font-semibold">
              마라톤 리스트
            </h2>
            <p className="mt-1 font-anyvid text-sm text-muted-foreground">
              오늘은 {getCurrentKoreanTodayLabel()}, 조건에 맞는 대회{" "}
              <strong className="font-black text-brand">
                {filteredMarathons.length.toLocaleString("ko-KR")}
              </strong>
              개가 있습니다.
            </p>
          </div>
          <ListFilterSelect
            label="개최일 정렬"
            hideLabel
            value={sortOrder}
            onChange={(value) =>
              updateFilter(() => setSortOrder(value as SortOrder))
            }
            options={[
              { value: "개최일 빠른순", label: "개최일 빠른순" },
              { value: "개최일 느린순", label: "개최일 느린순" },
            ]}
            triggerClassName="w-36"
          />
        </div>

        <Card className="mb-6 gap-0 border border-border py-0 shadow-none ring-0">
          <CardContent className="p-4 sm:p-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              <ListFilterSelect
                label="대회 종류"
                value={raceType}
                onChange={(value) => updateFilter(() => setRaceType(value))}
                options={[
                  { value: "전체", label: "모든 종류" },
                  ...types.map((item) => ({ value: item, label: item })),
                ]}
              />
              <ListFilterSelect
                label="접수 상태"
                value={status}
                onChange={(value) =>
                  updateFilter(() => setStatus(value as RegistrationFilter))
                }
                options={[
                  { value: "전체", label: "모든 상태" },
                  { value: "접수예정", label: "접수 예정" },
                  { value: "접수중", label: "접수 중" },
                  { value: "접수마감", label: "접수 마감" },
                ]}
              />
              <ListFilterSelect
                label="개최 연도"
                value={year?.toString() ?? "전체"}
                onChange={(value) =>
                  updateFilter(() =>
                    setYear(value === "전체" ? null : Number(value)),
                  )
                }
                options={[
                  { value: "전체", label: "모든 연도" },
                  ...years.map((item) => ({
                    value: String(item),
                    label: `${item}년`,
                  })),
                ]}
              />
              <ListFilterSelect
                label="개최 월"
                value={month?.toString() ?? "전체"}
                onChange={(value) =>
                  updateFilter(() =>
                    setMonth(value === "전체" ? null : Number(value)),
                  )
                }
                options={[
                  { value: "전체", label: "모든 월" },
                  ...MONTHS.map((item) => ({
                    value: String(item),
                    label: `${item}월`,
                  })),
                ]}
              />
              <ListFilterSelect
                label="개최 지역"
                value={region}
                onChange={(value) => updateFilter(() => setRegion(value))}
                options={[
                  { value: "전체", label: "전국" },
                  ...regions.map((item) => ({ value: item, label: item })),
                ]}
              />
              <ListFilterSelect
                label="개최 규모"
                value={scale}
                onChange={(value) =>
                  updateFilter(() => setScale(value as ScaleFilter))
                }
                options={[
                  { value: "전체", label: "모든 규모" },
                  { value: "5천명 이하", label: "5천명 이하" },
                  { value: "5천~1만명", label: "5천~1만명" },
                  { value: "1만~2만명", label: "1만~2만명" },
                  { value: "2만명 이상", label: "2만명 이상" },
                ]}
              />
              <div className="flex items-end gap-2">
                <ListFilterSelect
                  label="지난 대회"
                  value={includePast ? "포함" : "제외"}
                  onChange={(value) =>
                    updateFilter(() => setIncludePast(value === "포함"))
                  }
                  options={[
                    { value: "제외", label: "제외" },
                    { value: "포함", label: "포함" },
                  ]}
                  wrapperClassName="min-w-0 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="필터 초기화"
                  title="필터 초기화"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                >
                  <RotateCcw aria-hidden="true" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {hasError ? (
          <EmptyList
            title="대회 정보를 불러오지 못했어요"
            description="잠시 후 다시 시도해 주세요."
          />
        ) : filteredMarathons.length > 0 ? (
          <>
            <div className="divide-y overflow-hidden rounded-2xl border bg-card">
              {filteredMarathons.slice(0, visibleCount).map((marathon) => (
                <MarathonListRow key={marathon.slug} marathon={marathon} />
              ))}
            </div>
            {visibleCount < filteredMarathons.length && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                >
                  대회 더보기
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyList
            title="조건에 맞는 대회가 없어요"
            description="검색어나 필터 조건을 바꿔 다시 찾아보세요."
            onReset={resetFilters}
          />
        )}
      </div>
    </section>
  );
}

function MarathonListRow({ marathon }: { marathon: Marathon }) {
  const registrationStatus = getRegistrationStatus(marathon);
  const distances = Object.keys(marathon.registration.price);
  const site = marathon.event.site ?? marathon.registration.site;
  const weekday = formatMarathonDate(marathon.event.startDate).match(
    /\((.+)\)/,
  )?.[1];

  return (
    <article className="flex flex-col gap-3 p-4 transition-colors hover:bg-muted/35 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-24 items-center gap-3 sm:flex-col sm:gap-1 sm:text-center">
        <p className="flex items-baseline gap-1 font-paperlogy text-lg font-semibold tabular-nums">
          {marathon.event.startDate.slice(5).replace("-", ".")}
          {site ? (
            <a
              href={site}
              target="_blank"
              rel="noopener noreferrer"
              className="relative -top-0.5 font-anyvid text-xs font-normal text-muted-foreground no-underline"
            >
              {weekday}
            </a>
          ) : (
            <span className="relative -top-0.5 font-anyvid text-xs font-normal text-muted-foreground">
              {weekday}
            </span>
          )}
        </p>
        <Badge
          variant="outline"
          className="min-w-14 justify-center border-brand/40 font-semibold text-brand tabular-nums"
        >
          {getMarathonDDay(marathon.event.startDate)}
        </Badge>
        <div className="ml-auto flex gap-1.5 sm:hidden">
          <Badge variant="outline" className="border-brand/40 text-brand">
            {marathon.info.type ?? "러닝"}
          </Badge>
          <Badge
            variant="outline"
            className={getRegistrationBadgeClassName(registrationStatus)}
          >
            {getRegistrationLabel(registrationStatus)}
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
            className={getRegistrationBadgeClassName(registrationStatus)}
          >
            {getRegistrationLabel(registrationStatus)}
          </Badge>
        </div>

        <h3 className="truncate font-paperlogy text-xl font-semibold">
          <Link href={`/marathon/${marathon.slug}`}>
            {marathon.name}
          </Link>
        </h3>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1.5 font-anyvid text-sm text-muted-foreground">
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

      <div className="self-start sm:self-center">
        <Button
          nativeButton={false}
          render={<Link href={`/marathon/${marathon.slug}`} />}
          aria-label={`${marathon.name} 대회 보기`}
          title="대회 보기"
          variant="outline"
          size="icon-sm"
          className="group/cta rounded-full"
        >
          <span className="relative size-4" aria-hidden="true">
            <Medal className="absolute inset-0 size-4 transition-[opacity,transform] group-hover/cta:scale-75 group-hover/cta:opacity-0" />
            <ArrowRight className="absolute inset-0 size-4 -translate-x-1 opacity-0 transition-[opacity,transform] group-hover/cta:translate-x-0 group-hover/cta:opacity-100" />
          </span>
        </Button>
      </div>
    </article>
  );
}

type SelectOption = { value: string; label: string };

function ListFilterSelect({
  label,
  value,
  onChange,
  options,
  hideLabel = false,
  triggerClassName,
  wrapperClassName,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  hideLabel?: boolean;
  triggerClassName?: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      {!hideLabel && <p className="mb-2 font-anyvid text-sm">{label}</p>}
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue ?? "전체")}
      >
        <SelectTrigger
          aria-label={label}
          className={triggerClassName ?? "w-full"}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyList({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset?: () => void;
}) {
  return (
    <Card className="border border-dashed py-0 text-center shadow-none ring-0">
      <CardContent className="items-center py-20">
        <Search className="size-8 text-muted-foreground" />
        <h3 className="mt-1 font-paperlogy text-xl font-semibold">{title}</h3>
        <p className="font-anyvid text-[15px] text-muted-foreground">
          {description}
        </p>
        {onReset && (
          <Button
            onClick={onReset}
            size="lg"
            className="mt-2 px-6 bg-brand text-white hover:bg-brand/85"
          >
            필터 초기화
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function matchesScale(value: number | null, filter: ScaleFilter) {
  if (filter === "전체") return true;
  if (value === null) return false;
  if (filter === "5천명 이하") return value <= 5_000;
  if (filter === "5천~1만명") return value > 5_000 && value <= 10_000;
  if (filter === "1만~2만명") return value > 10_000 && value < 20_000;
  return value >= 20_000;
}

function setFilterParam(
  params: URLSearchParams,
  key: string,
  value: number | string | null,
  defaultValue?: string,
) {
  if (value === null || value === defaultValue) {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}
