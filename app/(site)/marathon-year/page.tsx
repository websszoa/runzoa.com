import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonYearList from "@/components/marathon/marathon-year-list";
import marathons2024 from "@/data/marathons/marathons_2024.json";
import marathons2025 from "@/data/marathons/marathons_2025.json";
import marathons2026 from "@/data/marathons/marathons_2026.json";

import { MARATHON_HEADERS, type Marathon } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "연도별 마라톤 대회",
  description:
    "2024년부터 2026년까지 국내 마라톤 대회를 연도별로 검색하고 주요 정보를 표로 비교하세요.",
  alternates: { canonical: "/marathon-year" },
};

export default function MarathonYearPage() {
  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.archive} />
      <MarathonYearList
        datasets={{
          2024: marathons2024 as unknown as Marathon[],
          2025: marathons2025 as unknown as Marathon[],
          2026: marathons2026 as unknown as Marathon[],
        }}
        initialYear={2026}
      />
    </>
  );
}
