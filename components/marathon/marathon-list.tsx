"use client";

import { useState, useMemo, useEffect } from "react";
import { Marathon } from "@/lib/types";
import { Grid, List, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import MarathonListText from "./marathon-list-text";
import MarathonListCard from "./marathon-list-card";

interface MarathonListProps {
  marathons: Marathon[];
}

type ViewMode = "card" | "table";

export default function MarathonList({ marathons }: MarathonListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const months = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  // 연도/월 필터링된 마라톤 (통계 계산용)
  const yearMonthFiltered = useMemo(() => {
    return marathons.filter((marathon) => {
      const eventDate = new Date(marathon.event.date);
      const year = eventDate.getFullYear();
      const month = eventDate.getMonth() + 1;

      if (selectedYear && year !== selectedYear) return false;
      if (selectedMonth && month !== selectedMonth) return false;

      return true;
    });
  }, [marathons, selectedYear, selectedMonth]);

  // 통계 계산 (상태 필터와 독립적)
  const statistics = useMemo(() => {
    const total = yearMonthFiltered.length;
    const registering = yearMonthFiltered.filter(
      (m) => m.registration.status === "접수중"
    ).length;
    const closed = yearMonthFiltered.filter(
      (m) => m.registration.status === "접수마감"
    ).length;
    const waiting = yearMonthFiltered.filter(
      (m) => m.registration.status === "접수대기"
    ).length;

    return { total, registering, closed, waiting };
  }, [yearMonthFiltered]);

  // 최종 필터링된 마라톤 목록 (상태 + 검색어 필터 포함)
  const filteredMarathons = useMemo(() => {
    const hasSearch = searchQuery.trim().length > 0;
    let result = hasSearch ? marathons : yearMonthFiltered;

    // 상태 필터
    if (selectedStatus) {
      result = result.filter((m) => m.registration.status === selectedStatus);
    }

    // 검색어 필터
    if (hasSearch) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.location.text.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query)
      );
    }

    // 검색이 없으면 이미 연/월 필터링 된 yearMonthFiltered 사용
    return hasSearch
      ? [...result].sort(
          (a, b) =>
            new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
        )
      : result;
  }, [marathons, yearMonthFiltered, selectedStatus, searchQuery]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    // 검색 시 테이블 뷰로 전환
    if (searchInput.trim()) {
      setViewMode("table");
    }
  };

  // 연도 변경 핸들러
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSearchInput("");
    setSearchQuery("");
  };

  // 월 변경 핸들러
  const handleMonthChange = (month: number | null) => {
    setSelectedMonth(month);
    setSearchInput("");
    setSearchQuery("");
  };

  // 상태 변경 핸들러
  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
    setSearchInput("");
    setSearchQuery("");
  };

  // 통계 카드 데이터
  const statsCards = [
    {
      status: null,
      count: statistics.total,
      label: "총 대회",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      textColor: "text-blue-700",
      ringColor: "ring-blue-500",
    },
    {
      status: "접수중",
      count: statistics.registering,
      label: "접수중",
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      textColor: "text-green-700",
      ringColor: "ring-green-500",
    },
    {
      status: "접수마감",
      count: statistics.closed,
      label: "접수마감",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      textColor: "text-purple-700",
      ringColor: "ring-purple-500",
    },
    {
      status: "접수대기",
      count: statistics.waiting,
      label: "접수대기",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      textColor: "text-orange-700",
      ringColor: "ring-orange-500",
    },
  ];

  // 클라이언트 마운트 전에는 빈 화면 표시
  if (!mounted) {
    return null;
  }

  return (
    <section className="text-center md:border border-gray-100 rounded-xl p-0 md:p-6">
      <div className="marathon-header">
        <h2 className="text-xl text-brand font-paperlogy font-bold mb-1">
          런조아 마라톤
        </h2>
        <p className="font-nanumNeo text-sm text-muted-foreground mb-2">
          서로를 응원하며 완주의 기쁨을 나누는 마라톤 축제에 여러분을
          초대합니다.
        </p>
      </div>

      <div className="marathon-filter mb-4 md:mb-6">
        {/* 년 선택 */}
        <div className="flex justify-center gap-2 pt-4 pb-3 font-nanumNeo">
          <Button
            onClick={() => handleYearChange(2025)}
            size="sm"
            className={
              selectedYear === 2025
                ? "bg-brand hover:bg-brand/90"
                : "bg-transparent border border-gray-300 text-foreground hover:bg-gray-100"
            }
          >
            2025
          </Button>
          <Button
            onClick={() => handleYearChange(2026)}
            size="sm"
            className={
              selectedYear === 2026
                ? "bg-brand hover:bg-brand/90"
                : "bg-transparent border border-gray-300 text-foreground hover:bg-gray-100"
            }
          >
            2026
          </Button>
        </div>

        {/* 월 선택 */}
        <div className="font-nanumNeo">
          <div className="grid grid-cols-7 auto-rows-fr gap-1 md:gap-2">
            {/* 전체 버튼 - 1번째 칸, 2줄 차지 */}
            <Button
              variant={selectedMonth === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleMonthChange(null)}
              className={`row-span-2 h-full ${
                selectedMonth === null
                  ? "bg-brand hover:bg-brand/90 text-white"
                  : ""
              }`}
            >
              전체
            </Button>

            {/* 1줄: 1월~6월 */}
            {months.slice(0, 6).map((month, idx) => (
              <Button
                key={idx}
                variant={selectedMonth === idx + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handleMonthChange(idx + 1)}
                className={
                  selectedMonth === idx + 1
                    ? "bg-brand hover:bg-brand/90 text-white"
                    : ""
                }
              >
                {month}
              </Button>
            ))}

            {/* 2줄: 7월~12월 */}
            {months.slice(6, 12).map((month, idx) => (
              <Button
                key={idx + 6}
                variant={selectedMonth === idx + 7 ? "default" : "outline"}
                size="sm"
                onClick={() => handleMonthChange(idx + 7)}
                className={
                  selectedMonth === idx + 7
                    ? "bg-brand hover:bg-brand/90 text-white"
                    : ""
                }
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="marathon-statistics">
        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 font-nanumNeo">
          {statsCards.map((card) => (
            <div
              key={card.label}
              className={`text-center p-4 rounded border ${card.bgColor} ${
                card.borderColor
              } cursor-pointer transition-all hover:shadow-md ${
                selectedStatus === card.status ? `ring-1 ${card.ringColor}` : ""
              }`}
              onClick={() => handleStatusChange(card.status)}
            >
              <div className={`text-2xl font-bold ${card.textColor}`}>
                {card.count}
              </div>
              <div className="text-sm text-gray-600">{card.label}</div>
            </div>
          ))}
        </div>

        {/* 메시지 */}
        <div className="mb-4 p-4 bg-gray-50 rounded text-center">
          <p className="text-sm text-gray-700 font-nanumNeo">
            현재{" "}
            <span className="font-bold text-red-500">
              {selectedYear}년 {selectedMonth ? `${selectedMonth}월` : ""}
            </span>{" "}
            <span className="font-bold text-blue-500">
              {selectedStatus ? selectedStatus : "총 대회"}
            </span>{" "}
            마라톤은{" "}
            <span className="font-bold text-brand">
              {filteredMarathons.length}개
            </span>
            가 있습니다.
          </p>
        </div>
      </div>

      <div className="marathon-search mb-3 flex justify-between items-center">
        {/* 검색 */}
        <form
          onSubmit={handleSearch}
          className="relative w-full sm:w-80 flex gap-4"
        >
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="대회명, 장소 검색 (엔터로 검색)"
            className="pl-9 h-10 mr-2"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {/* 뷰 방식 */}
        <div className="flex gap-1">
          <Button
            className={`w-8 h-8 ${
              viewMode === "card" ? "bg-brand/10 text-brand" : ""
            }`}
            aria-label="카드 형식으로 보기"
            variant="ghost"
            onClick={() => setViewMode("card")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            className={`w-8 h-8 ${
              viewMode === "table" ? "bg-brand/10 text-brand" : ""
            }`}
            aria-label="테이블 형식으로 보기"
            variant="ghost"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="marathon-contents">
        {viewMode === "card" ? (
          <MarathonListCard marathons={filteredMarathons} />
        ) : (
          <MarathonListText marathons={filteredMarathons} />
        )}
      </div>
    </section>
  );
}
