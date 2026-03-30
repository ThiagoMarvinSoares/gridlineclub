"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = [
  { value: "race-recaps", label: "Race Recaps" },
  { value: "race-preview", label: "Race Preview" },
  { value: "regulations", label: "Regulations" },
  { value: "technical", label: "Technical" },
  { value: "how-it-works", label: "How It Works" },
];

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState("race-recaps");
  const [author, setAuthor] = useState("GridLine Club Team");
  const [readingTime, setReadingTime] = useState(5);
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [publishedAt, setPublishedAt] = useState("");

  const [titleEn, setTitleEn] = useState("");
  const [excerptEn, setExcerptEn] = useState("");
  const [contentEn, setContentEn] = useState("");

  const [titlePtBr, setTitlePtBr] = useState("");
  const [excerptPtBr, setExcerptPtBr] = useState("");
  const [contentPtBr, setContentPtBr] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // Load existing post data
  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setResult({ ok: false, message: data.error });
        } else {
          setCategory(data.category || "race-recaps");
          setAuthor(data.author || "GridLine Club Team");
          setReadingTime(data.readingTime || 5);
          setTags((data.tags || []).join(", "));
          setCoverImage(data.coverImage || "");
          setPublishedAt(data.publishedAt || "");
          setTitleEn(data.titleEn || "");
          setExcerptEn(data.excerptEn || "");
          setContentEn(data.contentEn || "");
          setTitlePtBr(data.titlePtBr || "");
          setExcerptPtBr(data.excerptPtBr || "");
          setContentPtBr(data.contentPtBr || "");
        }
        setLoading(false);
      })
      .catch((err) => {
        setResult({ ok: false, message: err.message });
        setLoading(false);
      });
  }, [slug]);

  async function handleSave() {
    if (!titleEn || !titlePtBr || !contentEn || !contentPtBr) {
      setResult({ ok: false, message: "Please fill in all required fields" });
      return;
    }

    setSaving(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
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
          message: `Post updated! Vercel will rebuild automatically.`,
        });
      } else {
        setResult({ ok: false, message: data.error || "Failed to save" });
      }
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666] outline-none focus:border-[#e10600] transition-colors";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-[#a0a0a0] mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e10600] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-sm text-[#a0a0a0] hover:text-[#e10600]">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <span className="rounded bg-[#1e1e1e] px-3 py-1 text-xs text-[#a0a0a0]">{slug}</span>
      </div>

      {/* Metadata */}
      <div className="mt-8 rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#e10600]">
          Post Settings
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Publish Date</label>
            <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Reading Time (min)</label>
            <input type="number" value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} className={inputClass} min={1} />
          </div>
          <div>
            <label className={labelClass}>Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Cover Image</label>
            <ImageUpload value={coverImage} onChange={setCoverImage} slug={slug} category={category} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#ff6b00]">English</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Title *</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea value={excerptEn} onChange={(e) => setExcerptEn(e.target.value)} className={inputClass + " h-20 resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Content (Markdown) *</label>
              <textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} className={inputClass + " h-[500px] resize-y font-mono text-xs leading-relaxed"} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-6">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#22c55e]">Portugues (BR)</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Titulo *</label>
              <input type="text" value={titlePtBr} onChange={(e) => setTitlePtBr(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Resumo</label>
              <textarea value={excerptPtBr} onChange={(e) => setExcerptPtBr(e.target.value)} className={inputClass + " h-20 resize-none"} />
            </div>
            <div>
              <label className={labelClass}>Conteudo (Markdown) *</label>
              <textarea value={contentPtBr} onChange={(e) => setContentPtBr(e.target.value)} className={inputClass + " h-[500px] resize-y font-mono text-xs leading-relaxed"} />
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`mt-6 rounded-xl border p-4 text-sm ${
          result.ok
            ? "border-[#22c55e]/30 bg-[#22c55e]/10 text-[#22c55e]"
            : "border-[#e10600]/30 bg-[#e10600]/10 text-[#e10600]"
        }`}>
          {result.message}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-4">
        <Link href="/admin" className="rounded-lg border border-[#2a2a2a] px-6 py-3 text-sm font-bold text-[#a0a0a0] hover:text-[#f5f5f5]">
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#e10600] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#e10600]/80 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
