import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { headers } from "next/headers";
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { getUserAgentClasses } from "@/lib/utils";
import {
  APP_DESCRIPTION,
  APP_KEYWORDS,
  APP_NAME,
  APP_SITE_URL,
  APP_SLOGAN,
} from "@/lib/constants";

const nanumSquare = localFont({
  variable: "--font-nanumNeo",
  display: "swap",
  src: [
    {
      path: "../public/fonts/NanumSquareNeo-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

const paperlogy = localFont({
  variable: "--font-paperlogy",
  display: "swap",
  src: [
    {
      path: "../public/fonts/Paperlogy-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/Paperlogy-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

const nanumHuman = localFont({
  variable: "--font-nanumHuman",
  display: "swap",
  src: [
    {
      path: "../public/fonts/NanumHuman-ExtraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumHuman-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumHuman-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumHuman-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumHuman-ExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumHuman-Heavy.woff",
      weight: "900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} | ${APP_SLOGAN}`,
  },
  description: APP_DESCRIPTION,
  keywords: APP_KEYWORDS,
  metadataBase: new URL(APP_SITE_URL),
  alternates: { canonical: APP_SITE_URL },
  icons: {
    icon: [
      { url: "/icon96.png", sizes: "16x16", type: "image/png" },
      { url: "/icon96.png", sizes: "32x32", type: "image/png" },
      { url: "/icon96.png", sizes: "48x48", type: "image/png" },
      { url: "/icon96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: APP_SITE_URL,
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [
      {
        url: `${APP_SITE_URL}/runzoa.png`,
        width: 1200,
        height: 630,
        alt: `${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@runzoa",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: [`${APP_SITE_URL}/runzoa.png`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const uaClasses = getUserAgentClasses(userAgent);

  return (
    <html lang="ko" className={uaClasses}>
      <body
        className={`${nanumSquare.variable} ${paperlogy.variable} ${nanumHuman.variable}`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
