import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  devIndicators: false,
  // 모든 User-Agent(다음 Daumoa·카카오톡 scrap·일반 Googlebot 포함)에 메타데이터를
  // 스트리밍하지 않고 <head>에 확정해 내려준다.
  // 기본값 목록에 없는 크롤러는 title·description·canonical·og를 <body>에서 받아
  // 카카오톡 공유 미리보기가 비고 다음 색인에 제목이 빠지던 문제를 막는다.
  htmlLimitedBots: /.*/,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    qualities: [65, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "runzoa.com",
        pathname: "/marathon/cover/**",
      },
    ],
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
