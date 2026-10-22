import type { Metadata } from "next";

import { LinkBioPage } from "@/components/link/link-bio-page";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} 링크 모음`,
  description: `${APP_NAME}의 모든 링크를 한곳에서 확인하세요. ${APP_DESCRIPTION}`,
  alternates: {
    canonical: "/link",
  },
};

export default function Page() {
  return <LinkBioPage />;
}
