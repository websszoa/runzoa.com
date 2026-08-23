import type { Metadata } from "next";

import ArchiveGeocoder from "@/components/archive/archive-geocoder";
import MarathonHeader from "@/components/marathon/marathon-header";
import { MARATHON_HEADERS } from "@/lib/marathons";

export const metadata: Metadata = {
  title: "주소 좌표 변환",
  description: "주소를 위도와 경도로 변환하고 지도에서 위치를 확인하세요.",
  alternates: { canonical: "/geocoder" },
};

export default function GeocoderPage() {
  return (
    <>
      <MarathonHeader {...MARATHON_HEADERS.geocoder} />
      <ArchiveGeocoder
        naverMapKey={process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID ?? ""}
      />
    </>
  );
}
