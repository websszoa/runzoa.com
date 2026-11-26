import type { NextConfig } from "next";
import createMDX from "@next/mdx";

// Next.js 기본 HTML-limited 봇 목록 + Googlebot.
// Googlebot은 기본 목록에 없어 스트리밍 응답(빈 <main> + 로딩 스피너, 본문은 hidden div)을 받기 때문에
// 본문이 완성된 HTML을 받도록 추가합니다. 이 값을 지정하면 기본 목록이 대체되므로 기본값을 함께 유지합니다.
// 기본값 출처: next/dist/shared/lib/router/utils/html-bots.js
const HTML_LIMITED_BOTS =
  /Googlebot|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|Daum|googleweblight/i;

const nextConfig: NextConfig = {
  devIndicators: false,
  htmlLimitedBots: HTML_LIMITED_BOTS,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    qualities: [65, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "websszoa.github.io",
        pathname: "/runzoa.com/public/marathon/cover/**",
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
