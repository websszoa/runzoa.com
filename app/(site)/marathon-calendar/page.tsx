import type { Metadata } from "next";

import MarathonHeader from "@/components/marathon/marathon-header";
import MarathonCalendar from "@/components/marathon/marathon-calendar";
import { getMarathons, MARATHON_HEADERS } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "마라톤 캘린더",
  description:
    "전국 마라톤과 러닝 대회의 개최 일정을 월별 캘린더로 확인하세요.",
  alternates: { canonical: "/marathon-calendar" },
};

export default async function MarathonCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string | string[] }>;
}) {
  const { marathons, error } = await getMarathons();
  const params = await searchParams;
  const requestedMonth = Array.isArray(params.month)
    ? params.month[0]
    : params.month;
  const initialMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(requestedMonth ?? "")
    ? requestedMonth
    : undefined;

  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.calendar} />
      <MarathonCalendar
        marathons={marathons}
        hasError={error}
        initialMonth={initialMonth}
      />
    </>
  );
}
