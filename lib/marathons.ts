import type { LucideIcon } from "lucide-react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Archive,
  Filter,
  ListFilter,
  LocateFixed,
  Map,
  MapPin,
  MapPinned,
  MousePointerClick,
  Rows3,
  Search,
  SlidersHorizontal,
} from "lucide-react";

const MARATHONS_API_URL = "https://www.apizoa.com/api/v1/marathons";
const USE_LOCAL_MARATHON_DATA = true;
const LOCAL_MARATHON_DATA_FILES = [
  "marathons_2026.json",
  "marathons_2027.json",
] as const;

export type MarathonHeaderContent = {
  icon: LucideIcon;
  eyebrow: string;
  title: readonly string[];
  description: readonly string[];
  features: readonly {
    icon: LucideIcon;
    label: string;
  }[];
};

export const MARATHON_HEADERS = {
  archive: {
    icon: Archive,
    eyebrow: "런조아 연도별 아카이브",
    title: ["지난 마라톤 대회를", "연도별로 찾아보세요!"],
    description: [
      "연도를 선택해 국내 마라톤 대회의 개최 정보와 공식 홈페이지를 확인해 보세요.",
      "2024년부터 2026년까지 전체 대회를 한눈에 비교할 수 있습니다.",
    ],
    features: [],
  },
  search: {
    icon: Search,
    eyebrow: "런조아 대회 검색",
    title: ["나에게 맞는", "대회를 한 번에 찾아보세요!"],
    description: [
      "대회명과 지역을 검색하고 개최 일정, 접수 상태와 대회 규모를 비교해 보세요.",
      "원하는 조건을 선택하면 참가 계획에 맞는 러닝 대회만 빠르게 확인할 수 있습니다.",
    ],
    features: [
      { icon: CalendarDays, label: "개최 일정 비교" },
      { icon: MapPin, label: "지역별 대회 검색" },
      { icon: SlidersHorizontal, label: "맞춤 조건 필터" },
    ],
  },
  list: {
    icon: Rows3,
    eyebrow: "런조아 대회 리스트",
    title: ["전국 러닝 대회를", "목록으로 비교해 보세요!"],
    description: [
      "개최일과 접수 상태, 지역, 규모와 종목을 한 줄에서 빠르게 비교해 보세요.",
      "필요한 조건만 선택하면 참가 계획에 맞는 대회 목록을 간편하게 확인할 수 있습니다.",
    ],
    features: [
      { icon: CalendarClock, label: "일정·접수일 비교" },
      { icon: MapPinned, label: "지역별 목록 확인" },
      { icon: ListFilter, label: "세부 조건 필터" },
    ],
  },
  calendar: {
    icon: CalendarDays,
    eyebrow: "런조아 대회 캘린더",
    title: ["달력으로 한눈에", "대회 일정을 확인하세요!"],
    description: [
      "월별 개최 일정을 살펴보고 같은 날 열리는 대회를 빠르게 비교해 보세요.",
      "지역과 대회 종류를 선택하면 필요한 일정만 간편하게 확인할 수 있습니다.",
    ],
    features: [
      { icon: CalendarRange, label: "월별 일정 확인" },
      { icon: Filter, label: "지역·종류 필터" },
      { icon: MousePointerClick, label: "날짜별 상세 확인" },
    ],
  },
  map: {
    icon: Map,
    eyebrow: "런조아 대회 지도",
    title: ["가까운 러닝 대회를", "지도에서 찾아보세요!"],
    description: [
      "전국 대회의 개최 위치를 살펴보고 가까운 지역의 일정을 선택해 보세요.",
      "외부 지도 API 연결 전에는 등록된 위도와 경도를 기준으로 위치를 표시합니다.",
    ],
    features: [
      { icon: LocateFixed, label: "좌표 기반 위치" },
      { icon: Search, label: "대회·장소 검색" },
      { icon: MapPin, label: "마커별 정보 확인" },
    ],
  },
} as const satisfies Record<string, MarathonHeaderContent>;

export type Marathon = {
  slug: string;
  name: string;
  description: string | null;
  info: {
    type: string | null;
    scale: number | null;
    park: string | null;
    souvenir: string | null;
    program: string | null;
    memo: string | null;
  };
  event: {
    startDate: string;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    site: string | null;
    schedule: Record<string, string> | null;
  };
  registration: {
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    site: string | null;
    status: string | null;
    price: Record<string, number | string | null> | null;
    additional?: {
      startDate: string | null;
      endDate: string | null;
      startTime: string | null;
      endTime: string | null;
      memo: string | null;
    } | null;
  };
  location: {
    country: string | null;
    region: string | null;
    venue: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  hosts: {
    organizer: string | null;
    manager: string | null;
    sponsor: string | null;
    phone: string | null;
    email: string | null;
    instagram: string | null;
    blog: string[];
  };
};

type MarathonsApiResponse = {
  success: boolean;
  count: number;
  data: Marathon[];
};

export type MarathonDataResult = {
  marathons: Marathon[];
  error: boolean;
};

export async function getMarathons(): Promise<MarathonDataResult> {
  if (USE_LOCAL_MARATHON_DATA) {
    try {
      const datasets = await Promise.all(
        LOCAL_MARATHON_DATA_FILES.map(async (fileName) => {
          const filePath = path.join(
            process.cwd(),
            "data",
            "marathons",
            fileName,
          );
          const contents = await readFile(filePath, "utf-8");
          return JSON.parse(contents) as Marathon[];
        }),
      );
      return { marathons: datasets.flat(), error: false };
    } catch (error) {
      console.error("Failed to load local marathons", error);
      return { marathons: [], error: true };
    }
  }

  try {
    const response = await fetch(MARATHONS_API_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) throw new Error(`Marathon API returned ${response.status}`);

    const payload = (await response.json()) as MarathonsApiResponse;

    if (!payload.success || !Array.isArray(payload.data)) {
      throw new Error("Marathon API returned an invalid payload");
    }

    return { marathons: payload.data, error: false };
  } catch (error) {
    console.error("Failed to load marathons", error);
    return { marathons: [], error: true };
  }
}
