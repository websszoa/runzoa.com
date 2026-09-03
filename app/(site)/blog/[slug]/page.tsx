import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageNewsDetail from "@/components/page/page-news-detail";
import { getNewsPost, getNewsSlugs, loadNewsPost } from "@/lib/news";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs(["blog"]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post || post.type !== "blog") return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date.replaceAll(".", "-"),
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post || post.metadata.type !== "blog") notFound();

  const { Content, metadata } = post;

  return (
    <PageNewsDetail metadata={metadata}>
      <Content />
    </PageNewsDetail>
  );
}
