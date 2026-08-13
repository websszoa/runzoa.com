"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarClock,
  CircleAlert,
  CirclePlus,
  Clock3,
  Search,
  Settings,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Marathon } from "@/lib/marathons";
import {
  formatMarathonDate,
  getCurrentKoreanDate,
  getRegistrationBadgeClassName,
  getRegistrationLabel,
  getRegistrationStatus,
} from "@/lib/utils";

const PAGE_SIZE = 20;
const ALL = "all";

export default function AdminMarathon({
  marathons,
  hasError,
}: {
  marathons: Marathon[];
  hasError: boolean;
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(ALL);
  const [month, setMonth] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [period, setPeriod] = useState("include");
  const [sort, setSort] = useState("dateAsc");
  const [page, setPage] = useState(1);
  const today = getCurrentKoreanDate();

  const { stats, years, types } = useMemo(() => {
    const registrationStatuses = marathons.map(getRegistrationStatus);

    return {
      stats: {
        total: marathons.length,
        open: registrationStatuses.filter((status) => status === "접수중")
          .length,
        waiting: registrationStatuses.filter((status) => status === "접수예정")
          .length,
        unknown: registrationStatuses.filter((status) => status === "접수미정")
          .length,
        closed: registrationStatuses.filter((status) => status === "접수마감")
          .length,
      },
      years: [
        ...new Set(
          marathons.map(({ event }) => event.startDate.slice(0, 4)),
        ),
      ].sort(),
      types: [
        ...new Set(marathons.map(({ info }) => info.type).filter(Boolean)),
      ].sort() as string[],
    };
  }, [marathons]);

  const filteredMarathons = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");

    return marathons
      .filter((marathon) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [
            marathon.name,
            marathon.slug,
            marathon.location.region,
            marathon.location.venue,
          ].some((value) =>
            value?.toLocaleLowerCase("ko-KR").includes(normalizedQuery),
          );

        const matchesYear =
          year === ALL || marathon.event.startDate.startsWith(year);
        const matchesMonth =
          month === ALL || marathon.event.startDate.slice(5, 7) === month;
        const matchesType = type === ALL || marathon.info.type === type;
        const matchesPeriod =
          period === "include" || marathon.event.startDate >= today;

        return (
          matchesQuery &&
          matchesYear &&
          matchesMonth &&
          matchesType &&
          matchesPeriod
        );
      })
      .sort((a, b) => {
        if (sort === "dateDesc") {
          return b.event.startDate.localeCompare(a.event.startDate);
        }
        if (sort === "name") return a.name.localeCompare(b.name, "ko-KR");
        return a.event.startDate.localeCompare(b.event.startDate);
      });
  }, [marathons, month, period, query, sort, today, type, year]);

  const totalPages = Math.max(1, Math.ceil(filteredMarathons.length / PAGE_SIZE));
  const visibleMarathons = filteredMarathons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <header>
        <h1 className="font-paperlogy text-2xl font-semibold">마라톤</h1>
        <p className="mt-1 font-anyvid text-sm text-muted-foreground">
          API에서 불러온 마라톤 대회 정보와 등록 상태를 확인하세요.
        </p>
      </header>

      {hasError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-anyvid text-sm text-red-700"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          마라톤 API 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.
        </div>
      )}

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard
          label="전체 대회"
          value={stats.total}
          icon={Trophy}
          color="text-brand"
          featured
        />
        <StatCard
          label="접수중"
          value={stats.open}
          icon={Activity}
          color="text-rose-500"
        />
        <StatCard
          label="접수대기"
          value={stats.waiting}
          icon={CalendarClock}
          color="text-sky-500"
        />
        <StatCard
          label="접수미정"
          value={stats.unknown}
          icon={CirclePlus}
          color="text-amber-500"
        />
        <StatCard
          label="접수마감"
          value={stats.closed}
          icon={Clock3}
          color="text-violet-500"
          className="col-span-2 md:col-span-1"
        />
      </dl>

      <section className="space-y-4" aria-label="마라톤 대회 관리">
        <div className="grid gap-3 md:grid-cols-[minmax(280px,0.75fr)_minmax(320px,1.75fr)]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="대회명 검색"
              aria-label="마라톤 대회 검색"
              className="h-12 rounded-lg bg-white pl-10 font-anyvid"
            />
          </div>
          <p
            className="flex h-12 items-center justify-center rounded-lg border bg-white px-4 font-anyvid text-base text-muted-foreground"
            aria-live="polite"
          >
            현재&nbsp;
            <strong className="font-semibold text-brand">
              {filteredMarathons.length.toLocaleString("ko-KR")}
            </strong>
            개의 대회가 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterSelect
            value={year}
            onChange={(value) => {
              setYear(value);
              setPage(1);
            }}
            label="전체 연도"
          >
            {years.map((item) => (
              <SelectItem key={item} value={item}>
                {item}년
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            value={month}
            onChange={(value) => {
              setMonth(value);
              setPage(1);
            }}
            label="전체 월"
          >
            {Array.from({ length: 12 }, (_, index) =>
              String(index + 1).padStart(2, "0"),
            ).map((item) => (
              <SelectItem key={item} value={item}>
                {Number(item)}월
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            value={type}
            onChange={(value) => {
              setType(value);
              setPage(1);
            }}
            label="전체 유형"
          >
            {types.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </FilterSelect>
          <FilterSelect
            value={period}
            onChange={(value) => {
              setPeriod(value);
              setPage(1);
            }}
            label="지난대회포함"
            allValue="include"
          >
            <SelectItem value="upcoming">예정 대회만</SelectItem>
          </FilterSelect>
          <FilterSelect
            value={sort}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            label="등록순"
            allValue="dateAsc"
          >
            <SelectItem value="dateDesc">최신 대회순</SelectItem>
            <SelectItem value="name">대회명순</SelectItem>
          </FilterSelect>
        </div>

        <div className="overflow-hidden rounded-lg border bg-white font-anyvid">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[54px] text-center">No</TableHead>
                <TableHead>대회명</TableHead>
                <TableHead className="w-[100px] text-center">유형</TableHead>
                <TableHead className="w-[150px] text-center">대회일</TableHead>
                <TableHead className="w-[190px]">지역·장소</TableHead>
                <TableHead className="w-[100px] text-center">접수 상태</TableHead>
                <TableHead className="w-[60px] text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMarathons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="size-8" aria-hidden="true" />
                      <p className="text-sm">조건에 맞는 대회가 없습니다.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                visibleMarathons.map((marathon, index) => {
                  const registrationStatus = getRegistrationStatus(marathon);
                  const site =
                    marathon.event.site ?? marathon.registration.site;

                  return (
                    <TableRow
                      key={marathon.id}
                      className="text-muted-foreground hover:bg-gray-50"
                    >
                      <TableCell className="text-center text-sm tabular-nums">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/marathon/${marathon.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[360px] truncate text-sm font-medium text-foreground transition-colors hover:text-brand"
                        >
                          {marathon.name}
                        </Link>
                        <span className="mt-0.5 block max-w-[360px] truncate text-xs text-muted-foreground">
                          {marathon.slug}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {site && marathon.info.type ? (
                          <Link
                            href={site}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground underline-offset-4 hover:text-brand hover:underline"
                          >
                            {marathon.info.type}
                          </Link>
                        ) : (
                          marathon.info.type ?? "-"
                        )}
                      </TableCell>
                      <TableCell className="text-center text-sm tabular-nums">
                        {formatMarathonDate(marathon.event.startDate)}
                      </TableCell>
                      <TableCell className="text-left text-sm">
                        <span className="block truncate">
                          {[marathon.location.region, marathon.location.venue]
                            .filter(Boolean)
                            .join(" · ") || "-"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`font-anyvid text-xs ${getRegistrationBadgeClassName(registrationStatus)}`}
                        >
                          {getRegistrationLabel(registrationStatus)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="h-8 w-8 p-0 disabled:opacity-100"
                          aria-label={`${marathon.name} 관리 기능 준비 중`}
                          title="관리 기능 준비 중"
                        >
                          <Settings className="size-4" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {filteredMarathons.length > 0 && (
          <nav
            aria-label="마라톤 목록 페이지 이동"
            className="flex items-center justify-between gap-4"
          >
            <p className="font-anyvid text-sm text-muted-foreground">
              {page} / {totalPages} 페이지
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="font-anyvid"
              >
                이전
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                className="font-anyvid"
              >
                다음
              </Button>
            </div>
          </nav>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  featured = false,
  className = "",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`min-h-[132px] rounded-xl border bg-white p-5 ${featured ? "border-brand ring-1 ring-brand" : ""} ${className}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <dt className="font-paperlogy text-sm text-muted-foreground">
          {label}
        </dt>
        <Icon className={`size-5 ${color}`} aria-hidden="true" />
      </div>
      <dd
        className={`font-paperlogy text-3xl font-semibold tabular-nums ${color}`}
      >
        {value.toLocaleString("ko-KR")}
      </dd>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  allValue = ALL,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  allValue?: string;
  children: React.ReactNode;
}) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => onChange(nextValue ?? allValue)}
    >
      <SelectTrigger className="h-10 bg-white font-anyvid" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={allValue}>{label}</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}
