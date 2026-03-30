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
  content: string;
}

/**
 * Find all post directories — each post is a folder containing en.mdx and pt-br.mdx.
 * Structure: src/content/posts/f1/{category}/{slug}/en.mdx
 */
function findPostDirs(dir: string): { slug: string; dirPath: string }[] {
  const results: { slug: string; dirPath: string }[] = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Check if this directory contains en.mdx (it's a post folder)
      const enFile = path.join(fullPath, "en.mdx");
      if (fs.existsSync(enFile)) {
        results.push({ slug: entry.name, dirPath: fullPath });
      } else {
        // Recurse into subdirectories (category folders)
        results.push(...findPostDirs(fullPath));
      }
    }
  }
  return results;
}

/**
 * Read and parse a single MDX file.
 */
function parseMdxFile(filePath: string, slug: string): MdxPost | null {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
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

/**
 * Get all MDX posts for a specific locale, sorted by date (newest first).
 */
export function getAllMdxPosts(locale: string): MdxPostMeta[] {
  const postDirs = findPostDirs(POSTS_DIR);
  const posts: MdxPostMeta[] = [];

  for (const { slug, dirPath } of postDirs) {
    const filePath = path.join(dirPath, `${locale}.mdx`);
    const post = parseMdxFile(filePath, slug);
    if (post) {
      posts.push(post.meta);
    }
  }

  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single MDX post by slug and locale — returns metadata + raw content.
 */
export function getMdxPostBySlug(slug: string, locale: string): MdxPost | null {
  const postDirs = findPostDirs(POSTS_DIR);
  const dir = postDirs.find((d) => d.slug === slug);
  if (!dir) return null;

  const filePath = path.join(dir.dirPath, `${locale}.mdx`);
  return parseMdxFile(filePath, slug);
}

/**
 * Get all unique slugs (for generateStaticParams).
 */
export function getMdxPostSlugs(): string[] {
  return findPostDirs(POSTS_DIR).map((d) => d.slug);
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

/**
 * Get the directory path for a post slug (for serving images).
 */
export function getPostDirPath(slug: string): string | null {
  const postDirs = findPostDirs(POSTS_DIR);
  const dir = postDirs.find((d) => d.slug === slug);
  return dir ? dir.dirPath : null;
}
