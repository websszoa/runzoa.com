import MainHero from "@/components/main/main-hero";
import MainNewsletter from "@/components/main/main-newsletter";
import MainOpenRegistration from "@/components/main/main-open-registration";
import MainPromoBanner from "@/components/main/main-promo-banner";
import MainRaceFinder from "@/components/main/main-race-finder";
import MainRegistrationSoon from "@/components/main/main-registration-soon";
import MainThisMonth from "@/components/main/main-this-month";
import DialogAccountNotice, {
  type AccountNotice,
} from "@/components/dialog/dialog-account-notice";
// import DialogSiteMaintenance from "@/components/dialog/dialog-site-maintenance";

import { getMarathons } from "@/lib/marathons";
import {
  APP_DESCRIPTION,
  APP_ENG_NAME,
  APP_NAME,
  APP_SITE_URL,
} from "@/lib/constants";

type HomeProps = {
  searchParams: Promise<{
    error?: string | string[];
    account?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { marathons } = await getMarathons();
  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const account = Array.isArray(params.account)
    ? params.account[0]
    : params.account;
  const accountNotice: AccountNotice | null =
    error === "deleted"
      ? "deleted"
      : account === "withdrawn"
        ? "withdrawn"
        : null;
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
      {accountNotice && <DialogAccountNotice notice={accountNotice} />}
      {/* <DialogSiteMaintenance /> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <MainHero marathons={marathons} />
      <MainRaceFinder />
      <MainPromoBanner />
      <MainRegistrationSoon marathons={marathons} />
      <MainThisMonth marathons={marathons} />
      <MainOpenRegistration marathons={marathons} />
      <MainNewsletter />
    </>
  );
}
