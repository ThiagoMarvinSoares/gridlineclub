import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slug = formData.get("slug") as string | null;
  const category = formData.get("category") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO;

  if (!githubToken || !githubRepo) {
    return NextResponse.json(
      { error: "GitHub not configured" },
      { status: 500 }
    );
  }

  // Sanitize filename
  const originalName = file.name.replace(/\s+/g, "-").toLowerCase();

  // If slug and category provided, save inside the post folder
  // Otherwise save in public/images/ as fallback
  let filePath: string;
  let publicUrl: string;

  if (slug && category) {
    filePath = `src/content/posts/f1/${category}/${slug}/${originalName}`;
    publicUrl = `/api/content-image/f1/${category}/${slug}/${originalName}`;
  } else {
    filePath = `public/images/${originalName}`;
    publicUrl = `/images/${originalName}`;
  }

  // Read file as base64
  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");

  const apiBase = `https://api.github.com/repos/${githubRepo}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Check if file already exists
    let existingSha: string | undefined;
    const checkRes = await fetch(`${apiBase}/contents/${filePath}`, { headers });
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      existingSha = checkData.sha;
    }

    const body: Record<string, string> = {
      message: `feat: upload image ${originalName}`,
      content: base64,
    };
    if (existingSha) {
      body.sha = existingSha;
    }

    const res = await fetch(`${apiBase}/contents/${filePath}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "GitHub upload failed");
    }

    return NextResponse.json({ ok: true, url: publicUrl, filename: originalName });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
