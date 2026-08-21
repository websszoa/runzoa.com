import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarathons } from "@/lib/marathons";
import {
  getCurrentKoreanDate,
  getRegistrationStatus,
  hasRegistrationStartDate,
} from "@/lib/utils";
import MarathonDetail from "@/components/marathon/marathon-detail";

type MarathonDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: MarathonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { marathons } = await getMarathons();
  const marathon = marathons.find((item) => item.slug === slug);

  if (!marathon) return {};

  return {
    title: marathon.name,
    description:
      marathon.description ??
      `${marathon.name} 개최 일정, 장소, 접수 기간과 참가 종목을 확인하세요.`,
    alternates: { canonical: `/marathon/${marathon.slug}` },
  };
}

export default async function MarathonDetailPage({
  params,
}: MarathonDetailPageProps) {
  const { slug } = await params;
  const { marathons } = await getMarathons();
  const marathon = marathons.find((item) => item.slug === slug);

  if (!marathon) notFound();

  const upcomingMarathons = marathons
    .filter(
      (item) =>
        item.slug !== marathon.slug &&
        hasRegistrationStartDate(item) &&
        getRegistrationStatus(item) === "접수예정" &&
        item.registration.startDate,
    )
    .sort((a, b) =>
      (a.registration.startDate as string).localeCompare(
        b.registration.startDate as string,
      ),
    )
    .slice(0, 4);

  const openMarathons = marathons
    .filter(
      (item) =>
        item.slug !== marathon.slug &&
        hasRegistrationStartDate(item) &&
        getRegistrationStatus(item) === "접수중" &&
        item.event.startDate >= getCurrentKoreanDate(),
    )
    .sort((a, b) =>
      (a.registration.endDate ?? "9999-12-31").localeCompare(
        b.registration.endDate ?? "9999-12-31",
      ),
    );
  const openMarathonCount = openMarathons.length;

  const eventMonth = marathon.event.startDate.slice(0, 7);
  const monthlyMarathons = marathons
    .filter(
      (item) =>
        item.slug !== marathon.slug &&
        hasRegistrationStartDate(item) &&
        item.event.startDate.startsWith(eventMonth),
    )
    .sort((a, b) => a.event.startDate.localeCompare(b.event.startDate));
  const monthlyMarathonCount = monthlyMarathons.length;

  return (
    <MarathonDetail
      marathon={marathon}
      upcomingMarathons={upcomingMarathons}
      openMarathons={openMarathons.slice(0, 10)}
      openMarathonCount={openMarathonCount}
      monthlyMarathons={monthlyMarathons.slice(0, 10)}
      monthlyMarathonCount={monthlyMarathonCount}
    />
  );
}
