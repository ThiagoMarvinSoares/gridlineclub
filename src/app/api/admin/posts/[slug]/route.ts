import { NextResponse } from "next/server";
import { getMdxPostBySlug } from "@/lib/mdx";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const en = getMdxPostBySlug(slug, "en");
  const ptBr = getMdxPostBySlug(slug, "pt-br");

  if (!en && !ptBr) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json({
    slug,
    titleEn: en?.meta.title || "",
    titlePtBr: ptBr?.meta.title || "",
    excerptEn: en?.meta.excerpt || "",
    excerptPtBr: ptBr?.meta.excerpt || "",
    series: en?.meta.series || "f1",
    category: en?.meta.category || "race-recaps",
    publishedAt: en?.meta.publishedAt || "",
    author: en?.meta.author || "",
    readingTime: en?.meta.readingTime || 5,
    tags: en?.meta.tags || [],
    coverImage: en?.meta.coverImage || "",
    contentEn: en?.content || "",
    contentPtBr: ptBr?.content || "",
  });
}
