import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PostGrid from "@/components/posts/PostGrid";
import { getAllPosts } from "@/lib/posts";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.posts.heading, description: dict.posts.metaDescription };
}

export default async function PostsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const posts = getAllPosts(locale);

  return (
    <div className="py-12">
      <Container>
        <SectionHeading>{dict.posts.heading}</SectionHeading>
        <div className="mt-8">
          <PostGrid posts={posts} dict={{ ...dict.posts, categories: dict.categories }} locale={locale} />
        </div>
      </Container>
    </div>
  );
}
