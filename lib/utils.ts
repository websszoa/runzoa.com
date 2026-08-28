import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Marathon } from "@/lib/marathons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/\s+/g, "");
}

export type RegistrationStatus = "접수예정" | "접수중" | "접수마감";

export function getRegistrationStatus(marathon: Marathon): RegistrationStatus {
  const explicitStatus = marathon.registration.status?.trim();
  if (explicitStatus) {
    const normalizedStatus = explicitStatus.replace(/\s/g, "");
    if (["접수중", "진행중", "진행"].includes(normalizedStatus)) {
      return "접수중";
    }
    if (["접수마감", "접수종료", "마감", "종료"].includes(normalizedStatus)) {
      return "접수마감";
    }
    if (["접수예정", "접수미정", "예정", "미정"].includes(normalizedStatus)) {
      return "접수예정";
    }
  }

  const now = Date.now();
  const { startDate, endDate, startTime, endTime } = marathon.registration;
  if (!startDate && !endDate) return "접수예정";
  if (
    startDate &&
    now < getKoreanDateTime(startDate, startTime ?? "00:00").getTime()
  ) {
    return "접수예정";
  }
  if (
    endDate &&
    now >= getKoreanDateTime(endDate, endTime ?? "23:59:59.999").getTime()
  ) {
    return "접수마감";
  }
  return "접수중";
}

export function hasRegistrationStartDate(marathon: Marathon): boolean {
  return Boolean(marathon.registration.startDate?.trim());
}

function getKoreanDateTime(date: string, time: string) {
  return new Date(`${date}T${time}+09:00`);
}

export function getRegistrationLabel(status: RegistrationStatus) {
  if (status === "접수예정") return "접수 예정";
  if (status === "접수중") return "접수 중";
  if (status === "접수마감") return "접수 마감";
}

export function getRegistrationBadgeClassName(status: RegistrationStatus) {
  return cn(
    status === "접수중" && "border-brand bg-brand text-white",
    status === "접수예정" && "border-blue-500 bg-blue-500 text-white",
    status === "접수마감" && "border border-gray-400 text-foreground",
  );
}

export function formatMarathonDate(date: string | null) {
  if (!date) return "-";

  const eventDate = new Date(`${date}T00:00:00+09:00`);
  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(eventDate);
  const weekday = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(eventDate);

  return `${formattedDate}(${weekday})`;
}

export function formatMarathonPrices(
  prices: Record<string, number | string | null> | null,
) {
  const values = Object.values(prices ?? {}).filter(
    (value): value is number | string => value !== null,
  );
  if (values.length === 0) return "가격 확인";
  if (values.every((value) => typeof value === "number")) {
    const numbers = values as number[];
    const minimum = Math.min(...numbers);
    const maximum = Math.max(...numbers);
    if (minimum === 0 && maximum === 0) return "무료";
    return minimum === maximum
      ? `${minimum.toLocaleString("ko-KR")}원`
      : `${minimum.toLocaleString("ko-KR")}원 ~ ${maximum.toLocaleString("ko-KR")}원`;
  }
  return values.slice(0, 2).join(", ");
}

export function getMarathonDDay(date: string) {
  const today = new Date(`${getCurrentKoreanDate()}T00:00:00+09:00`).getTime();
  const eventDate = new Date(`${date}T00:00:00+09:00`).getTime();
  const days = Math.ceil((eventDate - today) / 86_400_000);
  if (days === 0) return "D-DAY";
  return days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;
}

export function getCurrentKoreanDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getCurrentKoreanTodayLabel() {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date());
}

export function getCurrentKoreanYear() {
  return Number(getCurrentKoreanDate().slice(0, 4));
}
