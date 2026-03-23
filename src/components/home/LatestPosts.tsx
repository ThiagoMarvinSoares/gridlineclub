import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import PostGrid from "@/components/posts/PostGrid";
import { getLatestPosts } from "@/lib/posts";
import { Locale } from "@/i18n/config";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LatestPosts({ dict, locale }: { dict: any; locale: string }) {
  const posts = getLatestPosts(6, locale as Locale);

  return (
    <section className="py-16">
      <Container>
        <div className="flex items-end justify-between">
          <SectionHeading>{dict.latestPosts.heading}</SectionHeading>
          <Link
            href={`/${locale}/posts`}
            className="hidden text-sm font-medium text-racing-red transition-colors hover:text-racing-orange sm:block"
          >
            {dict.latestPosts.viewAll} &rarr;
          </Link>
        </div>

        <div className="mt-8">
          <PostGrid posts={posts} dict={{ ...dict.posts, categories: dict.categories }} locale={locale} />
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href={`/${locale}/posts`}
            className="text-sm font-medium text-racing-red transition-colors hover:text-racing-orange"
          >
            {dict.latestPosts.viewAllMobile} &rarr;
          </Link>
        </div>
      </Container>
    </section>
  );
}
