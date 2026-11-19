import type { Metadata } from "next";

import { LinkBioPage } from "@/components/link/link-bio-page";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { getMarathons } from "@/lib/marathons";
import { getUpcomingRegistrations } from "@/lib/utils";

export const metadata: Metadata = {
  title: `${APP_NAME} 링크 모음`,
  description: `${APP_NAME}의 모든 링크를 한곳에서 확인하세요. ${APP_DESCRIPTION}`,
  alternates: {
    canonical: "/link",
  },
};

// 접수 시작 시각이 지난 대회가 목록에서 빠지도록 10분마다 다시 생성합니다.
export const revalidate = 600;

export default async function Page() {
  const { marathons } = await getMarathons();
  const upcoming = getUpcomingRegistrations(marathons).map(
    ({ marathon, schedules }) => {
      const [, month, day] = (schedules[0].startDate ?? "")
        .split("-")
        .map(Number);
      const time = schedules[0].startTime ? ` ${schedules[0].startTime}` : "";
      return {
        title: marathon.name,
        // 공식 접수 페이지 → 대회 홈페이지 → 런조아 상세 페이지 순으로 연결합니다.
        href:
          marathon.registration.site ??
          marathon.event.site ??
          `/marathon/${marathon.slug}`,
        badge: `${month}.${day}일${time} 접수`,
      };
    },
  );

  return <LinkBioPage upcoming={upcoming} />;
}
