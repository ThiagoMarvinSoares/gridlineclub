import { PostMeta } from "@/lib/types";
import PostCard from "./PostCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PostGrid({ posts, dict, locale }: { posts: PostMeta[]; dict: any; locale: string }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-12 text-center">
        <p className="text-text-secondary">{dict.noArticles}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} dict={dict} locale={locale} />
      ))}
    </div>
  );
}
