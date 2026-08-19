import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PageLoading } from "@/components/page/page-loading";
import { cn } from "@/lib/utils";

import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SITE_URL,
  GOOGLE_ANALYTICS_ID,
} from "@/lib/constants";

import "./globals.css";

const paperlogy = localFont({
  src: [
    {
      path: "../public/fonts/paperlogy-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/paperlogy-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/paperlogy-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  preload: true,
  variable: "--font-paperlogy-local",
});

const anyvid = localFont({
  src: "../public/fonts/anyvid.woff2",
  display: "swap",
  variable: "--font-anyvid-local",
});

const nanumNeo = localFont({
  src: "../public/fonts/nanum-square-neo.woff2",
  display: "swap",
  variable: "--font-nanumNeo-local",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_SITE_URL),
  title: {
    default: `${APP_NAME} | 전국 마라톤 대회 정보`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS.split(", "),
  applicationName: APP_NAME,
  authors: [{ name: "webstoryboy", url: "https://github.com/webstoryboy" }],
  creator: "webstoryboy",
  publisher: APP_NAME,
  category: "sports",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: APP_NAME,
    title: `${APP_NAME} | 전국 마라톤 대회 정보`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/icons/icon512.png",
        width: 512,
        height: 512,
        alt: `${APP_NAME} 로고`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: `${APP_NAME} | 전국 마라톤 대회 정보`,
    description: APP_DESCRIPTION,
    images: ["/icons/icon512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/icons/icon192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1170f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full scroll-smooth",
        nanumNeo.variable,
        paperlogy.variable,
        anyvid.variable,
      )}
    >
      <body className="min-h-full font-sans">
        <noscript>
          <style>{`.page-loading{display:none}`}</style>
        </noscript>
        <PageLoading />
        {children}
      </body>
      {process.env.NODE_ENV === "production" && (
        <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} />
      )}
    </html>
  );
}
