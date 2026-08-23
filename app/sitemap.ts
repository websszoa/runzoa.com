import type { MetadataRoute } from "next";

import { APP_SITE_URL } from "@/lib/constants";
import { getMarathons } from "@/lib/marathons";
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
  { path: "/news", changeFrequency: "weekly", priority: 0.8 },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ marathons }, newsPosts] = await Promise.all([
    getMarathons(),
    Promise.all(getNewsSlugs().map((slug) => getNewsPost(slug))),
  ]);

  const staticPages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${APP_SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const marathonPages: MetadataRoute.Sitemap = marathons.map((marathon) => ({
    url: `${APP_SITE_URL}/marathon/${encodeURIComponent(marathon.slug)}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const newsPages: MetadataRoute.Sitemap = newsPosts.flatMap((post) =>
    post
      ? [
          {
            url: `${APP_SITE_URL}/news/${encodeURIComponent(post.slug)}`,
            lastModified: toDate(post.updated ?? post.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );

  return [...staticPages, ...marathonPages, ...newsPages];
}
