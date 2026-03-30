import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Category, Series } from "@/lib/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export interface MdxPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  series: Series;
  category: Category;
  publishedAt: string;
  author: string;
  readingTime: number;
  tags: string[];
  coverImage?: string;
}

export interface MdxPost {
  meta: MdxPostMeta;
  content: string; // raw MDX/markdown content
}

/**
 * Recursively find all .mdx files in a directory.
 */
function findMdxFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Extract slug and locale from filename.
 * e.g., "2026-japanese-gp-recap.en.mdx" → { slug: "2026-japanese-gp-recap", locale: "en" }
 */
function parseFilename(filename: string): { slug: string; locale: string } | null {
  const name = path.basename(filename, ".mdx");
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) return null;

  const slug = name.substring(0, lastDot);
  const locale = name.substring(lastDot + 1);
  return { slug, locale };
}

/**
 * Get all MDX posts for a specific locale, sorted by date (newest first).
 */
export function getAllMdxPosts(locale: string): MdxPostMeta[] {
  const files = findMdxFiles(POSTS_DIR);
  const posts: MdxPostMeta[] = [];

  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed || parsed.locale !== locale) continue;

    const raw = fs.readFileSync(file, "utf-8");
    const { data } = matter(raw);

    posts.push({
      slug: parsed.slug,
      title: data.title || "",
      excerpt: data.excerpt || "",
      series: data.series || "f1",
      category: data.category || "race-recaps",
      publishedAt: data.publishedAt || "",
      author: data.author || "",
      readingTime: data.readingTime || 5,
      tags: data.tags || [],
      coverImage: data.coverImage,
    });
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single MDX post by slug and locale — returns metadata + raw content.
 */
export function getMdxPostBySlug(slug: string, locale: string): MdxPost | null {
  const files = findMdxFiles(POSTS_DIR);

  for (const file of files) {
    const parsed = parseFilename(file);
    if (!parsed || parsed.slug !== slug || parsed.locale !== locale) continue;

    const raw = fs.readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    return {
      meta: {
        slug: parsed.slug,
        title: data.title || "",
        excerpt: data.excerpt || "",
        series: data.series || "f1",
        category: data.category || "race-recaps",
        publishedAt: data.publishedAt || "",
        author: data.author || "",
        readingTime: data.readingTime || 5,
        tags: data.tags || [],
        coverImage: data.coverImage,
      },
      content,
    };
  }

  return null;
}

/**
 * Get all unique slugs (for generateStaticParams).
 */
export function getMdxPostSlugs(): string[] {
  const files = findMdxFiles(POSTS_DIR);
  const slugs = new Set<string>();

  for (const file of files) {
    const parsed = parseFilename(file);
    if (parsed) slugs.add(parsed.slug);
  }

  return Array.from(slugs);
}

/**
 * Get posts by category for a locale.
 */
export function getMdxPostsByCategory(category: Category, locale: string): MdxPostMeta[] {
  return getAllMdxPosts(locale).filter((p) => p.category === category);
}

/**
 * Get the latest N posts for a locale.
 */
export function getLatestMdxPosts(count: number, locale: string): MdxPostMeta[] {
  return getAllMdxPosts(locale).slice(0, count);
}
