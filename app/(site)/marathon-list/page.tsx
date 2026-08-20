import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonList, {
  type RegistrationFilter,
  type ScaleFilter,
} from "@/components/marathon/marathon-list";
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
  searchParams: Promise<{
    status?: string | string[];
    year?: string | string[];
    month?: string | string[];
    type?: string | string[];
    region?: string | string[];
    scale?: string | string[];
    past?: string | string[];
  }>;
}) {
  const { marathons, error } = await getMarathons();
  const params = await searchParams;
  const requestedStatus = getFirstParam(params.status);
  const requestedYear = Number(getFirstParam(params.year));
  const requestedMonth = Number(getFirstParam(params.month));
  const requestedType = getFirstParam(params.type);
  const requestedRegion = getFirstParam(params.region);
  const requestedScale = getFirstParam(params.scale);
  const requestedPast = getFirstParam(params.past);
  const availableYears = new Set(
    marathons.map((marathon) => Number(marathon.event.startDate.slice(0, 4))),
  );
  const availableTypes = new Set(
    marathons.map((marathon) => marathon.info.type).filter(Boolean),
  );
  const availableRegions = new Set(
    marathons.map((marathon) => marathon.location.region).filter(Boolean),
  );

  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.list} />
      <MarathonList
        marathons={marathons}
        hasError={error}
        initialStatus={getInitialStatus(requestedStatus)}
        initialYear={availableYears.has(requestedYear) ? requestedYear : null}
        initialMonth={
          Number.isInteger(requestedMonth) &&
          requestedMonth >= 1 &&
          requestedMonth <= 12
            ? requestedMonth
            : null
        }
        initialRaceType={
          requestedType && availableTypes.has(requestedType)
            ? requestedType
            : "전체"
        }
        initialRegion={
          requestedRegion && availableRegions.has(requestedRegion)
            ? requestedRegion
            : "전체"
        }
        initialScale={getInitialScale(requestedScale)}
        initialIncludePast={requestedPast === "true" || requestedPast === "1"}
      />
    </>
  );
}

function getFirstParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getInitialStatus(value?: string): RegistrationFilter {
  if (value === "open") return "접수중";
  if (value === "upcoming") return "접수예정";
  if (value === "closed") return "접수마감";
  return "전체";
}

function getInitialScale(value?: string): ScaleFilter {
  const scales: ScaleFilter[] = [
    "5천명 이하",
    "5천~1만명",
    "1만~2만명",
    "2만명 이상",
  ];

  return scales.find((scale) => scale === value) ?? "전체";
}
