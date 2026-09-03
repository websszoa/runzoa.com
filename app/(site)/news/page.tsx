import { permanentRedirect } from "next/navigation";

type NewsPageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const type = Array.isArray(params.type) ? params.type[0] : params.type;

  if (type === "blog") permanentRedirect("/blog");
  if (type === "newsletter") permanentRedirect("/newsletter");

  permanentRedirect(`/new?type=${type === "updates" ? "updates" : "notice"}`);
}
