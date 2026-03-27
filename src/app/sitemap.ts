import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { posts } from "@/content/registry";
import { categories } from "@/data/categories";
import { f1Calendar2026 } from "@/data/f1-2026-calendar";

const BASE_URL = "https://gridlineclub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/calendar", "/posts", "/standings", "/about"];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "daily" : "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Category pages
  for (const locale of locales) {
    for (const cat of categories) {
      entries.push({
        url: `${BASE_URL}/${locale}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // Article pages
  for (const locale of locales) {
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/posts/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  // Race event pages
  for (const locale of locales) {
    for (const race of f1Calendar2026) {
      entries.push({
        url: `${BASE_URL}/${locale}/race/${race.round}`,
        lastModified: new Date(race.dateStart),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
