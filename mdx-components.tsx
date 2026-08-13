import Link from "next/link";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";

type NewsImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

function NewsImage({ src, alt, width, height, caption }: NewsImageProps) {
  return (
    <figure className="mt-7 overflow-hidden rounded-xl border bg-muted/20">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 1024px) 100vw, 768px"
        className="h-auto w-full"
      />
      {caption && (
        <figcaption className="border-t px-4 py-3 font-anyvid text-xs leading-5 text-muted-foreground sm:px-5">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent(
      (node as React.ReactElement<{ children?: React.ReactNode }>).props
        .children,
    );
  }
  return "";
}

function toHeadingId(children: React.ReactNode) {
  return getTextContent(children)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const components = {
  NewsImage,
  h1: ({ children }) => (
    <h1 className="font-paperlogy text-3xl font-semibold tracking-tight sm:text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      id={toHeadingId(children)}
      className="mt-12 scroll-mt-36 border-b border-border pb-2 font-paperlogy text-xl tracking-tight first:mt-0 sm:text-2xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      id={toHeadingId(children)}
      className="mt-8 scroll-mt-36 font-paperlogy text-xl font-semibold"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 break-keep font-anyvid text-sm leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 space-y-1 font-anyvid text-[15px] leading-7 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-1 font-anyvid text-[15px] leading-7 text-muted-foreground marker:text-brand">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="ml-3 list-disc pl-1 marker:text-brand">{children}</li>
  ),
  strong: ({ children }) => <strong className="text-black">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-4 border-brand bg-brand/5 px-5 py-4 font-nanumNeo [&>p]:mt-0">
      {children}
    </blockquote>
  ),
  a: ({ href = "", children }) => (
    <Link
      href={href}
      className="font-medium text-brand underline underline-offset-4"
    >
      {children}
    </Link>
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
