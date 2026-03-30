"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface PostInfo {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<PostInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/new"
          className="rounded-lg bg-[#e10600] px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#e10600]/80"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-[#141414]" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-12 text-center">
            <p className="text-[#a0a0a0]">No posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#141414] px-5 py-4"
              >
                <div>
                  <h3 className="font-bold text-[#f5f5f5]">{post.title}</h3>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#a0a0a0]">
                    <span className="rounded bg-[#1e1e1e] px-2 py-0.5">{post.category}</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </div>
                <a
                  href={`/en/posts/${post.slug}`}
                  target="_blank"
                  className="text-xs text-[#a0a0a0] hover:text-[#e10600]"
                >
                  View →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
