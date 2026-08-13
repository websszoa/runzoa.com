import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonList from "@/components/marathon/marathon-list";
import { getMarathons, MARATHON_HEADERS } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "마라톤 리스트",
  description:
    "전국 마라톤과 러닝 대회의 개최일, 접수 상태, 지역, 종목과 참가비를 리스트로 비교하세요.",
  alternates: {
    canonical: "/marathon-list",
  },
};

export default async function MarathonListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const { marathons, error } = await getMarathons();
  const params = await searchParams;
  const requestedStatus = Array.isArray(params.status)
    ? params.status[0]
    : params.status;

  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.list} />
      <MarathonList
        marathons={marathons}
        hasError={error}
        initialStatus={
          requestedStatus === "open"
            ? "접수중"
            : requestedStatus === "upcoming"
              ? "접수예정"
              : "전체"
        }
      />
    </>
  );
}
