"use client";

import { useState, useRef } from "react";

export default function ImageUpload({
  value,
  onChange,
  slug,
  category,
}: {
  value: string;
  onChange: (url: string) => void;
  slug?: string;
  category?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (slug) formData.append("slug", slug);
      if (category) formData.append("category", category);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        onChange(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/api/content-image/f1/category/slug/cover.png"
          className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-2.5 text-sm text-[#f5f5f5] placeholder-[#666] outline-none focus:border-[#e10600] transition-colors"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-2.5 text-sm font-bold text-[#a0a0a0] hover:border-[#e10600] hover:text-[#e10600] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-[#e10600]">{error}</p>}
      {value && (
        <div className="mt-2 rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Cover preview"
            className="h-20 w-auto rounded object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}
    </div>
  );
}
