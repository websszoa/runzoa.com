import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageNewsDetail from "@/components/page/page-news-detail";
import { getNewsPost, getNewsSlugs, loadNewsPost } from "@/lib/news";

type NewDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs(["notice", "updates"]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post || !["notice", "updates"].includes(post.type)) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/new/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date.replaceAll(".", "-"),
    },
  };
}

export default async function NewDetailPage({ params }: NewDetailPageProps) {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post || !["notice", "updates"].includes(post.metadata.type)) {
    notFound();
  }

  const { Content, metadata } = post;

  return (
    <PageNewsDetail metadata={metadata}>
      <Content />
    </PageNewsDetail>
  );
}
