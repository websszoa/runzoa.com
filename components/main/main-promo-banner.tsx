import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  LocateFixed,
  MapPin,
  MapPinned,
} from "lucide-react";

export default function MainPromoBanner() {
  return (
    <section
      aria-labelledby="main-promo-title"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#f1170f_0%,#e9231b_48%,#ff6a3d_100%)] text-white"
    >
      <div
        className="absolute -top-28 -right-20 size-80 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-36 left-[35%] size-72 rounded-full bg-amber-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:36px_36px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-anyvid text-xs font-semibold tracking-wide text-white/90 uppercase backdrop-blur-sm">
            <MapPinned className="size-3.5" aria-hidden="true" />
            RunZoa Map
          </p>
          <h2
            id="main-promo-title"
            className="mt-5 font-paperlogy text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            내 주변의 러닝 대회,
            <br />
            지도에서 더 빠르게 만나보세요!
          </h2>
          <p className="mt-4 max-w-xl font-anyvid text-sm leading-6 text-white/75 sm:text-[15px]">
            현재 위치를 기준으로 가까운 대회를 찾고, 개최 장소와 접수 정보를 한
            번에 확인해 보세요.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/marathon-map"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 font-anyvid text-sm font-semibold text-brand transition-colors hover:bg-white/90"
            >
              대회 지도 열기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/marathon-calendar"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 font-anyvid text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <CalendarDays className="size-4" aria-hidden="true" />
              달력으로 일정 보기
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto hidden h-64 w-full max-w-md lg:block"
          aria-hidden="true"
        >
          <div className="absolute inset-0 rotate-2 rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-sm">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/15 bg-white/10">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(35deg,transparent_44%,white_45%,white_47%,transparent_48%),linear-gradient(-35deg,transparent_44%,white_45%,white_47%,transparent_48%)] [background-size:72px_72px]" />
              <span className="absolute top-[20%] left-[18%] flex size-11 items-center justify-center rounded-full bg-white text-brand shadow-lg">
                <MapPin className="size-5 fill-current" />
              </span>
              <span className="absolute top-[48%] right-[18%] flex size-9 items-center justify-center rounded-full bg-amber-300 text-red-700 shadow-lg">
                <MapPin className="size-4 fill-current" />
              </span>
              <span className="absolute right-[42%] bottom-[12%] flex size-10 items-center justify-center rounded-full bg-white text-brand shadow-lg">
                <MapPin className="size-4 fill-current" />
              </span>
              <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-white/20 bg-red-950/20 text-white backdrop-blur-sm">
                <LocateFixed className="size-4" />
              </span>
              <div className="absolute right-4 bottom-4 left-4 rounded-xl bg-white p-3 text-left text-foreground shadow-lg">
                <p className="font-paperlogy text-sm font-semibold">
                  가까운 대회 발견!
                </p>
                <p className="mt-1 font-anyvid text-xs text-muted-foreground">
                  위치와 일정을 지도에서 바로 비교하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-1.5 border-t border-dashed border-white/35" />
        <div
          className="detail-title-runner absolute bottom-0.5 left-0"
          style={{ animationDuration: "22s", animationDelay: "-2s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-1s" }}
          >
            포기하고 싶다!!
          </span>
          <span className="detail-title-runner-icon block text-xl leading-none drop-shadow-sm">
            🏃🏻‍♂️
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0 left-0"
          style={{ animationDuration: "29s", animationDelay: "-7s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-4s" }}
          >
            달려!
          </span>
          <span className="detail-title-runner-icon detail-title-runner-icon--two block text-lg leading-none drop-shadow-sm">
            🏃🏽‍♀️
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-1 left-0"
          style={{ animationDuration: "36s", animationDelay: "-15s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-7s" }}
          >
            조금만 더!
          </span>
          <span className="detail-title-runner-icon detail-title-runner-icon--three block text-[22px] leading-none drop-shadow-sm">
            🏃🏿
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0 left-0 hidden sm:block"
          style={{ animationDuration: "43s", animationDelay: "-24s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-10s" }}
          >
            내 페이스대로
          </span>
          <span className="detail-title-runner-icon block text-lg leading-none drop-shadow-sm [animation-duration:0.3s]">
            🏃🏼
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-1 left-0 hidden sm:block"
          style={{ animationDuration: "50s", animationDelay: "-35s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-13s" }}
          >
            완주 가자!
          </span>
          <span className="detail-title-runner-icon block text-xl leading-none drop-shadow-sm [animation-duration:0.36s]">
            🏃🏾‍♂️
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0.5 left-0 hidden sm:block"
          style={{ animationDuration: "57s", animationDelay: "-47s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-16s" }}
          >
            오늘도 최고!
          </span>
          <span className="detail-title-runner-icon block text-[19px] leading-none drop-shadow-sm [animation-duration:0.26s]">
            🏃🏻‍♀️
          </span>
        </div>
      </div>
    </section>
  );
}
