import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PostGrid from "@/components/posts/PostGrid";
import { getPostsByCategory } from "@/lib/posts";
import { Category } from "@/lib/types";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, locales } from "@/i18n/config";
import { getAlternates } from "@/lib/seo";
import Link from "next/link";

const categorySlugs = ["regulations", "race-recaps", "technical", "how-it-works"];

export function generateStaticParams() {
  return locales.flatMap((locale) => categorySlugs.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const cat = dict.categories[category];
  if (!cat) return { title: dict.categoryPage.notFound };
  return { title: cat.name, description: cat.description, alternates: getAlternates(locale, `/category/${category}`) };
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const cat = dict.categories[category];
  if (!cat) notFound();

  const posts = getPostsByCategory(category as Category, locale);

  return (
    <div className="py-12">
      <Container>
        <Link href={`/${locale}/posts`} className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-racing-red">
          &larr; {dict.categoryPage.allArticles}
        </Link>
        <div className="mt-6">
          <SectionHeading>{cat.name}</SectionHeading>
          <p className="mt-3 text-text-secondary">{cat.description}</p>
        </div>
        <div className="mt-8">
          <PostGrid posts={posts} dict={{ ...dict.posts, categories: dict.categories }} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
