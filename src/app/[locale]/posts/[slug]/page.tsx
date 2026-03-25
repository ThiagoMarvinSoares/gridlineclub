import type { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Container from "@/components/ui/Container";
import CategoryBadge from "@/components/posts/CategoryBadge";
import { getPostEntryBySlug, getAllSlugs } from "@/lib/posts";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, locales, Locale } from "@/i18n/config";
import Link from "next/link";

const postComponents: Record<string, Record<string, React.ComponentType>> = {
  "understanding-2026-f1-regulations": {
    en: dynamic(() => import("@/content/posts/f1/regulations/understanding-2026-f1-regulations.en")),
    "pt-br": dynamic(() => import("@/content/posts/f1/regulations/understanding-2026-f1-regulations.pt-br")),
  },
  "how-f1-tire-strategy-works": {
    en: dynamic(() => import("@/content/posts/f1/how-it-works/how-f1-tire-strategy-works.en")),
    "pt-br": dynamic(() => import("@/content/posts/f1/how-it-works/how-f1-tire-strategy-works.pt-br")),
  },
  "active-aerodynamics-2026-explained": {
    en: dynamic(() => import("@/content/posts/f1/technical/active-aerodynamics-2026-explained.en")),
    "pt-br": dynamic(() => import("@/content/posts/f1/technical/active-aerodynamics-2026-explained.pt-br")),
  },
  "2026-australian-gp-recap": {
    en: dynamic(() => import("@/content/posts/f1/race-recaps/2026-australian-gp-recap.en")),
    "pt-br": dynamic(() => import("@/content/posts/f1/race-recaps/2026-australian-gp-recap.pt-br")),
  },
  "2026-chinese-gp-recap": {
    en: dynamic(() => import("@/content/posts/f1/race-recaps/2026-chinese-gp-recap.en")),
    "pt-br": dynamic(() => import("@/content/posts/f1/race-recaps/2026-chinese-gp-recap.pt-br")),
  },
};

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const post = getPostEntryBySlug(slug);
  if (!post) return { title: dict.posts.notFound };
  const meta = post.meta[locale as Locale] || post.meta.en;
  return {
    title: meta.title,
    description: meta.excerpt,
    openGraph: { title: meta.title, description: meta.excerpt, type: "article", publishedTime: post.publishedAt },
  };
}

export default async function PostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const post = getPostEntryBySlug(slug);
  if (!post) notFound();

  const components = postComponents[slug];
  if (!components) notFound();
  const PostContent = components[locale] || components.en;
  if (!PostContent) notFound();

  const meta = post.meta[locale as Locale] || post.meta.en;
  const date = new Date(post.publishedAt).toLocaleDateString(locale === "pt-br" ? "pt-BR" : "en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="py-12">
      <Container className="max-w-3xl">
        <Link href={`/${locale}/posts`} className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-racing-red">
          &larr; {dict.posts.backToArticles}
        </Link>
        <header className="mt-6 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <CategoryBadge category={post.category} locale={locale} dict={dict.categories} />
            <span className="text-sm text-text-muted">{post.readingTime} {dict.posts.minRead}</span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">{meta.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
            <span>{post.author}</span>
            <span>&middot;</span>
            <time dateTime={post.publishedAt}>{date}</time>
          </div>
        </header>
        <div className="prose-racing mt-8 text-lg"><PostContent /></div>
        <div className="mt-12 border-t border-border pt-8">
          <Link href={`/${locale}/posts`} className="inline-flex items-center gap-1 text-sm font-medium text-racing-red transition-colors hover:text-racing-orange">
            &larr; {dict.posts.backToAll}
          </Link>
        </div>
      </Container>
    </div>
  );
}
