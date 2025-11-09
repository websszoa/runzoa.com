"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Marathon } from "@/lib/types";
import { ClipboardPenLine, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  calculateDDay,
  getDateAtLocalMidnight,
  getStatusBadgeStyle,
} from "@/lib/utils";

interface MarathonRegisteringProps {
  currentMarathonId?: number;
}

export default function MarathonRegistering({
  currentMarathonId,
}: MarathonRegisteringProps) {
  const [marathons, setMarathons] = useState<Marathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // 클라이언트에서만 현재 월 설정
    setCurrentMonth(new Date().getMonth() + 1);

    const fetchMarathons = async () => {
      const { data, error } = await supabase
        .from("marathons")
        .select("*")
        .limit(50);

      if (error) {
        console.error("마라톤 데이터 조회 오류:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setMarathons(data);
      }
      setLoading(false);
    };

    fetchMarathons();
  }, []);

  // 현재 월 마라톤 필터링하고, 현재 마라톤 제외, 10개 제한
  const filteredMarathons = marathons
    .filter((marathon: any) => {
      // 현재 마라톤 제외
      if (currentMarathonId && marathon.id === currentMarathonId) {
        return false;
      }

      // 이벤트 날짜에서 월 추출
      const eventDate = marathon.event?.date;
      if (!eventDate) return false;

      const eventDay = getDateAtLocalMidnight(eventDate);
      if (!eventDay) return false;

      const eventMonth = eventDay.getMonth() + 1;

      if (eventDay < today) {
        return false;
      }

      // 현재 월의 마라톤만 (모든 상태 포함)
      return eventMonth === currentMonth;
    })
    .sort((a: any, b: any) => {
      // 날짜 순 정렬
      const dateA = new Date(a.event?.date || "").getTime();
      const dateB = new Date(b.event?.date || "").getTime();
      return dateA - dateB;
    })
    .slice(0, 10);

  if (loading || currentMonth === null) {
    return null;
  }

  if (filteredMarathons.length === 0) {
    return null;
  }

  return (
    <div className="page__block">
      <h3>
        <ClipboardPenLine className="w-5 h-5 text-brand" /> {currentMonth}월
        마라톤
      </h3>
      <div>
        <ul>
          {filteredMarathons.map((marathon: Marathon) => {
            const dDay = calculateDDay(marathon.event?.date || "");
            const dDayStyle =
              dDay === "종료"
                ? "bg-transparent border-gray-400 text-gray-500"
                : "bg-transparent border-brand text-brand";

            return (
              <li
                key={marathon.id}
                className="rounded py-3 px-4 mb-2 bg-gray-50 hover:bg-gray-100 transition-colors last:mb-0"
              >
                <Link
                  href={`/marathon/${marathon.slug}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-gray-700 flex-1 truncate">
                    {marathon.name}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      className={getStatusBadgeStyle(
                        marathon.registration?.status || "접수대기"
                      )}
                    >
                      {marathon.registration?.status || "접수대기"}
                    </Badge>
                    <Badge className={dDayStyle}>{dDay}</Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
