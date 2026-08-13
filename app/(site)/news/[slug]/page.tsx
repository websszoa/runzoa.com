import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPost, getNewsSlugs, loadNewsPost } from "@/lib/news";
import PageNewsDetail from "@/components/page/page-news-detail";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/news/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date.replaceAll(".", "-"),
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post) {
    notFound();
  }

  const { Content, metadata } = post;

  return (
    <PageNewsDetail metadata={metadata}>
      <Content />
    </PageNewsDetail>
  );
}
