import { posts, PostEntry } from "@/content/registry";
import { Locale, defaultLocale } from "@/i18n/config";
import { Category, PostMeta, Series } from "@/lib/types";

function resolvePost(entry: PostEntry, locale: Locale = defaultLocale): PostMeta {
  const localeMeta = entry.meta[locale] ?? entry.meta[defaultLocale];
  return {
    slug: entry.slug,
    title: localeMeta.title,
    excerpt: localeMeta.excerpt,
    series: entry.series,
    category: entry.category,
    publishedAt: entry.publishedAt,
    author: entry.author,
    readingTime: entry.readingTime,
    tags: entry.tags,
  };
}

export function getAllPosts(locale?: Locale): PostMeta[] {
  return [...posts]
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .map((p) => resolvePost(p, locale));
}

export function getPostsByCategory(category: Category, locale?: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.category === category);
}

export function getPostsBySeries(series: Series, locale?: Locale): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.series === series);
}

export function getPostBySlug(slug: string, locale?: Locale): PostMeta | undefined {
  const entry = posts.find((p) => p.slug === slug);
  if (!entry) return undefined;
  return resolvePost(entry, locale);
}

export function getLatestPosts(count: number, locale?: Locale): PostMeta[] {
  return getAllPosts(locale).slice(0, count);
}

export function getPostEntryBySlug(slug: string): PostEntry | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
