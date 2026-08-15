import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPinned } from "lucide-react";

import marathonIntroduction from "@/public/images/marathon-introduction.png";

const highlights = [
  { icon: CalendarDays, label: "일정별 대회 찾기" },
  { icon: MapPinned, label: "전국 코스 한눈에" },
];

export default function MainMarathonStory() {
  return (
    <section
      aria-labelledby="marathon-story-title"
      className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
    >
      <div className="relative mx-auto min-h-[560px] max-w-7xl overflow-hidden rounded-[2rem] bg-neutral-950 sm:min-h-[600px] lg:min-h-[580px]">
        <Image
          src={marathonIntroduction}
          alt="해가 떠오르는 한강변 도로를 함께 달리는 러너들"
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-[66%_center] sm:object-center"
        />

        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,9,0.12)_0%,rgba(12,10,9,0.82)_78%,rgba(12,10,9,0.92)_100%)] lg:bg-[linear-gradient(90deg,rgba(12,10,9,0.88)_0%,rgba(12,10,9,0.68)_43%,rgba(12,10,9,0.08)_76%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,23,15,0.25),transparent_38%)]"
          aria-hidden="true"
        />

        <div className="relative flex min-h-[560px] flex-col justify-end p-6 sm:min-h-[600px] sm:p-10 lg:min-h-[580px] lg:justify-center lg:p-16">
          <div className="max-w-xl text-white">
            <p className="font-paperlogy text-sm tracking-wide text-red-300 uppercase">
              The road is yours
            </p>
            <h2
              id="marathon-story-title"
              className="mt-3 font-paperlogy text-4xl leading-[1.12] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              달리는 모든 순간이
              <br />
              새로운 이야기가 됩니다.
            </h2>
            <p className="mt-5 max-w-lg font-anyvid text-sm leading-7 text-white/75 sm:text-base">
              첫 5km의 설렘부터 풀코스의 벅찬 완주까지. 나에게 맞는 대회를
              발견하고, 오늘의 한 걸음을 특별한 도전으로 만들어 보세요.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3" aria-label="대회 찾기 특징">
              {highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 font-anyvid text-sm text-white/80"
                >
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/25 bg-white/10">
                    <Icon className="size-4 text-red-300" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <Link
              href="/marathon-list"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-anyvid text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              나의 다음 대회 찾기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <p className="absolute right-6 bottom-6 hidden border-l border-white/35 pl-4 font-anyvid text-xs leading-5 text-white/60 lg:block">
          START WHERE YOU ARE
          <br />
          RUN YOUR OWN RACE
        </p>
      </div>
    </section>
  );
}
