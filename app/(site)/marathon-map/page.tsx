import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonMap from "@/components/marathon/marathon-map";
import { getMarathons, MARATHON_HEADERS } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "마라톤 지도",
  description: "전국 마라톤과 러닝 대회의 개최 위치를 지도에서 찾아보세요.",
  alternates: { canonical: "/marathon-map" },
};

export default async function MarathonMapPage() {
  const { marathons, error } = await getMarathons();

  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.map} />
      <MarathonMap
        marathons={marathons}
        hasError={error}
        naverMapKey={process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID ?? ""}
      />
    </>
  );
}
