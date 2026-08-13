import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  ListFilter,
  MapPinned,
  Search,
} from "lucide-react";

const raceFinders = [
  {
    icon: Search,
    title: "조건으로 찾기",
    description:
      "지역, 일정, 거리 등 원하는 조건을 골라 딱 맞는 대회를 찾아보세요.",
    href: "/marathon-search",
  },
  {
    icon: ListFilter,
    title: "목록으로 비교하기",
    description:
      "다가오는 대회를 한눈에 살펴보고 필요한 정보를 빠르게 비교해 보세요.",
    href: "/marathon-list",
  },
  {
    icon: CalendarDays,
    title: "달력으로 확인하기",
    description:
      "월별 대회 일정을 달력에서 확인하고 나만의 러닝 계획을 세워보세요.",
    href: "/marathon-calendar",
  },
  {
    icon: MapPinned,
    title: "지도로 둘러보기",
    description:
      "내 주변과 가고 싶은 지역의 마라톤 대회를 지도에서 찾아보세요.",
    href: "/marathon-map",
  },
];

export default function MainRaceFinder() {
  return (
    <section
      id="race-finder"
      aria-labelledby="race-finder-title"
      className="bg-[linear-gradient(180deg,#fff8f5_0%,#fffdfb_48%,#ffffff_100%)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="font-paperlogy text-sm tracking-wide text-brand uppercase">
            Race finder
          </p>
          <h2
            id="race-finder-title"
            className="mt-2 -ml-px font-paperlogy text-3xl leading-[1.1] font-semibold tracking-tight sm:text-5xl"
          >
            원하는 마라톤을
            <br />
            가장 편한 방법으로 찾아보세요!
          </h2>
          <p className="mt-3 font-anyvid text-sm leading-5 text-pretty text-muted-foreground sm:text-[15px] sm:leading-6">
            조건으로 좁히고, 전체 대회를 비교하고, 달력과 지도에서 일정을
            확인하세요.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border bg-background sm:mt-14">
          <ul className="grid divide-y sm:grid-cols-2 sm:divide-x [&>li:nth-child(2)]:sm:border-r-0 [&>li:nth-child(n+3)]:sm:border-t lg:grid-cols-4 lg:divide-y-0 [&>li:nth-child(2)]:lg:border-r [&>li:nth-child(n+3)]:lg:border-t-0">
            {raceFinders.map(({ icon: Icon, title, description, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:p-8"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>

                  <h3 className="mt-5 font-paperlogy text-xl font-semibold tracking-tight sm:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-3 font-anyvid text-sm leading-5 text-muted-foreground sm:text-[15px] sm:leading-6">
                    {description}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-1.5 font-anyvid text-sm font-medium text-brand">
                    자세히 살펴보기
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
