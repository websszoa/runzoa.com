import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Home,
  Star,
  Megaphone,
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

export function LinkBioPage() {
  return (
    <div className="min-h-screen bg-muted/30 px-4 py-6">
      <div className="mx-auto w-full max-w-110">
        <div className="rounded-[2rem] border border-border bg-background px-5 py-7 sm:px-7 sm:py-9">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              aria-label={`${APP_NAME} 홈으로`}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "rounded-full",
              )}
            >
              <Home className="size-4" />
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
            <h1 className="mt-4 text-xl">@runzoa_official</h1>
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
                className="space-y-3"
              >
                {section.label && (
                  <h2 className="pt-1 text-center text-sm text-foreground">
                    {section.label}
                  </h2>
                )}
                {section.items.map((item) => (
                  <LinkRow key={item.href} {...item} />
                ))}
              </div>
            ))}
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
      className="group relative flex items-center justify-center rounded-2xl border border-border bg-background px-4 py-4 transition-colors hover:border-brand/40 hover:bg-brand/5"
    >
      <span className="absolute left-3 flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Icon className="size-4" />
      </span>
      <span className="px-10 text-center text-sm text-foreground">{title}</span>
      <ChevronRight className="absolute right-3 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
