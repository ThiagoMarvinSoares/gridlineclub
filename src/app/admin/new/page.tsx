"use client";

import { useState } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = [
  { value: "race-recaps", label: "Race Recaps" },
  { value: "race-preview", label: "Race Preview" },
  { value: "regulations", label: "Regulations" },
  { value: "technical", label: "Technical" },
  { value: "how-it-works", label: "How It Works" },
];

export default function NewPostPage() {
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("race-recaps");
  const [author, setAuthor] = useState("GridLine Club Team");
  const [readingTime, setReadingTime] = useState(5);
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publishedAt, setPublishedAt] = useState(
    new Date().toISOString().split("T")[0]
  );

  // EN fields
  const [titleEn, setTitleEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  // PT-BR fields
  const [titlePtBr, setTitlePtBr] = useState("");
  const [excerptPtBr, setExcerptPtBr] = useState("");
  const [contentPtBr, setContentPtBr] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Auto-generate slug from English title
  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function handlePublish() {
    if (!titleEn || !titlePtBr || !contentEn || !contentPtBr) {
      setResult({ ok: false, message: "Please fill in all required fields (title + content for both languages)" });
      return;
    }

    const finalSlug = slug || generateSlug(titleEn);

    setPublishing(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: finalSlug,
          titleEn,
          titlePtBr,
          excerptEn,
          excerptPtBr,
          series: "f1",
          category,
          publishedAt,
          author,
          readingTime,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          coverImage: coverImage || undefined,
          contentEn,
          contentPtBr,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          ok: true,
          message: `Post "${titleEn}" published! Vercel will rebuild automatically. Slug: ${finalSlug}`,
        });
      } else {
        setResult({ ok: false, message: data.error || "Failed to publish" });
      }
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setPublishing(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666] outline-none focus:border-[#e10600] transition-colors";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-1.5";

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-[#a0a0a0] hover:text-[#e10600]"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">New Post</h1>
      </div>

      {/* Metadata section */}
      <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#e10600]">
          Post Settings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Publish Date</label>
            <input
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Reading Time (min)</label>
            <input
              type="number"
              value={readingTime}
              onChange={(e) => setReadingTime(Number(e.target.value))}
              className={inputClass}
              min={1}
            />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="race-recap, japanese-gp, 2026"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cover Image</label>
            <ImageUpload value={coverImage} onChange={setCoverImage} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Slug (auto-generated from title if empty)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={titleEn ? generateSlug(titleEn) : "auto-generated-from-title"}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Content section — side by side */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* English */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff6b00]">
            English
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Japanese GP 2026: Full Race Breakdown"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={excerptEn}
                onChange={(e) => setExcerptEn(e.target.value)}
                placeholder="Brief summary for cards and SEO..."
                className={inputClass + " h-20 resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Content (Markdown) *</label>
              <textarea
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                placeholder={"The 2026 season arrived at Suzuka...\n\n## Race Highlights\n\n- Antonelli led from lights to flag\n- Ferrari challenged early but fell back"}
                className={inputClass + " h-[500px] resize-y font-mono text-xs leading-relaxed"}
              />
            </div>
          </div>
        </div>

        {/* Portuguese */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#22c55e]">
            Portugues (BR)
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Titulo *</label>
              <input
                type="text"
                value={titlePtBr}
                onChange={(e) => setTitlePtBr(e.target.value)}
                placeholder="GP do Japao 2026: Resumo Completo"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Resumo</label>
              <textarea
                value={excerptPtBr}
                onChange={(e) => setExcerptPtBr(e.target.value)}
                placeholder="Resumo breve para cards e SEO..."
                className={inputClass + " h-20 resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Conteudo (Markdown) *</label>
              <textarea
                value={contentPtBr}
                onChange={(e) => setContentPtBr(e.target.value)}
                placeholder={"A temporada 2026 chegou a Suzuka...\n\n## Destaques da Corrida\n\n- Antonelli liderou do inicio ao fim\n- Ferrari desafiou no inicio mas recuou"}
                className={inputClass + " h-[500px] resize-y font-mono text-xs leading-relaxed"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result message */}
      {result && (
        <div
          className={`mt-6 rounded-xl border p-4 text-sm ${
            result.ok
              ? "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]"
              : "border-[#e10600]/30 bg-[#e10600]/10 text-[#e10600]"
          }`}
        >
          {result.message}
        </div>
      )}

      {/* Publish button */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/admin"
          className="rounded-lg border border-[#2a2a2a] px-6 py-3 text-sm font-bold text-[#a0a0a0] hover:text-[#f5f5f5]"
        >
          Cancel
        </Link>
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="rounded-lg bg-[#e10600] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#e10600]/80 disabled:opacity-50"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
