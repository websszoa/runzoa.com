import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageNewsDetail from "@/components/page/page-news-detail";
import { getNewsPost, getNewsSlugs, loadNewsPost } from "@/lib/news";

type NewsletterDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs(["newsletter"]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsletterDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post || post.type !== "newsletter") return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/newsletter/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date.replaceAll(".", "-"),
    },
  };
}

export default async function NewsletterDetailPage({
  params,
}: NewsletterDetailPageProps) {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post || post.metadata.type !== "newsletter") notFound();

  const { Content, metadata } = post;

  return (
    <PageNewsDetail metadata={metadata}>
      <Content />
    </PageNewsDetail>
  );
}
