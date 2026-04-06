import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/ui/Container";
import CategoryBadge from "@/components/posts/CategoryBadge";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { getMdxPostBySlug } from "@/lib/mdx";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, locales, type Locale } from "@/i18n/config";
import { getAlternates } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const post = getPostBySlug(slug, locale as Locale);
  if (!post) return { title: dict.posts.notFound };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
    alternates: getAlternates(locale, `/posts/${slug}`),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  // Load MDX post
  const mdxPost = getMdxPostBySlug(slug, locale);
  if (!mdxPost) notFound();

  const { meta, content } = mdxPost;

  const date = new Date(meta.publishedAt).toLocaleDateString(
    locale === "pt-br" ? "pt-BR" : "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );

  return (
    <div className="py-12">
      <Container className="max-w-3xl">
        <Link
          href={`/${locale}/posts`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-racing-red"
        >
          &larr; {dict.posts.backToArticles}
        </Link>

        {meta.coverImage && (
          <div className="mt-6 overflow-hidden rounded-xl">
            <Image
              src={meta.coverImage}
              alt={meta.title}
              width={1200}
              height={630}
              className="h-auto max-h-[500px] w-full object-contain"
              priority
            />
          </div>
        )}

        <header className="mt-6 border-b border-border pb-8">
          <div className="flex items-center gap-3">
            <CategoryBadge
              category={meta.category}
              locale={locale}
              dict={dict.categories}
            />
            <span className="text-sm text-text-muted">
              {meta.readingTime} {dict.posts.minRead}
            </span>
          </div>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {meta.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
            <span>{meta.author}</span>
            <span>&middot;</span>
            <time dateTime={meta.publishedAt}>{date}</time>
          </div>
        </header>

        <div className="prose-racing mt-8 text-lg">
          <MDXRemote source={content} />
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <Link
            href={`/${locale}/posts`}
            className="inline-flex items-center gap-1 text-sm font-medium text-racing-red transition-colors hover:text-racing-orange"
          >
            &larr; {dict.posts.backToAll}
          </Link>
        </div>
      </Container>
    </div>
  );
}
