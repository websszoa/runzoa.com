import type { Metadata } from "next";
import { CalendarPlus2 } from "lucide-react";

import CalendarAdd from "@/components/calendar/calendar-add";
import PageTitle from "@/components/page/page-title";
import { getMarathons } from "@/lib/marathons";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getCurrentKoreanDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "내 캘린더에 추가",
  description:
    "마라톤 대회 일정을 네이버, 구글, 카카오 캘린더에 간편하게 추가하세요.",
  alternates: { canonical: "/calendar-add" },
};

export default async function CalendarAddPage() {
  const [{ marathons, error }, supabase] = await Promise.all([
    getMarathons(),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let naverConnected = false;
  let addedSlugs: string[] = [];

  if (user) {
    const admin = createAdminClient();
    const [connectionResult, eventsResult] = await Promise.all([
      admin
        .from("naver_connections")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle(),
      admin
        .from("calendar_events")
        .select("marathon_slug")
        .eq("user_id", user.id)
        .eq("provider", "naver")
        .eq("status", "created"),
    ]);
    naverConnected = Boolean(connectionResult.data);
    addedSlugs = (eventsResult.data ?? []).map((item) => item.marathon_slug);
  }

  const today = getCurrentKoreanDate();
  const upcomingMarathons = marathons
    .filter((marathon) => marathon.event.startDate >= today)
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));

  return (
    <>
      <PageTitle
        icon={CalendarPlus2}
        eyebrow="RUNZOA CALENDAR CONNECT"
        title="내 캘린더에 추가"
        description="참가하고 싶은 마라톤 일정을 선택해 사용하는 캘린더에 바로 저장하세요."
      />
      <CalendarAdd
        marathons={upcomingMarathons}
        hasError={error}
        isLoggedIn={Boolean(user)}
        naverConnected={naverConnected}
        initialAddedSlugs={addedSlugs}
      />
    </>
  );
}
