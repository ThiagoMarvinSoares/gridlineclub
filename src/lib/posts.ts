import { Category, PostMeta, Series } from "@/lib/types";
import { Locale, defaultLocale } from "@/i18n/config";
import { getAllMdxPosts, getMdxPostSlugs, getMdxPostsByCategory, getMdxPostBySlug, MdxPostMeta } from "@/lib/mdx";

function mdxToPostMeta(m: MdxPostMeta): PostMeta {
  return {
    slug: m.slug,
    title: m.title,
    excerpt: m.excerpt,
    series: m.series,
    category: m.category,
    publishedAt: m.publishedAt,
    author: m.author,
    readingTime: m.readingTime,
    tags: m.tags,
    coverImage: m.coverImage,
  };
}

export function getAllPosts(locale?: Locale): PostMeta[] {
  return getAllMdxPosts(locale || defaultLocale).map(mdxToPostMeta);
}

export function getPostsByCategory(category: Category, locale?: Locale): PostMeta[] {
  return getMdxPostsByCategory(category, locale || defaultLocale).map(mdxToPostMeta);
}

export function getPostsBySeries(series: Series, locale?: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.series === series);
}

export function getPostBySlug(slug: string, locale?: Locale): PostMeta | undefined {
  const post = getMdxPostBySlug(slug, locale || defaultLocale);
  if (!post) return undefined;
  return mdxToPostMeta(post.meta);
}

export function getLatestPosts(count: number, locale?: Locale): PostMeta[] {
  return getAllPosts(locale).slice(0, count);
}

export function getAllSlugs(): string[] {
  return getMdxPostSlugs();
}
