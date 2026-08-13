"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { Marathon } from "@/lib/marathons";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, getCurrentKoreanDate, getRegistrationStatus } from "@/lib/utils";

import MarathonDetailCard from "@/components/marathon/marathon-detail-card";
import MarathonSearchForm from "@/components/marathon/marathon-search-form";

type MarathonSearchProps = {
  marathons: Marathon[];
  hasError?: boolean;
};

type RegistrationStatus = "접수미정" | "접수예정" | "접수중" | "접수마감";
type ScaleFilter = "5천명 이하" | "5천~1만명" | "1만~2만명" | "2만명 이상";
type SortOrder = "개최일 빠른순" | "개최일 느린순";
type DistanceFilter = "5K" | "10K" | "HALF" | "FULL";

const PAGE_SIZE = 12;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const REGISTRATION_FILTERS: readonly {
  value: RegistrationStatus;
  label: string;
}[] = [
  { value: "접수미정", label: "접수 미정" },
  { value: "접수예정", label: "접수 예정" },
  { value: "접수중", label: "접수중" },
  { value: "접수마감", label: "접수마감" },
];
const PAST_RACE_FILTERS = [
  { value: "exclude", label: "비포함" },
  { value: "include", label: "포함" },
] as const;
const DISTANCE_FILTERS: readonly {
  value: DistanceFilter;
  label: string;
}[] = [
  { value: "5K", label: "5Km" },
  { value: "10K", label: "10Km" },
  { value: "HALF", label: "Half" },
  { value: "FULL", label: "Full" },
];

export default function MarathonSearch({
  marathons,
  hasError = false,
}: MarathonSearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RegistrationStatus | null>(null);
  const [pastRaces, setPastRaces] = useState<"include" | "exclude">("exclude");
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [region, setRegion] = useState("전체");
  const [raceType, setRaceType] = useState("전체");
  const [scale, setScale] = useState<ScaleFilter | null>(null);
  const [distance, setDistance] = useState<DistanceFilter | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("개최일 빠른순");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(
    query.trim().toLocaleLowerCase("ko-KR"),
  );

  const regions = useMemo(
    () =>
      [
        ...new Set(
          marathons.map((item) => item.location.region).filter(Boolean),
        ),
      ].sort(),
    [marathons],
  ) as string[];
  const raceTypes = useMemo(
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
    const filtered = marathons.filter((marathon) => {
      const searchable = [
        marathon.name,
        marathon.description,
        marathon.location.region,
        marathon.location.venue,
        marathon.hosts.organizer,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("ko-KR");

      return (
        (!deferredQuery || searchable.includes(deferredQuery)) &&
        (pastRaces === "include" ||
          marathon.event.startDate >= getCurrentKoreanDate()) &&
        (status === null || getRegistrationStatus(marathon) === status) &&
        (year === null ||
          Number(marathon.event.startDate.slice(0, 4)) === year) &&
        (month === null ||
          Number(marathon.event.startDate.slice(5, 7)) === month) &&
        (region === "전체" || marathon.location.region === region) &&
        (raceType === "전체" || marathon.info.type === raceType) &&
        (distance === null || hasDistance(marathon, distance)) &&
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
    distance,
    marathons,
    month,
    pastRaces,
    raceType,
    region,
    scale,
    sortOrder,
    status,
    year,
  ]);

  const hasActiveFilters = Boolean(
    query ||
    distance !== null ||
    pastRaces !== "exclude" ||
    status !== null ||
    year !== null ||
    month !== null ||
    region !== "전체" ||
    raceType !== "전체" ||
    scale !== null,
  );

  const resetVisible = () => setVisibleCount(PAGE_SIZE);
  const updateFilter = (callback: () => void) => {
    callback();
    resetVisible();
  };
  const resetFilters = () => {
    setSearchInput("");
    setQuery("");
    setStatus(null);
    setPastRaces("exclude");
    setYear(null);
    setMonth(null);
    setRegion("전체");
    setRaceType("전체");
    setScale(null);
    setDistance(null);
    setSortOrder("개최일 빠른순");
    resetVisible();
  };
  const handleSearch = () => {
    setQuery(searchInput);
    resetVisible();
  };

  return (
    <section aria-label="마라톤 검색 결과">
      <MarathonSearchForm
        value={searchInput}
        onValueChange={setSearchInput}
        onSearch={handleSearch}
      />

      <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 lg:py-14">
        <aside aria-label="대회 검색 필터" className="lg:sticky lg:top-20">
          <Card className="gap-0 border border-border py-0 ring-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="flex items-center gap-2 font-paperlogy text-lg font-semibold">
                  <SlidersHorizontal aria-hidden="true" className="size-5" />
                  필터
                </h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={resetFilters}
                    className="text-muted-foreground hover:bg-brand hover:text-white"
                  >
                    <RotateCcw aria-hidden="true" className="size-3" />
                    초기화
                  </Button>
                )}
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p
                    id="past-race-filter-label"
                    className="mb-1 font-paperlogy text-[15px] font-semibold"
                  >
                    지난 대회
                  </p>
                  <div
                    role="group"
                    aria-labelledby="past-race-filter-label"
                    className="grid grid-cols-2 gap-1"
                  >
                    {PAST_RACE_FILTERS.map((item) => {
                      const isActive = pastRaces === item.value;

                      return (
                        <Button
                          key={item.value}
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() => setPastRaces(item.value))
                          }
                          className={cn(
                            "w-full rounded text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p
                    id="registration-filter-label"
                    className="my-1 font-paperlogy font-semibold"
                  >
                    접수 상태
                  </p>
                  <div
                    role="group"
                    aria-labelledby="registration-filter-label"
                    className="grid grid-cols-2 gap-1"
                  >
                    {REGISTRATION_FILTERS.map((item) => {
                      const isActive = status === item.value;

                      return (
                        <Button
                          key={item.value}
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() =>
                              setStatus(isActive ? null : item.value),
                            )
                          }
                          className={cn(
                            "w-full rounded text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p
                    id="scale-filter-label"
                    className="my-1 font-paperlogy font-semibold"
                  >
                    개최 규모
                  </p>
                  <div
                    role="group"
                    aria-labelledby="scale-filter-label"
                    className="grid grid-cols-2 gap-1"
                  >
                    {(
                      [
                        ["5천명 이하", "5천명 이하"],
                        ["5천~1만명", "5천~1만명"],
                        ["1만~2만명", "1만~2만명"],
                        ["2만명 이상", "2만명 이상"],
                      ] as const
                    ).map(([value, label]) => {
                      const isActive = scale === value;

                      return (
                        <Button
                          key={value}
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() =>
                              setScale(isActive ? null : value),
                            )
                          }
                          className={cn(
                            "h-9 w-full rounded px-1 font-anyvid text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p
                    id="year-filter-label"
                    className="my-1 font-paperlogy font-semibold"
                  >
                    개최 연도
                  </p>
                  <div
                    role="group"
                    aria-labelledby="year-filter-label"
                    className="grid grid-cols-2 gap-1"
                  >
                    {years.map((item) => {
                      const isActive = year === item;

                      return (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() => setYear(isActive ? null : item))
                          }
                          className={cn(
                            "h-9 w-full rounded font-anyvid text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item}년
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p
                    id="month-filter-label"
                    className="my-1 font-paperlogy font-semibold"
                  >
                    개최 월
                  </p>
                  <div
                    role="group"
                    aria-labelledby="month-filter-label"
                    className="grid grid-cols-4 gap-1"
                  >
                    {MONTHS.map((item) => {
                      const isActive = month === item;

                      return (
                        <Button
                          key={item}
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() => setMonth(isActive ? null : item))
                          }
                          className={cn(
                            "h-8 w-full rounded px-1 font-anyvid text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item}월
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p
                    id="distance-filter-label"
                    className="my-1 font-paperlogy font-semibold"
                  >
                    종목
                  </p>
                  <div
                    role="group"
                    aria-labelledby="distance-filter-label"
                    className="grid grid-cols-2 gap-1"
                  >
                    {DISTANCE_FILTERS.map((item) => {
                      const isActive = distance === item.value;

                      return (
                        <Button
                          key={item.value}
                          type="button"
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          aria-pressed={isActive}
                          onClick={() =>
                            updateFilter(() =>
                              setDistance(isActive ? null : item.value),
                            )
                          }
                          className={cn(
                            "h-9 w-full rounded font-anyvid text-xs",
                            isActive
                              ? "bg-brand font-medium text-white hover:bg-brand/85"
                              : "text-muted-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
                          )}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                <FilterSelect
                  label="개최 지역"
                  value={region}
                  onChange={(value) => updateFilter(() => setRegion(value))}
                  options={[
                    { value: "전체", label: "전국" },
                    ...regions.map((item) => ({ value: item, label: item })),
                  ]}
                />
                <FilterSelect
                  label="대회 종류"
                  value={raceType}
                  onChange={(value) => updateFilter(() => setRaceType(value))}
                  options={[
                    { value: "전체", label: "전체" },
                    ...raceTypes.map((item) => ({ value: item, label: item })),
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="min-w-0">
          <ResultsHeader
            count={filteredMarathons.length}
            sortOrder={sortOrder}
            onSort={(value) => updateFilter(() => setSortOrder(value))}
          />
          {hasError ? (
            <EmptyResults
              title="대회 정보를 불러오지 못했어요"
              description="잠시 후 다시 시도해 주세요."
            />
          ) : filteredMarathons.length > 0 ? (
            <>
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredMarathons.slice(0, visibleCount).map((marathon) => (
                  <MarathonDetailCard key={marathon.id} marathon={marathon} />
                ))}
              </div>
              {visibleCount < filteredMarathons.length && (
                <div className="mt-10 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }
                    className="rounded-full px-7"
                  >
                    대회 더보기
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyResults
              title="조건에 맞는 대회가 없어요"
              description="검색어나 필터 조건을 바꿔 다시 찾아보세요."
              onReset={resetFilters}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <p className="mb-2 font-paperlogy font-semibold text-sm">{label}</p>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue ?? "전체")}
      >
        <SelectTrigger className="w-full" aria-label={label}>
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

function ResultsHeader({
  count,
  sortOrder,
  onSort,
}: {
  count: number;
  sortOrder: SortOrder;
  onSort: (value: SortOrder) => void;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-paperlogy text-2xl font-semibold">전체 마라톤</h2>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          조건에 맞는 대회{" "}
          <strong className="font-black text-brand">
            {count.toLocaleString("ko-KR")}
          </strong>
          개가 있습니다.
        </p>
      </div>
      <Select
        value={sortOrder}
        onValueChange={(value) =>
          onSort((value ?? "개최일 빠른순") as SortOrder)
        }
      >
        <SelectTrigger size="sm" aria-label="개최일 정렬" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="개최일 빠른순">개최일 빠른순</SelectItem>
          <SelectItem value="개최일 느린순">개최일 느린순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function EmptyResults({
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
        <h3 className="mt-1 font-paperlogy text-lg font-semibold">{title}</h3>
        <p className="font-anyvid text-sm text-muted-foreground">
          {description}
        </p>
        {onReset && (
          <Button
            onClick={onReset}
            className="mt-2 rounded-full bg-brand px-6 text-white hover:bg-brand/85"
          >
            필터 초기화
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function matchesScale(value: number | null, filter: ScaleFilter | null) {
  if (filter === null) return true;
  if (value === null) return false;
  if (filter === "5천명 이하") return value <= 5_000;
  if (filter === "5천~1만명") return value > 5_000 && value <= 10_000;
  if (filter === "1만~2만명") return value > 10_000 && value < 20_000;
  return value >= 20_000;
}

function hasDistance(marathon: Marathon, distance: DistanceFilter) {
  return Object.keys(marathon.registration.price).some((course) => {
    const normalized = course.toUpperCase().replaceAll(" ", "");

    if (distance === "5K") return /^5K(M)?/.test(normalized);
    if (distance === "10K") return /^10K(M)?/.test(normalized);
    if (distance === "HALF") {
      return normalized.includes("HALF") || normalized.includes("하프");
    }
    return normalized.includes("FULL") || normalized.includes("풀");
  });
}
