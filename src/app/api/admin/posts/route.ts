import { NextResponse } from "next/server";
import { getAllMdxPosts } from "@/lib/mdx";

export async function GET() {
  const posts = getAllMdxPosts("en").map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    publishedAt: p.publishedAt,
  }));

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    slug,
    titleEn,
    titlePtBr,
    excerptEn,
    excerptPtBr,
    series,
    category,
    publishedAt,
    author,
    readingTime,
    tags,
    coverImage,
    contentEn,
    contentPtBr,
  } = body;

  // Validate required fields
  if (!slug || !titleEn || !titlePtBr || !contentEn || !contentPtBr || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Build MDX frontmatter + content for both locales
  const enMdx = buildMdx({
    title: titleEn,
    excerpt: excerptEn,
    series: series || "f1",
    category,
    publishedAt: publishedAt || new Date().toISOString().split("T")[0],
    author: author || "GridLine Club Team",
    readingTime: readingTime || 5,
    tags: tags || [],
    coverImage,
    content: contentEn,
  });

  const ptBrMdx = buildMdx({
    title: titlePtBr,
    excerpt: excerptPtBr,
    series: series || "f1",
    category,
    publishedAt: publishedAt || new Date().toISOString().split("T")[0],
    author: author || "GridLine Club Team",
    readingTime: readingTime || 5,
    tags: tags || [],
    coverImage,
    content: contentPtBr,
  });

  // Determine file paths
  const categoryDir = category;
  const enPath = `src/content/posts/f1/${categoryDir}/${slug}/en.mdx`;
  const ptBrPath = `src/content/posts/f1/${categoryDir}/${slug}/pt-br.mdx`;

  // Commit to GitHub
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;

  if (!githubToken || !githubRepo) {
    return NextResponse.json(
      { error: "GitHub not configured. Set GITHUB_TOKEN and GITHUB_REPO env variables." },
      { status: 500 }
    );
  }

  try {
    await commitToGitHub(githubToken, githubRepo, [
      { path: enPath, content: enMdx },
      { path: ptBrPath, content: ptBrMdx },
    ], `feat: add article "${titleEn}"`);

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "GitHub commit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();

  const {
    slug,
    titleEn,
    titlePtBr,
    excerptEn,
    excerptPtBr,
    series,
    category,
    publishedAt,
    author,
    readingTime,
    tags,
    coverImage,
    contentEn,
    contentPtBr,
  } = body;

  if (!slug || !titleEn || !titlePtBr || !contentEn || !contentPtBr || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const enMdx = buildMdx({
    title: titleEn,
    excerpt: excerptEn,
    series: series || "f1",
    category,
    publishedAt: publishedAt || new Date().toISOString().split("T")[0],
    author: author || "GridLine Club Team",
    readingTime: readingTime || 5,
    tags: tags || [],
    coverImage,
    content: contentEn,
  });

  const ptBrMdx = buildMdx({
    title: titlePtBr,
    excerpt: excerptPtBr,
    series: series || "f1",
    category,
    publishedAt: publishedAt || new Date().toISOString().split("T")[0],
    author: author || "GridLine Club Team",
    readingTime: readingTime || 5,
    tags: tags || [],
    coverImage,
    content: contentPtBr,
  });

  const categoryDir = category;
  const enPath = `src/content/posts/f1/${categoryDir}/${slug}/en.mdx`;
  const ptBrPath = `src/content/posts/f1/${categoryDir}/${slug}/pt-br.mdx`;

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;

  if (!githubToken || !githubRepo) {
    return NextResponse.json(
      { error: "GitHub not configured. Set GITHUB_TOKEN and GITHUB_REPO env variables." },
      { status: 500 }
    );
  }

  try {
    await commitToGitHub(githubToken, githubRepo, [
      { path: enPath, content: enMdx },
      { path: ptBrPath, content: ptBrMdx },
    ], `fix: update article "${titleEn}"`);

    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "GitHub commit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function buildMdx(opts: {
  title: string;
  excerpt: string;
  series: string;
  category: string;
  publishedAt: string;
  author: string;
  readingTime: number;
  tags: string[];
  coverImage?: string;
  content: string;
}): string {
  const frontmatter = [
    "---",
    `title: "${opts.title.replace(/"/g, '\\"')}"`,
    `excerpt: "${opts.excerpt.replace(/"/g, '\\"')}"`,
    `series: ${opts.series}`,
    `category: ${opts.category}`,
    `publishedAt: "${opts.publishedAt}"`,
    `author: "${opts.author}"`,
    `readingTime: ${opts.readingTime}`,
    `tags: [${opts.tags.map((t) => `"${t}"`).join(", ")}]`,
  ];

  if (opts.coverImage) {
    frontmatter.push(`coverImage: "${opts.coverImage}"`);
  }

  frontmatter.push("---");

  return frontmatter.join("\n") + "\n\n" + opts.content.trim() + "\n";
}

async function commitToGitHub(
  token: string,
  repo: string,
  files: { path: string; content: string }[],
  message: string
) {
  const apiBase = `https://api.github.com/repos/${repo}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };

  // 1. Get the latest commit SHA from main branch
  const refRes = await fetch(`${apiBase}/git/ref/heads/main`, { headers });
  if (!refRes.ok) throw new Error("Failed to get branch ref");
  const refData = await refRes.json();
  const latestCommitSha = refData.object.sha;

  // 2. Get the tree SHA of the latest commit
  const commitRes = await fetch(`${apiBase}/git/commits/${latestCommitSha}`, { headers });
  if (!commitRes.ok) throw new Error("Failed to get latest commit");
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;

  // 3. Create blobs for each file
  const treeItems = [];
  for (const file of files) {
    const blobRes = await fetch(`${apiBase}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content: file.content, encoding: "utf-8" }),
    });
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}`);
    const blobData = await blobRes.json();

    treeItems.push({
      path: file.path,
      mode: "100644" as const,
      type: "blob" as const,
      sha: blobData.sha,
    });
  }

  // 4. Create a new tree
  const treeRes = await fetch(`${apiBase}/git/trees`, {
    method: "POST",
    headers,
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  });
  if (!treeRes.ok) throw new Error("Failed to create tree");
  const treeData = await treeRes.json();

  // 5. Create a new commit
  const newCommitRes = await fetch(`${apiBase}/git/commits`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      tree: treeData.sha,
      parents: [latestCommitSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error("Failed to create commit");
  const newCommitData = await newCommitRes.json();

  // 6. Update the branch reference
  const updateRefRes = await fetch(`${apiBase}/git/refs/heads/main`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ sha: newCommitData.sha }),
  });
  if (!updateRefRes.ok) throw new Error("Failed to update branch ref");
}
