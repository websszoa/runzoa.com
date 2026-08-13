import type { Marathon } from "@/lib/marathons";
import DetailButtons from "@/components/detail/detail-buttons";
import DetailGallery from "@/components/detail/detail-gallery";
import DetailInfo from "@/components/detail/detail-info";
import DetailLocation from "@/components/detail/detail-location";
import DetailMonthly from "@/components/detail/detail-monthly";
import DetailNotice from "@/components/detail/detail-notice";
import DetailOpenRegistration from "@/components/detail/detail-open-registration";
import DetailRegistration from "@/components/detail/detail-registration";
import DetailUpcoming from "@/components/detail/detail-upcoming";
import DetailTitle from "@/components/detail/detail-title";

export default function MarathonDetail({
  marathon,
  upcomingMarathons,
  openMarathons,
  openMarathonCount,
  monthlyMarathons,
  monthlyMarathonCount,
}: {
  marathon: Marathon;
  upcomingMarathons: Marathon[];
  openMarathons: Marathon[];
  openMarathonCount: number;
  monthlyMarathons: Marathon[];
  monthlyMarathonCount: number;
}) {
  return (
    <>
      <DetailTitle marathon={marathon} />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 pt-10 pb-4 sm:px-6 lg:grid-cols-3 lg:px-8 lg:pt-14 lg:pb-4">
        <div className="order-2 h-full space-y-4 lg:order-1 lg:col-span-2">
          <DetailInfo marathon={marathon} />
        </div>
        <div className="order-1 h-full lg:order-2 lg:col-span-1">
          <DetailGallery
            name={marathon.name}
            images_cover={`/marathon/cover/${marathon.id}.webp`}
            eventSite={marathon.event.site}
          />
        </div>
        <div className="order-3 lg:col-span-3">
          <DetailButtons marathonName={marathon.name} />
        </div>
        <div className="order-4 lg:col-span-3">
          <DetailRegistration marathon={marathon} />
        </div>
        <div className="order-5 lg:col-span-3">
          <DetailLocation
            name={marathon.name}
            venue={marathon.location.venue}
            address={marathon.location.address}
            region={marathon.location.region}
            country={marathon.location.country}
            latitude={marathon.location.latitude}
            longitude={marathon.location.longitude}
            naverMapKey={process.env.NEXT_PUBLIC_NAVER_MAP_NCP_KEY_ID ?? ""}
          />
        </div>
        <div className="order-6 lg:col-span-3">
          <DetailUpcoming marathons={upcomingMarathons} />
        </div>
        <div className="order-7 lg:col-span-3">
          <DetailOpenRegistration
            marathons={openMarathons}
            totalCount={openMarathonCount}
          />
        </div>
        <div className="order-8 lg:col-span-3">
          <DetailMonthly
            month={Number(marathon.event.startDate.slice(5, 7))}
            monthKey={marathon.event.startDate.slice(0, 7)}
            marathons={monthlyMarathons}
            totalCount={monthlyMarathonCount}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-14">
        <DetailNotice />
      </div>
    </>
  );
}
