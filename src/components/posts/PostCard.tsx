import Link from "next/link";
import { PostMeta } from "@/lib/types";
import CategoryBadge from "./CategoryBadge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostCard({ post, dict, locale }: { post: PostMeta; dict: any; locale: string }) {
  const date = new Date(post.publishedAt).toLocaleDateString(locale === "pt-br" ? "pt-BR" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/${locale}/posts/${post.slug}`} className="group block">
      <article className="h-full rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-racing-red/50 hover:shadow-lg hover:shadow-racing-red/5">
        <div className="flex items-center gap-3">
          <CategoryBadge category={post.category} linked={false} locale={locale} dict={dict.categories} />
          <span className="text-xs text-text-muted">{post.readingTime} {dict.minRead}</span>
        </div>

        <h3 className="mt-4 font-heading text-xl font-bold text-text-primary transition-colors group-hover:text-racing-red">
          {post.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm text-text-secondary">
          {post.excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-text-muted">
          <span>{date}</span>
          <span className="font-medium text-racing-red opacity-0 transition-opacity group-hover:opacity-100">
            {dict.readMore} &rarr;
          </span>
        </div>
      </article>
    </Link>
  );
}
