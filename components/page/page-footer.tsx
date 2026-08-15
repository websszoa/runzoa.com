import Link from "next/link";
import { FOOTER_NAVIGATION, SOCIAL_LINKS } from "@/lib/navigation";

import {
  APP_COPYRIGHT,
  APP_DESCRIPTION,
  APP_ENG_NAME,
  APP_NAME,
  APP_SLOGAN,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-muted/20 border-t">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_2.1fr] lg:gap-16">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label={`${APP_NAME} 홈`}
              className="font-paperlogy text-2xl leading-none font-black uppercase text-brand"
            >
              {APP_ENG_NAME}
            </Link>
            <p className="mt-5 text-sm leading-5.5 font-anyvid text-muted-foreground break-keep">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  aria-label={`${APP_NAME} ${social.label}`}
                  className="flex size-11 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-brand"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-5 xl:gap-x-10">
            {FOOTER_NAVIGATION.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-paperlogy text-[15px] font-semibold">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-2">
                  {group.links.map((link) => {
                    const isExternal = link.href.startsWith("http");

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                          className="inline-flex items-center font-anyvid text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 sm:gap-3 border-t pt-6 text-center font-anyvid text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left">
          <p>{APP_COPYRIGHT}</p>
          <p>{APP_SLOGAN}</p>
        </div>
      </div>
    </footer>
  );
}
