import Link from "next/link";
import {
  ArrowRight,
  AlarmClock,
  BadgeCheck,
  BookOpen,
  Home,
  Megaphone,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

import { CopyLinkButton } from "@/components/link/copy-link-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { SOCIAL_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { APP_COPYRIGHT, APP_EVENTZOA_URL, APP_NAME } from "@/lib/constants";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

export type UpcomingLink = {
  title: string;
  href: string;
  badge: string;
};

type LinkSection = {
  label?: string;
  items: LinkItem[];
};

const sections: LinkSection[] = [
  {
    items: [
      {
        title: "런조아 홈",
        href: "/",
        icon: Star,
      },
      {
        title: "접수중인 대회",
        href: "/marathon-list?status=open",
        icon: Megaphone,
      },
      {
        title: "접수예정 중인 대회",
        href: "/marathon-list?status=upcoming",
        icon: BookOpen,
      },
    ],
  },
];

const runners = [
  {
    icon: "🏃🏻‍♂️",
    message: "포기하고 싶다!!",
    duration: "22s",
    delay: "-2s",
    msgDelay: "-1s",
    className: "bottom-1.5 text-xl",
  },
  {
    icon: "🏃🏽‍♀️",
    message: "달려!",
    duration: "29s",
    delay: "-11s",
    msgDelay: "-4s",
    className: "bottom-1 text-lg",
  },
  {
    icon: "🏃🏿",
    message: "조금만 더!",
    duration: "36s",
    delay: "-20s",
    msgDelay: "-7s",
    className: "bottom-2 text-[22px]",
  },
];

export function LinkBioPage({ upcoming }: { upcoming: UpcomingLink[] }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[linear-gradient(135deg,#f1170f_0%,#e9231b_48%,#ff6a3d_100%)] px-4 pt-6 pb-24 text-white">
      <div
        className="absolute -top-28 -right-20 -z-10 size-80 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 -left-24 -z-10 size-72 rounded-full bg-amber-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[36px_36px] opacity-[0.08]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-110">
        <div className="rounded-[2rem] border border-white/20 bg-white/10 px-5 py-7 backdrop-blur-sm sm:px-7 sm:py-9">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              aria-label={`${APP_NAME} 홈으로`}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "rounded-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white",
              )}
            >
              <Home className="size-4" />
            </Link>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-anyvid text-xs font-semibold tracking-wide text-white/90 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              RunZoa Link
            </p>
            <CopyLinkButton className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
          </div>

          <div className="flex flex-col items-center text-center">
            <Avatar className="size-24! ring-4 ring-white/30 sm:size-28!">
              <AvatarImage
                src="/icons/icon512.png"
                alt={`${APP_NAME} 프로필 이미지`}
              />
              <AvatarFallback>런조아</AvatarFallback>
              <AvatarBadge className="size-6! bg-amber-300 text-red-700 ring-2 ring-white">
                <BadgeCheck className="size-4!" />
              </AvatarBadge>
            </Avatar>
            <h1 className="mt-4 font-paperlogy text-2xl font-semibold tracking-tight">
              @runzoa_official
            </h1>
            <p className="mt-2 font-nanumNeo text-sm leading-5.5 break-keep text-white/75">
              &ldquo;2026 마라톤 일정&rdquo; &amp; &ldquo;접수중인 대회&rdquo;
              <br />
              지금 바로 확인하세요
            </p>
          </div>

          <div className="mt-7 space-y-6">
            {sections.map((section, index) => (
              <div
                key={section.label ?? `section-${index}`}
                className="space-y-3"
              >
                {section.label && (
                  <h2 className="pt-1 text-center text-sm text-white/90">
                    {section.label}
                  </h2>
                )}
                {section.items.map((item, itemIndex) => (
                  <LinkRow
                    key={item.href}
                    {...item}
                    featured={index === 0 && itemIndex === 0}
                  />
                ))}
              </div>
            ))}
          </div>

          {upcoming.length > 0 && (
            <div className="mt-6 space-y-3 border-t border-white/25 pt-6">
              {upcoming.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  {...(item.href.startsWith("http") && {
                    target: "_blank",
                    rel: "noreferrer",
                  })}
                  className="group relative flex items-center rounded-full border border-white/30 bg-white/10 py-2 pr-10 pl-14 font-anyvid text-white transition-colors hover:bg-white/20"
                >
                  <span className="absolute left-2.5 flex size-9 items-center justify-center rounded-full bg-amber-300 text-red-700">
                    <AlarmClock className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 text-left mt-0.5">
                    <span className="block text-xs text-amber-200 font-nanumNeo">
                      [{item.badge}]
                    </span>
                    <span className="block truncate text-sm font-nanumNeo">
                      {item.title}
                    </span>
                  </span>
                  <ArrowRight className="absolute right-4 size-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                aria-label={`${APP_NAME} ${social.label}`}
                className="flex size-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white/85 transition-colors hover:bg-white hover:text-brand"
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

          <p className="mt-8 text-center font-anyvid text-xs text-white/60">
            {APP_COPYRIGHT}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-1.5 border-t border-dashed border-white/35" />
        {runners.map((runner) => (
          <div
            key={runner.message}
            className={cn(
              "detail-title-runner absolute left-0",
              runner.className,
            )}
            style={{
              animationDuration: runner.duration,
              animationDelay: runner.delay,
            }}
          >
            <span
              className="promo-runner-message"
              style={{ animationDelay: runner.msgDelay }}
            >
              {runner.message}
            </span>
            <span className="detail-title-runner-icon block leading-none">
              {runner.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkRow({
  title,
  href,
  icon: Icon,
  external,
  featured,
}: LinkItem & { featured?: boolean }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group relative flex items-center justify-center rounded-full px-4 py-4 font-nanumNeo transition-colors",
        featured
          ? "bg-white text-brand hover:bg-white/90"
          : "border border-white/30 bg-white/10 text-white hover:bg-white/20",
      )}
    >
      <span
        className={cn(
          "absolute left-2.5 flex size-9 items-center justify-center rounded-full",
          featured ? "bg-brand text-white" : "bg-white text-brand",
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="px-10 text-center text-sm font-nanumNeo">{title}</span>
      <ArrowRight
        className={cn(
          "absolute right-4 size-4 shrink-0 transition-transform group-hover:translate-x-0.5",
          featured ? "text-brand" : "text-white/70",
        )}
      />
    </Link>
  );
}
