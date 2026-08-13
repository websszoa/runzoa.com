import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Marathon } from "@/lib/marathons";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RegistrationStatus =
  | "접수미정"
  | "접수예정"
  | "접수중"
  | "접수마감";

export function getRegistrationStatus(marathon: Marathon): RegistrationStatus {
  const today = getCurrentKoreanDate();
  const { startDate, endDate } = marathon.registration;
  if (!startDate && !endDate) return "접수미정";
  if (startDate && today < startDate) return "접수예정";
  if (endDate && today > endDate) return "접수마감";
  return "접수중";
}

export function getRegistrationLabel(status: RegistrationStatus) {
  return {
    접수미정: "접수 미정",
    접수예정: "접수 예정",
    접수중: "접수중",
    접수마감: "접수 마감",
  }[status];
}

export function getRegistrationBadgeClassName(status: RegistrationStatus) {
  return cn(
    status === "접수중" && "border-brand bg-brand text-white",
    status === "접수예정" && "border-blue-500/30 bg-blue-500/10 text-blue-700",
    status === "접수마감" && "border border-gray-400 text-muted-foreground",
    status === "접수미정" && "border border-gray-400 text-muted-foreground",
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

export function formatMarathonPrices(prices: Record<string, number | string>) {
  const values = Object.values(prices);
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

export function getCurrentKoreanYear() {
  return Number(getCurrentKoreanDate().slice(0, 4));
}
