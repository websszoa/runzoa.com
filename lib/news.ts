import { readdirSync } from "node:fs";
import path from "node:path";
import {
  Bell,
  BookOpenText,
  Mail,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

export type NewsType = "notice" | "blog" | "updates" | "newsletter";

export type NewsPostMetadata = {
  slug: string;
  type: NewsType;
  category: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  toc?: readonly {
    id: string;
    label: string;
  }[];
};

export type NewsItem = {
  type: NewsType;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const NEWS_DIRECTORY = path.join(process.cwd(), "content/news");

export const NEWS_ITEMS: readonly NewsItem[] = [
  {
    type: "notice",
    label: "공지사항",
    eyebrow: "NOTICE",
    title: "런조아의 중요한 안내",
    description:
      "서비스 운영, 이용 정책과 점검 등 러너가 알아야 할 주요 소식을 안내합니다.",
    icon: Bell,
  },
  {
    type: "blog",
    label: "블로그",
    eyebrow: "RUNNING STORIES",
    title: "러닝을 더 즐겁게 만드는 이야기",
    description:
      "대회 준비, 러닝 팁과 전국의 다채로운 레이스 이야기를 소개합니다.",
    icon: BookOpenText,
  },
  {
    type: "updates",
    label: "업데이트",
    eyebrow: "PRODUCT UPDATES",
    title: "더 편리해지는 런조아",
    description:
      "새롭게 추가된 기능과 개선된 화면, 데이터 업데이트 내용을 전합니다.",
    icon: RefreshCw,
  },
  {
    type: "newsletter",
    label: "뉴스레터",
    eyebrow: "NEWSLETTER",
    title: "놓치기 아쉬운 대회 소식",
    description:
      "주목할 만한 대회 일정과 러닝 소식을 한눈에 볼 수 있도록 전해드립니다.",
    icon: Mail,
  },
];

export function getNewsItem(type?: string) {
  return NEWS_ITEMS.find((item) => item.type === type) ?? NEWS_ITEMS[0];
}

export function getNewsSlugs() {
  return NEWS_ITEMS.flatMap((item) =>
    readdirSync(path.join(NEWS_DIRECTORY, item.type))
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => fileName.replace(/\.mdx$/, "")),
  );
}

export async function loadNewsPost(slug: string) {
  const newsType = NEWS_ITEMS.find((item) =>
    readdirSync(path.join(NEWS_DIRECTORY, item.type)).includes(`${slug}.mdx`),
  )?.type;

  if (!newsType) return undefined;

  const mdxModule = await import(`@/content/news/${newsType}/${slug}.mdx`);

  return {
    Content: mdxModule.default,
    metadata: mdxModule.metadata as NewsPostMetadata,
  };
}

export async function getNewsPost(slug: string) {
  return (await loadNewsPost(slug))?.metadata;
}

export async function getNewsPosts(type: NewsType) {
  const posts = await Promise.all(
    getNewsSlugs().map(async (slug) => getNewsPost(slug)),
  );

  return posts
    .filter((post): post is NewsPostMetadata => post?.type === type)
    .sort((a, b) => b.date.localeCompare(a.date));
}
