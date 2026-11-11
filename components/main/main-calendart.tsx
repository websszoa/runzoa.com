import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck2, CalendarPlus2 } from "lucide-react";

export default function MainCalendarConnectBanner() {
  return (
    <section
      aria-labelledby="calendar-connect-banner-title"
      className="relative overflow-hidden bg-linear-to-br from-blue-500/10 via-background to-sky-50"
    >
      <span
        className="pointer-events-none absolute -top-28 -right-20 size-72 rounded-full bg-blue-500/8"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-36 -left-20 size-80 rounded-full bg-sky-300/20"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute top-16 right-[16%] hidden size-3 rounded-full bg-blue-500/20 lg:block"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-20 left-[13%] hidden size-2 rounded-full bg-sky-400/35 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-80 flex-col items-center justify-center py-12 text-center sm:py-14">
          <div className="flex max-w-3xl flex-col items-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-background/80 px-3 py-1.5 font-paperlogy text-xs font-semibold text-blue-600 backdrop-blur-sm">
              <CalendarPlus2 className="size-3.5" aria-hidden="true" />
              RUNZOA CALENDAR
            </p>

            <h2
              id="calendar-connect-banner-title"
              className="mt-6 font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              마라톤 일정을 놓치지 마세요!
            </h2>

            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              참가하고 싶은 대회와 접수 시작일을 사용하는 캘린더에 추가하고
              중요한 일정을 미리 준비하세요.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 font-anyvid text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                <span className="flex size-5 items-center justify-center rounded-md bg-[#FEE500]">
                  <KakaoLogo />
                </span>
                카카오톡 캘린더
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                <span className="flex size-5 items-center justify-center rounded-md bg-[#03c75a]">
                  <Image
                    src="/svg/naver.svg"
                    alt=""
                    width={9}
                    height={9}
                    unoptimized
                    className="brightness-0 invert"
                  />
                </span>
                네이버 캘린더
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <Link
              href="/calendar-add"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-anyvid text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <CalendarCheck2 className="size-4" aria-hidden="true" />
              내 캘린더에 추가하기
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-1.5 border-t border-dashed border-blue-500/20" />
        <div
          className="detail-title-runner absolute bottom-0.5 left-0"
          style={{ animationDuration: "24s", animationDelay: "-3s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-2s" }}
          >
            일정 추가 완료!
          </span>
          <span className="detail-title-runner-icon block text-xl leading-none">
            🏃🏻‍♀️
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0 left-0"
          style={{ animationDuration: "34s", animationDelay: "-19s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-8s" }}
          >
            대회 일정 챙겼다!
          </span>
          <span className="newsletter-runner-jump block text-[22px] leading-none">
            🏃🏽‍♂️
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-1 left-0 hidden sm:block"
          style={{ animationDuration: "43s", animationDelay: "-34s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-14s" }}
          >
            접수일도 잊지 말자!
          </span>
          <span className="detail-title-runner-icon detail-title-runner-icon--two block text-lg leading-none">
            🏃🏾
          </span>
        </div>
      </div>
    </section>
  );
}

function KakaoLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 21 21"
      aria-hidden="true"
    >
      <path
        fill="#3C1E1E"
        d="M10.5 3.217c4.514 0 8 2.708 8 6.004 0 3.758-4.045 6.184-8 5.892-1.321-.093-1.707-.17-2.101-.23-1.425.814-2.728 2.344-3.232 2.334-.325-.19.811-2.896.533-3.114-.347-.244-3.157-1.329-3.2-4.958 0-3.199 3.486-5.928 8-5.928Z"
      />
    </svg>
  );
}
