import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

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

  // Sanitize filename: lowercase, replace spaces with dashes
  const originalName = file.name.replace(/\s+/g, "-").toLowerCase();
  const filePath = `public/images/${originalName}`;
  const publicUrl = `/images/${originalName}`;

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
    // Check if file already exists (get its SHA for update)
    let existingSha: string | undefined;
    const checkRes = await fetch(`${apiBase}/contents/${filePath}`, { headers });
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      existingSha = checkData.sha;
    }

    // Create or update file via GitHub Contents API (simpler for single files)
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
