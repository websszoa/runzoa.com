import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 디데이 계산 함수
 * @param eventDate - 이벤트 날짜 (YYYY-MM-DD 형식의 문자열)
 * @returns D-30, D-Day, 종료 형태의 문자열
 */
export function calculateDDay(eventDate: string): string {
  const targetDate = new Date(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "D-Day";
  } else if (diffDays > 0) {
    return `D-${diffDays}`;
  } else {
    return "종료";
  }
}

/**
 * 접수 상태에 따른 Badge 스타일 반환
 * @param status - 접수 상태 (접수중, 접수대기, 접수마감 등)
 * @returns Tailwind CSS 클래스 문자열
 */
export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case "접수중":
      return "text-green-600 border-green-600 bg-transparent";
    case "접수대기":
      return "text-blue-600 border-blue-600 bg-transparent";
    case "접수마감":
      return "text-gray-500 border-gray-400 bg-transparent";
    default:
      return "border-gray-400 bg-transparent text-gray-500";
  }
}

/**
 * 날짜를 요일 포함 형식으로 변환
 * @param dateString - 날짜 문자열 (YYYY-MM-DD 형식)
 * @returns YYYY-MM-DD(요일) 형식의 문자열
 */
export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()];

  return `${dateString}(${dayOfWeek})`;
}

/**
 * 가격 정보를 포맷팅
 * @param price - 가격 객체 (예: { half: 70000, "10km": 60000 })
 * @returns 포맷된 가격 문자열 (예: "60,000원" 또는 "60,000원 ~ 70,000원")
 */
export function formatPrice(price: Record<string, number>): string {
  const prices = Object.values(price).filter((p) => p > 0);

  if (prices.length === 0) return "-";
  if (prices.length === 1) {
    return `${prices[0].toLocaleString()}원`;
  }

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return `${min.toLocaleString()}원`;
  }

  return `${min.toLocaleString()}원 ~ ${max.toLocaleString()}원`;
}

/**
 * 대회까지 남은 일수 계산
 * @param eventDate - 이벤트 날짜 (YYYY-MM-DD 형식)
 * @returns 남은 일수 (양수: 남은 일수, 0: 오늘, 음수: 지난 일수)
 */
export function calculateDiffDays(eventDate: string): number {
  const targetDate = new Date(eventDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * 시간을 포맷팅 (HH:MM:SS -> HH:MM)
 * @param timeString - 시간 문자열
 * @returns 포맷된 시간 문자열
 */
export function formatTime(timeString: string): string {
  if (!timeString) return "";
  return timeString.substring(0, 5); // HH:MM만 추출
}

/**
 * 상대적 시간 표시
 * @param dateString - 날짜 문자열
 * @returns 상대적 시간 (예: "방금 전", "3시간 전", "2일 전")
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;
  return `${Math.floor(diffDays / 365)}년 전`;
}

/**
 * UserAgent 분석
 * @param userAgent - navigator.userAgent 문자열
 * @returns 브라우저, OS, 디바이스 정보 객체
 */
export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // 브라우저 감지
  let browser = "unknown";
  if (ua.includes("edg")) browser = "edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";
  else if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("opera") || ua.includes("opr")) browser = "opera";

  // OS 감지
  let os = "unknown";
  if (ua.includes("win")) os = "windows";
  else if (ua.includes("mac")) os = "mac";
  else if (ua.includes("linux")) os = "linux";
  else if (ua.includes("android")) os = "android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "ios";

  // 디바이스 감지
  let device = "desktop";
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    device = "mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    device = "tablet";
  }

  return { browser, os, device };
}

/**
 * UserAgent 클래스 생성
 * @param userAgent - navigator.userAgent 문자열
 * @returns body 태그에 추가할 클래스 문자열
 */
export function getUserAgentClasses(userAgent: string): string {
  const { browser, os, device } = parseUserAgent(userAgent);
  return `br-${browser} os-${os} de-${device}`;
}

/**
 * 접수 상태에 따른 텍스트 색상 반환
 * @param status - 접수 상태
 * @returns Tailwind 색상 클래스
 */
export function getRegistrationStatusColor(status: string): string {
  switch (status) {
    case "접수중":
      return "text-green-600";
    case "접수마감":
      return "text-gray-600";
    case "접수대기":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
}

/**
 * 날짜/시간 포맷팅 (00:00:00 제거, 정시는 "시" 표시)
 * @param dateTimeString - 날짜 시간 문자열 (예: "2025-11-13 10:00:00")
 * @returns 포맷된 문자열 (예: "2025-11-13 10시" 또는 "2025-11-13 10:30" 또는 "2025-11-13")
 */
export function formatRegistrationDateTime(dateTimeString: string): string {
  if (!dateTimeString) return "";

  // 공백으로 날짜와 시간 분리
  const [date, time] = dateTimeString.split(" ");

  if (!time) return date; // 시간이 없으면 날짜만

  // 00:00:00이면 시간 제거
  if (time === "00:00:00" || time.startsWith("00:00")) {
    return date;
  }

  // 시간과 분 분리
  const [hour, minute] = time.split(":");

  // 분이 00이면 "시" 표시
  if (minute === "00") {
    return `${date} ${parseInt(hour)}시`;
  }

  // 분이 있으면 HH:MM 형식
  return `${date} ${hour}:${minute}`;
}
