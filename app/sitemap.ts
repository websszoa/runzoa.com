import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";
import { getMarathons } from "@/lib/marathons";
import type { Marathon } from "@/lib/marathons";
import { getNewsPost, getNewsSlugs } from "@/lib/news";

const PUBLIC_ROUTES = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/marathon-search", changeFrequency: "daily", priority: 0.9 },
  { path: "/marathon-list", changeFrequency: "daily", priority: 0.9 },
  { path: "/marathon-calendar", changeFrequency: "daily", priority: 0.9 },
  { path: "/calendar-add", changeFrequency: "daily", priority: 0.8 },
  { path: "/marathon-map", changeFrequency: "daily", priority: 0.8 },
  { path: "/marathon-year", changeFrequency: "monthly", priority: 0.7 },
  { path: "/geocoder", changeFrequency: "monthly", priority: 0.5 },
  { path: "/new", changeFrequency: "weekly", priority: 0.8 },
  { path: "/newsletter", changeFrequency: "weekly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/analytics", changeFrequency: "monthly", priority: 0.5 },
  { path: "/support", changeFrequency: "monthly", priority: 0.5 },
  { path: "/policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

function toDate(date: string) {
  return new Date(date.replaceAll(".", "-") + "T00:00:00+09:00");
}

function toKoreanDateString(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(date);
}

// 데이터에 갱신일 필드가 없으므로, 그 페이지 내용이 사실상 마지막으로 바뀌는 시점을
// lastModified로 사용한다.
//  - 이미 끝난 대회: 대회 종료일(그 뒤로 내용이 바뀌지 않음)
//  - 다가오는 대회: 접수 마감일(그 전까지 접수 상태·참가비가 갱신됨), 없으면 대회 개최일
// 미래 날짜가 lastmod로 나가지 않도록 오늘 날짜를 상한으로 둔다.
// (모든 URL에 new Date()를 넣는 방식은 구글이 lastmod를 무시하므로 쓰지 않는다.)
function getMarathonLastModified(marathon: Marathon, today: string) {
  const eventDate = marathon.event.endDate ?? marathon.event.startDate;
  const latest = [eventDate, marathon.registration.endDate]
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  return toDate(latest && latest > today ? today : (latest ?? eventDate));
}

function isPastMarathon(marathon: Marathon, today: string) {
  return (marathon.event.endDate ?? marathon.event.startDate) < today;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ marathons }, newsPosts] = await Promise.all([
    getMarathons(),
    Promise.all(getNewsSlugs().map((slug) => getNewsPost(slug))),
  ]);

  const today = toKoreanDateString(new Date());

  const staticPages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${APP_SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 개최 예정 대회를 앞에, 이미 끝난 대회를 뒤에 둔다(크롤 우선순위).
  const sortedMarathons = [...marathons].sort((a, b) => {
    const pastA = isPastMarathon(a, today);
    const pastB = isPastMarathon(b, today);

    if (pastA !== pastB) return pastA ? 1 : -1;

    return a.event.startDate.localeCompare(b.event.startDate);
  });

  const marathonPages: MetadataRoute.Sitemap = sortedMarathons.map(
    (marathon) => {
      const past = isPastMarathon(marathon, today);

      return {
        url: `${APP_SITE_URL}/marathon/${encodeURIComponent(marathon.slug)}`,
        lastModified: getMarathonLastModified(marathon, today),
        changeFrequency: past ? "yearly" : "weekly",
        priority: past ? 0.3 : 0.8,
      };
    },
  );

  const newsPages: MetadataRoute.Sitemap = newsPosts.flatMap((post) =>
    post
      ? [
          {
            url: `${APP_SITE_URL}${
              post.type === "blog"
                ? "/blog"
                : post.type === "newsletter"
                  ? "/newsletter"
                  : "/new"
            }/${encodeURIComponent(post.slug)}`,
            lastModified: toDate(post.updated ?? post.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );

  return [...staticPages, ...marathonPages, ...newsPages];
}
