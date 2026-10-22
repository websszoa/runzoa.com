import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  MapPin,
  Mail,
  Megaphone,
  Newspaper,
  type LucideIcon,
} from "lucide-react";

import { CopyLinkButton } from "@/components/link/copy-link-button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  APP_COPYRIGHT,
  APP_EVENTZOA_URL,
  APP_KCALZOA_URL,
  APP_NAME,
} from "@/lib/constants";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

type LinkSection = {
  label?: string;
  items: LinkItem[];
};

const sections: LinkSection[] = [
  {
    items: [
      {
        title: "2026 마라톤 전체 일정 보기",
        href: "/marathon-list",
        icon: CalendarDays,
      },
      {
        title: "지금 접수중인 대회 모아보기",
        href: "/marathon-search",
        icon: Megaphone,
      },
      {
        title: "런조아 블로그 둘러보기",
        href: "/blog",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "뉴스레터 & 소식",
    items: [
      {
        title: "뉴스레터 구독하기",
        href: "/newsletter",
        icon: Mail,
      },
      {
        title: "최신 러닝 소식 보기",
        href: "/news",
        icon: Newspaper,
      },
    ],
  },
  {
    label: "캘린더 & 지도",
    items: [
      {
        title: "마라톤 캘린더로 보기",
        href: "/marathon-calendar",
        icon: CalendarRange,
      },
      {
        title: "지도에서 대회 찾기",
        href: "/marathon-map",
        icon: MapPin,
      },
    ],
  },
];

const familyServices = [
  {
    name: "이벤트조아",
    tagline: "전국 이벤트 모음",
    href: APP_EVENTZOA_URL,
    className: "from-brand to-[#ff7a5c]",
  },
  {
    name: "칼조아",
    tagline: "칼로리 계산 도우미",
    href: APP_KCALZOA_URL,
    className: "from-neutral-800 to-neutral-600",
  },
];

export function LinkBioPage() {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-110">
        <div className="rounded-[2rem] border border-border bg-background px-5 py-7 sm:px-7 sm:py-9">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              aria-label={`${APP_NAME} 홈으로`}
              className="flex size-9 items-center justify-center rounded-full bg-foreground"
            >
              <Image
                src="/icons/icon192.png"
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full"
              />
            </Link>
            <CopyLinkButton />
          </div>

          <div className="flex flex-col items-center text-center">
            <Avatar className="size-24! ring-4 ring-background sm:size-28!">
              <AvatarImage
                src="/icons/icon512.png"
                alt={`${APP_NAME} 프로필 이미지`}
              />
              <AvatarFallback>런조아</AvatarFallback>
              <AvatarBadge className="size-6! bg-brand text-white ring-2 ring-background">
                <BadgeCheck className="size-4!" />
              </AvatarBadge>
            </Avatar>
            <h1 className="mt-4 text-xl font-bold">@runzoa_official</h1>
            <p className="mt-2 text-sm leading-5.5 text-muted-foreground break-keep">
              &ldquo;2026 마라톤 일정&rdquo; &amp; &ldquo;접수중인 대회&rdquo;
              <br />
              지금 바로 확인하세요
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {sections.map((section, index) => (
              <div
                key={section.label ?? `section-${index}`}
                className="space-y-2.5"
              >
                {section.label && (
                  <h2 className="pt-1 text-center text-sm font-bold text-foreground">
                    {section.label}
                  </h2>
                )}
                {section.items.map((item) => (
                  <LinkRow key={item.href} {...item} />
                ))}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-center text-sm font-bold text-foreground">
              런조아 패밀리 서비스
            </h2>
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {familyServices.map((service) => (
                <a
                  key={service.name}
                  href={service.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "flex w-36 shrink-0 flex-col justify-between gap-6 rounded-2xl bg-linear-to-br p-4 text-white",
                    service.className,
                  )}
                >
                  <span className="text-[11px] font-medium text-white/70">
                    Runzoa Family
                  </span>
                  <span>
                    <span className="block text-base font-bold">
                      {service.name}
                    </span>
                    <span className="block text-xs text-white/70">
                      {service.tagline}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={`${APP_NAME} ${social.label}`}
                className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
              >
                <svg
                  aria-hidden="true"
                  className="size-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            {APP_COPYRIGHT}
          </p>
        </div>
      </div>
    </div>
  );
}

function LinkRow({ title, href, icon: Icon, external }: LinkItem) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group relative flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-3.5 transition-colors hover:border-brand/40 hover:bg-brand/5"
    >
      <span className="absolute left-3 flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-4" />
      </span>
      <span className="px-10 text-center text-sm font-semibold text-foreground">
        {title}
      </span>
      <ChevronRight className="absolute right-3 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
