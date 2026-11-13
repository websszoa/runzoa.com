import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Marathon } from "@/lib/marathons";
import { getMarathons } from "@/lib/marathons";
import { APP_SITE_URL, getMarathonCoverUrl } from "@/lib/constants";
import {
  getCurrentKoreanDate,
  getRegistrationStatus,
  getUpcomingRegistrations,
  hasRegistrationStartDate,
  isKoreanLocation,
} from "@/lib/utils";
import MarathonDetail from "@/components/marathon/marathon-detail";

type MarathonDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function truncate(text: string, maxLength: number) {
  return text.length > maxLength
    ? `${text.slice(0, maxLength - 1)}…`
    : text;
}

export async function generateMetadata({
  params,
}: MarathonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { marathons } = await getMarathons();
  const marathon = marathons.find((item) => item.slug === slug);

  if (!marathon) return {};

  const description =
    marathon.description ??
    `${marathon.name} 개최 일정, 장소, 접수 기간과 참가 종목을 확인하세요.`;
  const shortDescription = truncate(description, 160);
  const path = `/marathon/${marathon.slug}`;
  const coverUrl = getMarathonCoverUrl(`${marathon.slug}.webp`);

  return {
    title: marathon.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: marathon.name,
      description: shortDescription,
      images: [{ url: coverUrl, width: 960, height: 1280, alt: marathon.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: marathon.name,
      description: shortDescription,
      images: [coverUrl],
    },
  };
}

function buildMarathonStructuredData(marathon: Marathon) {
  const path = `/marathon/${marathon.slug}`;
  const url = `${APP_SITE_URL}${path}`;
  const coverUrl = getMarathonCoverUrl(`${marathon.slug}.webp`);
  const location =
    marathon.location.venue ||
    marathon.location.address ||
    marathon.location.region
      ? {
          "@type": "Place",
          name: marathon.location.venue || marathon.name,
          address: {
            "@type": "PostalAddress",
            ...(marathon.location.address && {
              streetAddress: marathon.location.address,
            }),
            ...(marathon.location.region && {
              addressRegion: marathon.location.region,
            }),
            addressCountry: isKoreanLocation(marathon.location.country)
              ? "KR"
              : (marathon.location.country ?? "KR"),
          },
          ...(marathon.location.latitude &&
            marathon.location.longitude && {
              geo: {
                "@type": "GeoCoordinates",
                latitude: marathon.location.latitude,
                longitude: marathon.location.longitude,
              },
            }),
        }
      : undefined;

  const organizerName = marathon.hosts.organizer || marathon.hosts.manager;
  const registrationStatus = getRegistrationStatus(marathon);
  const availability =
    registrationStatus === "접수중"
      ? "https://schema.org/InStock"
      : registrationStatus === "접수마감"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/PreOrder";
  const offers = Object.entries(marathon.registration.price ?? {})
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([distance, price]) => ({
      "@type": "Offer",
      name: distance,
      price,
      priceCurrency: marathon.registration.currency ?? "KRW",
      availability,
      url: marathon.registration.site ?? url,
    }));

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: marathon.name,
    description: marathon.description ?? marathon.name,
    url,
    image: [coverUrl],
    startDate: `${marathon.event.startDate}T${marathon.event.startTime ?? "00:00"}:00+09:00`,
    ...(marathon.event.endDate && {
      endDate: `${marathon.event.endDate}T${marathon.event.endTime ?? "23:59"}:00+09:00`,
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(location && { location }),
    ...(organizerName && {
      organizer: {
        "@type": "Organization",
        name: organizerName,
        url: marathon.event.site ?? APP_SITE_URL,
      },
    }),
    ...(offers.length > 0 && { offers }),
  };
}

export default async function MarathonDetailPage({
  params,
}: MarathonDetailPageProps) {
  const { slug } = await params;
  const { marathons } = await getMarathons();
  const marathon = marathons.find((item) => item.slug === slug);

  if (!marathon) notFound();

  const upcomingMarathons = getUpcomingRegistrations(
    marathons.filter((item) => item.slug !== marathon.slug),
  ).map(({ marathon }) => marathon);

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

  const structuredData = buildMarathonStructuredData(marathon);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MarathonDetail
        marathon={marathon}
        upcomingMarathons={upcomingMarathons}
        openMarathons={openMarathons.slice(0, 10)}
        openMarathonCount={openMarathonCount}
        monthlyMarathons={monthlyMarathons.slice(0, 10)}
        monthlyMarathonCount={monthlyMarathonCount}
      />
    </>
  );
}
