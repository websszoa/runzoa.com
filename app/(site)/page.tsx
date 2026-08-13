import type { Metadata } from "next";
import MainHero from "@/components/main/main-hero";
import MainNewsletterV2 from "@/components/main/main-newsletter-v2";
import MainOpenRegistration from "@/components/main/main-open-registration";
import MainPromoBanner from "@/components/main/main-promo-banner";
import MainRaceFinder from "@/components/main/main-race-finder";
import MainThisMonth from "@/components/main/main-this-month";
import MainUpcoming from "@/components/main/main-upcoming";

import { getMarathons } from "@/lib/marathons";
import {
  APP_DESCRIPTION,
  APP_ENG_NAME,
  APP_NAME,
  APP_SITE_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: { absolute: `${APP_NAME} | 전국 마라톤 대회 정보` },
  description: APP_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: `${APP_NAME} | 전국 마라톤 대회 정보`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/icons/icon512.png",
        width: 512,
        height: 512,
        alt: `${APP_NAME} 로고`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | 전국 마라톤 대회 정보`,
    description: APP_DESCRIPTION,
    images: ["/icons/icon512.png"],
  },
};

export default async function Home() {
  const { marathons } = await getMarathons();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${APP_SITE_URL}/#organization`,
        name: APP_NAME,
        alternateName: APP_ENG_NAME,
        url: APP_SITE_URL,
        logo: `${APP_SITE_URL}/icons/icon512.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${APP_SITE_URL}/#website`,
        url: APP_SITE_URL,
        name: APP_NAME,
        alternateName: APP_ENG_NAME,
        description: APP_DESCRIPTION,
        inLanguage: "ko-KR",
        publisher: { "@id": `${APP_SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MainHero marathons={marathons} />
      <MainRaceFinder />
      <MainPromoBanner />
      <MainUpcoming marathons={marathons} />
      <MainThisMonth marathons={marathons} />
      <MainOpenRegistration marathons={marathons} />
      <MainNewsletterV2 />
    </>
  );
}
