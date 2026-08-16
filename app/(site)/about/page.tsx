import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Bookmark,
  CalendarDays,
  Check,
  ClipboardList,
  Code2,
  ExternalLink,
  Globe,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Type,
  Users,
  type LucideIcon,
} from "lucide-react";

import marathonIntroduction from "@/public/images/marathon-introduction.png";

export const metadata: Metadata = {
  title: "런조아 소개",
  description:
    "마라톤을 찾는 순간부터 완주하는 날까지, 러너의 모든 여정을 함께하는 런조아를 소개합니다.",
  alternates: {
    canonical: "/about",
  },
};

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  description: string;
  soon?: boolean;
};

const features: FeatureItem[] = [
  {
    icon: MapPin,
    title: "마라톤 대회 정보",
    description:
      "전국 마라톤·하프·5K 대회 일정과 접수 정보를 한눈에 확인하세요.",
  },
  {
    icon: Globe,
    title: "해외 러닝 이벤트",
    description:
      "도쿄, 보스턴, 베를린 등 주요 해외 마라톤 대회 정보도 함께 제공합니다.",
  },
  {
    icon: SlidersHorizontal,
    title: "검색 & 필터",
    description: "지역·기간·거리별로 원하는 대회를 빠르게 찾을 수 있습니다.",
  },
  {
    icon: Bookmark,
    title: "즐겨찾기",
    description:
      "관심 대회를 저장해 두고 접수 일정을 놓치지 않도록 관리하세요.",
  },
  {
    icon: Bell,
    title: "접수 알림",
    description:
      "대회 접수 시작·마감 알림을 받아 중요한 일정을 챙길 수 있습니다.",
  },
  {
    icon: Trophy,
    title: "참가 이력 관리",
    description: "지금까지 참가한 대회를 기록하고 나의 러닝 여정을 돌아보세요.",
    soon: true,
  },
  {
    icon: ClipboardList,
    title: "러닝 기록 등록",
    description:
      "완주 기록과 페이스, 사진을 등록해 나만의 러닝 일지를 작성합니다.",
    soon: true,
  },
  {
    icon: Users,
    title: "커뮤니티",
    description:
      "러너들과 대회 후기, 훈련 팁, 코스 정보를 자유롭게 나눠보세요.",
    soon: true,
  },
];

const changelog = [
  {
    version: "v2.0.0",
    date: "2026.08",
    label: "Latest",
    items: [
      "런조아 서비스 전면 리뉴얼",
      "대회 검색·캘린더·지도 이용 흐름 개선",
      "모바일 메뉴와 회원 기능 개선",
      "소식·고객지원·정책 페이지 개편",
    ],
  },
  {
    version: "v1.0.0",
    date: "2026.04",
    label: "Release",
    items: [
      "서비스 초기 런칭",
      "전국 마라톤 대회 정보 제공",
      "즐겨찾기 기능",
      "회원가입 / 로그인",
    ],
  },
  {
    version: "v0.9.0",
    date: "2026.03",
    label: "Beta",
    items: [
      "베타 서비스 오픈",
      "해외 러닝 이벤트 추가",
      "검색 & 필터 기능",
      "반응형 UI 개선",
    ],
  },
  {
    version: "v0.5.0",
    date: "2026.01",
    label: "Alpha",
    items: [
      "알파 버전 내부 테스트",
      "기본 UI 설계",
      "데이터 구조 설계",
      "프로젝트 초기 세팅",
    ],
  },
];

const madeByWebstoryboy = [
  {
    name: "Runzoa",
    domain: "runzoa.com",
    href: "https://runzoa.com",
    icon: MapPin,
    image: "/icons/icon512.png",
    category: "Running",
    description:
      "전국 마라톤 일정과 접수 정보, 캘린더와 지도를 한곳에서 확인하는 러닝 대회 플랫폼입니다.",
  },
  {
    name: "Eventzoa",
    domain: "eventzoa.com",
    href: "https://eventzoa.com",
    icon: CalendarDays,
    category: "Events",
    description:
      "다양한 분야의 행사와 이벤트 일정을 발견하고 필요한 정보를 편리하게 확인하는 서비스입니다.",
  },
  {
    name: "Apizoa",
    domain: "apizoa.com",
    href: "https://apizoa.com",
    icon: Code2,
    image: "/icons/apizoa.png",
    category: "Developer",
    description:
      "웹 서비스에서 활용할 수 있는 API와 데이터를 일관된 방식으로 제공하는 개발자 플랫폼입니다.",
  },
  {
    name: "Fontzoa",
    domain: "fontzoa.com",
    href: "https://fontzoa.com",
    icon: Type,
    category: "Typography",
    description:
      "다양한 서체를 탐색하고 비교하며 프로젝트에 어울리는 폰트를 발견할 수 있도록 돕는 서비스입니다.",
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-clip bg-background break-keep">
      <section className="relative min-h-[620px] overflow-hidden bg-neutral-950 sm:min-h-[680px]">
        <Image
          src={marathonIntroduction}
          alt="해가 떠오르는 한강변을 함께 달리는 러너들"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.1)_0%,rgba(10,10,10,0.88)_88%)] lg:bg-[linear-gradient(90deg,rgba(10,10,10,0.9)_0%,rgba(10,10,10,0.62)_47%,rgba(10,10,10,0.08)_82%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(241,23,15,0.24),transparent_38%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-end px-4 py-12 sm:min-h-[680px] sm:px-6 sm:py-16 lg:items-center lg:px-8">
          <div className="max-w-2xl text-white">
            <p className="inline-flex items-center gap-2 font-paperlogy text-sm tracking-[0.16em] text-red-300 uppercase">
              <Sparkles className="size-4" aria-hidden="true" />
              About Runzoa
            </p>
            <h1 className="mt-5 font-paperlogy text-4xl leading-[1.2] sm:leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl lg:text-6xl">
              좋은 대회를 만나는 순간,
              <br />
              달리기는 더 즐거워집니다.
            </h1>
            <p className="mt-6 max-w-xl font-anyvid text-sm leading-6 text-white/75 sm:text-[15px]">
              런조아는 러너가 자신에게 맞는 대회를 쉽게 발견하고, 설레는
              마음으로 출발선에 설 수 있도록 마라톤 정보를 정리합니다.
            </p>
            <Link
              href="/marathon-search"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-6 font-anyvid text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              나에게 맞는 대회 찾기
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden lg:block">
          <p className="mx-auto max-w-7xl px-8 text-right font-anyvid text-xs tracking-[0.22em] text-white/55 uppercase">
            Find · Run · Remember
          </p>
        </div>
      </section>

      <section aria-labelledby="service-definition-title">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.65fr_1.35fr] lg:items-start lg:gap-20 lg:px-8 lg:py-36">
          <div className="lg:sticky lg:top-28">
            <p className="font-paperlogy text-xl tracking-wide text-brand uppercase">
              What is Runzoa
            </p>
            <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground">
              마라톤을 찾는 시간은 줄이고,
              <br />
              달리는 즐거움은 더합니다.
            </p>
          </div>
          <div>
            <h2
              id="service-definition-title"
              className="font-paperlogy text-3xl leading-[1.22] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              런조아는 전국의 마라톤 정보를 모아
              <span className="text-brand">
                {" "}
                다음 출발선을 발견하도록 돕는 서비스
              </span>
              입니다.
            </h2>
            <p className="mt-7 max-w-3xl font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">
              지역, 개최일, 종목과 접수 상태를 기준으로 원하는 대회를 검색하고,
              전체 대회 목록에서 일정과 핵심 정보를 빠르게 비교할 수 있습니다.
              월별 캘린더에서는 날짜별 개최 일정을 한눈에 살펴보고, 지도에서는
              현재 위치를 기준으로 가까운 대회와 실제 개최 장소를 확인할 수
              있습니다.
            </p>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
              {features.map(({ icon: Icon, title, description, soon }) => (
                <li key={title} className="relative bg-background p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon className="size-4.5" aria-hidden="true" />
                    </span>
                    {soon && (
                      <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-anyvid text-[11px] font-semibold text-brand">
                        준비 중
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-paperlogy text-lg font-semibold">
                    {title}
                  </h3>
                  <p className="mt-2 font-anyvid text-sm leading-6 text-muted-foreground">
                    {description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 border-t px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.65fr_1.35fr] lg:items-start lg:gap-20 lg:px-8 lg:py-36">
          <div className="lg:sticky lg:top-28">
            <p className="font-paperlogy text-xl tracking-wide text-brand uppercase">
              Changelog
            </p>
            <p className="mt-4 max-w-xs font-anyvid text-sm leading-6 text-muted-foreground">
              더 편리한 러닝 경험을 위해 런조아가 달려온 과정을 기록합니다.
            </p>
          </div>

          <div>
            <h2
              id="changelog-title"
              className="font-paperlogy text-3xl leading-[1.22] font-semibold tracking-tight text-balance sm:text-5xl"
            >
              한 걸음씩,
              <br />
              <span className="text-brand">더 나은 런조아</span>를 만들고
              있습니다.
            </h2>

            <ol className="mt-10 overflow-hidden rounded-2xl border bg-background">
              {changelog.map((release, index) => (
                <li
                  key={release.version}
                  className={`grid gap-6 p-5 sm:grid-cols-[130px_1fr] sm:p-7 ${
                    index > 0 ? "border-t" : ""
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="font-paperlogy text-lg font-semibold text-brand">
                        {release.version}
                      </strong>
                      <span className="rounded-full border border-brand/20 bg-brand/5 px-2.5 py-1 font-anyvid text-[11px] font-semibold text-brand">
                        {release.label}
                      </span>
                    </div>
                    <time className="mt-2 block font-anyvid text-xs text-muted-foreground">
                      {release.date}
                    </time>
                  </div>

                  <ul className="grid gap-3 sm:grid-cols-2">
                    {release.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 font-anyvid text-sm leading-6 text-muted-foreground"
                      >
                        <span className="mt-1 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <Check className="size-2.5" aria-hidden="true" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-10 border-t px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[0.65fr_1.35fr] lg:items-start lg:gap-20 lg:px-8 lg:py-36">
          <div className="lg:sticky lg:top-28">
            <p className="font-paperlogy text-xl tracking-wide text-brand uppercase">
              Made by Webstoryboy
            </p>
            <p className="mt-4 max-w-xs font-anyvid text-sm leading-6 text-muted-foreground">
              일상의 불편을 발견하고 더 나은 경험으로 바꾸는 서비스를 만들고
              있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-paperlogy text-3xl leading-[1.22] font-semibold tracking-tight text-balance sm:text-5xl">
              작지만 유용한 서비스들을
              <br />
              <span className="text-brand">꾸준히 만들어갑니다.</span>
            </h2>

            <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
              {madeByWebstoryboy.map(
                ({
                  name,
                  domain,
                  href,
                  icon: Icon,
                  image,
                  category,
                  description,
                }) => (
                  <li key={name} className="bg-background">
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col p-5 transition-colors hover:bg-brand/[0.025] sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand/10 text-brand">
                          {image ? (
                            <Image
                              src={image}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <Icon className="size-4.5" aria-hidden="true" />
                          )}
                        </span>
                        <ExternalLink
                          className="size-4 text-muted-foreground transition-colors group-hover:text-brand"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="mt-auto pt-6">
                        <h3 className="mt-2 font-paperlogy uppercase text-2xl font-black text-brand">
                          {name}
                        </h3>
                        <p className="mt-1 font-nanum text-xs text-muted-foreground">
                          {domain}
                        </p>
                        <p className="mt-4 font-anyvid text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      </div>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
