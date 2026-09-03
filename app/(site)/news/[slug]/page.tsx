import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getNewsPost, getNewsSlugs } from "@/lib/news";

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
      canonical: `${
        post.type === "blog"
          ? "/blog"
          : post.type === "newsletter"
            ? "/newsletter"
            : "/new"
      }/${post.slug}`,
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
  const post = await getNewsPost(slug);

  if (!post) {
    notFound();
  }

  const basePath =
    post.type === "blog"
      ? "/blog"
      : post.type === "newsletter"
        ? "/newsletter"
        : "/new";

  permanentRedirect(`${basePath}/${post.slug}`);
}
