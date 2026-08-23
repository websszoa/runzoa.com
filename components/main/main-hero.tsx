import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { APP_SHORT_DESCRIPTION, APP_SLOGAN } from "@/lib/constants";
import type { Marathon } from "@/lib/marathons";
import {
  getCurrentKoreanDate,
  getRegistrationStatus,
  hasRegistrationStartDate,
} from "@/lib/utils";
import {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Flag,
  Sparkles,
  TimerReset,
} from "lucide-react";

export default function MainHero({ marathons }: { marathons: Marathon[] }) {
  const today = getCurrentKoreanDate();
  const availableMarathons = marathons.filter(
    (marathon) =>
      hasRegistrationStartDate(marathon) && marathon.event.startDate >= today,
  );
  const weekendCount = getWeekendMarathonCount(availableMarathons, today);
  const currentMonth = today.slice(0, 7);
  const openCount = availableMarathons.filter(
    (marathon) => getRegistrationStatus(marathon) === "접수중",
  ).length;
  const upcomingRegistrationCount = availableMarathons.filter(
    (marathon) => getRegistrationStatus(marathon) === "접수예정",
  ).length;
  const monthCount = availableMarathons.filter((marathon) =>
    marathon.event.startDate.startsWith(currentMonth),
  ).length;
  return (
    <section
      aria-labelledby="main-hero-title"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm text-muted-foreground">
            <Sparkles aria-hidden="true" className="size-3.5 text-brand" />
            {APP_SLOGAN}
          </div>

          <h1
            id="main-hero-title"
            className="font-paperlogy text-balance text-5xl leading-[1.08] font-semibold tracking-tight sm:text-6xl lg:text-7xl"
          >
            달리고 싶은 대회를 찾는
            <br />
            가장 빠른 방법.
          </h1>

          <p className="mt-6 max-w-xl font-anyvid text-sm sm:text-[15px] leading-6 text-muted-foreground">
            {APP_SHORT_DESCRIPTION} <br />
            일정, 지역, 종목, 접수 정보를 한곳에서 확인하고 다음 레이스를
            준비하세요.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/marathon-search"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-brand px-5 text-white hover:bg-brand/85 rounded-full",
              )}
            >
              <span>대회 찾아보기</span>
              <ArrowRight aria-hidden="true" />
            </Link>
            {/* <Link
              href="/support?type=registration"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-5 rounded-full",
              )}
            >
              <span>내 보관함</span>
            </Link> */}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden="true"
            className="absolute -inset-10 -z-10 rounded-full bg-brand/10 blur-3xl"
          />

          <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-red-950/10">
            <div className="flex min-h-14 items-center gap-2 border-b px-5 sm:px-6">
              <span className="font-paperlogy text-xl font-black pt-1 tracking-wide text-brand uppercase">
                Runzoa live
              </span>
              <time
                dateTime={today}
                className="ml-auto font-anyvid text-sm text-muted-foreground pt-1"
              >
                {formatToday(today)} 기준
              </time>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border">
              <Link
                href="/marathon-list"
                className="group flex min-h-44 flex-col justify-between bg-background p-6 transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none"
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Flag className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="font-anyvid text-sm text-muted-foreground">
                    현재 확인 가능한 대회
                  </span>
                  <strong className="mt-1 block font-paperlogy text-5xl leading-none font-semibold tracking-tight tabular-nums">
                    {availableMarathons.length.toLocaleString("ko-KR")}
                    <span className="ml-1.5 font-anyvid text-base font-normal text-muted-foreground">
                      개
                    </span>
                  </strong>
                </span>
              </Link>

              <Link
                href="/marathon-list?status=open"
                className="group flex min-h-44 flex-col justify-between bg-brand p-6 text-white transition-colors hover:bg-brand/90 focus-visible:bg-brand/90 focus-visible:outline-none"
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-full bg-white/15 text-white">
                    <CalendarCheck className="size-5" aria-hidden="true" />
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 font-anyvid text-[11px] font-semibold text-brand">
                    접수 중
                    <ArrowRight
                      className="size-3 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </span>
                <span>
                  <span className="font-anyvid text-sm text-white/75">
                    지금 접수 중인 대회
                  </span>
                  <strong className="mt-1 block font-paperlogy text-5xl leading-none font-semibold tracking-tight tabular-nums">
                    {openCount.toLocaleString("ko-KR")}
                    <span className="ml-1.5 font-anyvid text-base font-normal text-white/70">
                      개
                    </span>
                  </strong>
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-px border-t bg-border">
              <Link
                href="/marathon-list?status=upcoming"
                className="flex min-w-0 items-center justify-center gap-1.5 bg-background px-2 py-3.5 font-anyvid text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <TimerReset
                  className="size-4 shrink-0 text-violet-500"
                  aria-hidden="true"
                />
                <span className="truncate">접수 예정</span>
                <strong className="font-semibold text-foreground tabular-nums">
                  {upcomingRegistrationCount}
                </strong>
              </Link>
              <Link
                href={`/marathon-calendar?month=${currentMonth}`}
                className="flex min-w-0 items-center justify-center gap-1.5 bg-background px-2 py-3.5 font-anyvid text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <CalendarDays
                  className="size-4 shrink-0 text-blue-500"
                  aria-hidden="true"
                />
                <span className="truncate">이번 달</span>
                <strong className="font-semibold text-foreground tabular-nums">
                  {monthCount}
                </strong>
              </Link>
              <Link
                href="/marathon-calendar"
                className="flex min-w-0 items-center justify-center gap-1.5 bg-background px-2 py-3.5 font-anyvid text-sm text-muted-foreground transition-colors hover:text-brand"
              >
                <Flag
                  className="size-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <span className="truncate">이번 주말</span>
                <strong className="font-semibold text-foreground tabular-nums">
                  {weekendCount}
                </strong>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatToday(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}.${month}.${day}`;
}

function getWeekendMarathonCount(marathons: Marathon[], today: string) {
  const current = new Date(`${today}T12:00:00+09:00`);
  const day = current.getUTCDay();
  const daysUntilSaturday = day === 0 ? -1 : 6 - day;
  const saturday = new Date(current);
  saturday.setUTCDate(current.getUTCDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setUTCDate(saturday.getUTCDate() + 1);
  const weekendDates = new Set([
    saturday.toISOString().slice(0, 10),
    sunday.toISOString().slice(0, 10),
  ]);

  return marathons.filter((marathon) =>
    weekendDates.has(marathon.event.startDate),
  ).length;
}
