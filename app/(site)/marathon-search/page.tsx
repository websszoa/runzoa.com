import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonSearch from "@/components/marathon/marathon-search";
import { getMarathons, MARATHON_HEADERS } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "마라톤 찾기",
  description:
    "전국 마라톤, 트레일러닝, 러닝 대회의 일정과 지역, 접수 정보를 한 번에 검색하세요.",
  alternates: {
    canonical: "/marathon-search",
  },
};

export default async function MarathonSearchPage() {
  const { marathons, error } = await getMarathons();

  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.search} />
      <MarathonSearch marathons={marathons} hasError={error} />
    </>
  );
}
