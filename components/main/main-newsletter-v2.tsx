import {
  ArrowRight,
  BellRing,
  CalendarCheck,
  CalendarDays,
  HandHeart,
} from "lucide-react";
import DialogNewsletter from "@/components/dialog/dialog-newsletter";

export default function MainNewsletterV2() {
  return (
    <section
      aria-labelledby="main-newsletter-v2-title"
      className="relative overflow-hidden bg-gradient-to-br from-brand/[0.08] via-background to-amber-50"
    >
      <span
        className="pointer-events-none absolute -top-28 -right-20 size-72 rounded-full bg-brand/[0.055]"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute -bottom-36 -left-20 size-80 rounded-full bg-amber-300/15"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute top-16 right-[16%] hidden size-3 rounded-full bg-brand/15 lg:block"
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute bottom-20 left-[13%] hidden size-2 rounded-full bg-amber-400/30 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center py-12 text-center sm:py-14">
          <div className="flex max-w-3xl flex-col items-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-background/80 px-3 py-1.5 font-paperlogy text-xs font-semibold text-brand backdrop-blur-sm">
              <BellRing className="size-3.5" aria-hidden="true" />
              RUNZOA NEWSLETTER
            </p>

            <h2
              id="main-newsletter-v2-title"
              className="mt-6 font-paperlogy text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              러닝 소식을 놓치지 마세요!
            </h2>

            <p className="mt-4 max-w-xl font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px]">
              새로운 대회 일정부터 접수 오픈 소식까지, 런조아가 필요한 정보만
              한눈에 정리해 드려요.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 font-anyvid text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                <CalendarDays
                  className="size-3.5 text-blue-500"
                  aria-hidden="true"
                />
                새로운 대회 일정
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                <CalendarCheck
                  className="size-3.5 text-violet-500"
                  aria-hidden="true"
                />
                접수 오픈 알림
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center">
            <DialogNewsletter
              subscriptionSource="메인 구독 배너"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 font-anyvid text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand/90"
            >
              <HandHeart className="size-4" aria-hidden="true" />
              뉴스레터 구독하기
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </DialogNewsletter>
          </div>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-1.5 border-t border-dashed border-brand/20" />
        <div
          className="detail-title-runner absolute bottom-0.5 left-0"
          style={{ animationDuration: "24s", animationDelay: "-3s" }}
        >
          <span
            className="promo-runner-message"
            style={{ animationDelay: "-2s" }}
          >
            구독해야겠다!
          </span>
          <span className="detail-title-runner-icon block text-xl leading-none drop-shadow-sm">
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
            접수 소식 발견!
          </span>
          <span className="newsletter-runner-jump block text-[22px] leading-none drop-shadow-sm">
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
            다음 대회는 어디지?
          </span>
          <span className="detail-title-runner-icon detail-title-runner-icon--two block text-lg leading-none drop-shadow-sm">
            🏃🏾
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0 left-0 hidden sm:block"
          style={{ animationDuration: "18s", animationDelay: "-11s" }}
        >
          <span className="newsletter-runner-rabbit block text-xl leading-none drop-shadow-sm">
            🐇
          </span>
        </div>
        <div
          className="detail-title-runner absolute bottom-0 left-0"
          style={{ animationDuration: "72s", animationDelay: "-51s" }}
        >
          <span className="newsletter-runner-turtle block text-lg leading-none drop-shadow-sm">
            🐢
          </span>
        </div>
      </div>
    </section>
  );
}
