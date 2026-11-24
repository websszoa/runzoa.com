import type { Metadata } from "next";

import { LinkBioPage } from "@/components/link/link-bio-page";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { getMarathons } from "@/lib/marathons";
import {
  getCurrentKoreanDate,
  getEffectiveRegistrationSchedule,
  getRegistrationStatus,
  getStartOfKoreanToday,
  getUpcomingRegistrations,
  isKoreanLocation,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: `${APP_NAME} 링크 모음`,
  description: `${APP_NAME}의 모든 링크를 한곳에서 확인하세요. ${APP_DESCRIPTION}`,
  alternates: {
    canonical: "/link",
  },
};

// 날짜가 바뀌면 지난 대회가 목록에서 빠지도록 10분마다 다시 생성합니다.
export const revalidate = 600;

export default async function Page() {
  const { marathons } = await getMarathons();
  const today = getCurrentKoreanDate();
  // 오늘 접수가 시작된 대회는 그날 자정까지 목록에 남겨 둡니다.
  const upcoming = getUpcomingRegistrations(
    marathons,
    getStartOfKoreanToday(),
  ).map(({ marathon, schedules }) => {
    const { startDate, startTime } = schedules[0];
    const [, month, day] = (startDate ?? "").split("-").map(Number);
    const time = startTime ? ` ${startTime}` : "";
    const isToday = startDate === today;
    return {
      title: marathon.name,
      // 공식 접수 페이지 → 대회 홈페이지 → 런조아 상세 페이지 순으로 연결합니다.
      href:
        marathon.registration.site ??
        marathon.event.site ??
        `/marathon/${marathon.slug}`,
      badge: isToday
        ? `오늘${time} 접수 시작`
        : `${month}.${day}일${time} 접수`,
      isToday,
    };
  });

  const openMarathons = marathons
    .filter(
      (marathon) =>
        isKoreanLocation(marathon.location.country) &&
        getRegistrationStatus(marathon) === "접수중" &&
        marathon.event.startDate >= today,
    )
    .sort((a, b) => {
      const aSchedule = getEffectiveRegistrationSchedule(a);
      const bSchedule = getEffectiveRegistrationSchedule(b);
      return (aSchedule.endDate ?? "9999-12-31").localeCompare(
        bSchedule.endDate ?? "9999-12-31",
      );
    });

  const open = openMarathons
    .slice(0, 20)
    .map((marathon) => {
      const schedule = getEffectiveRegistrationSchedule(marathon);
      return {
        title: marathon.name,
        href:
          marathon.registration.site ??
          marathon.event.site ??
          `/marathon/${marathon.slug}`,
        badge: getClosingLabel(schedule.endDate),
      };
    });

  return (
    <LinkBioPage
      upcoming={upcoming}
      open={open}
      openTotal={openMarathons.length}
    />
  );
}

function getClosingLabel(endDate: string | null) {
  if (!endDate) return "선착순 마감";

  const today = new Date(
    `${getCurrentKoreanDate()}T00:00:00+09:00`,
  ).getTime();
  const closing = new Date(`${endDate}T00:00:00+09:00`).getTime();
  const days = Math.max(0, Math.ceil((closing - today) / 86_400_000));

  return days === 0 ? "오늘 마감" : `마감 D-${days}`;
}
