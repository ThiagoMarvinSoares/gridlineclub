"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated via cookie
    const authed = document.cookie.includes("admin_auth=true");
    setAuthenticated(authed);
    setChecking(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Validate against API
    fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => {
        if (res.ok) {
          document.cookie = "admin_auth=true; path=/; max-age=86400"; // 24h
          setAuthenticated(true);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#e10600] border-t-transparent" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="rounded-xl border border-[#2a2a2a] bg-[#141414] p-8">
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/logo.png"
                alt="GridLine Club"
                width={200}
                height={56}
                className="w-auto"
                style={{ width: "auto", height: "3.5rem" }}
              />
            </div>
            <h1 className="mb-6 text-center text-lg font-bold text-[#f5f5f5]">
              Admin Access
            </h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#1e1e1e] px-4 py-3 text-[#f5f5f5] placeholder-[#666] outline-none focus:border-[#e10600]"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-[#e10600]">Invalid password</p>
            )}
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-[#e10600] py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-[#e10600]/80"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]">
      <header className="border-b border-[#2a2a2a] bg-[#141414]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt="GridLine Club"
              width={140}
              height={40}
              className="w-auto"
              style={{ width: "auto", height: "2.5rem" }}
            />
            <span className="rounded bg-[#e10600] px-2 py-0.5 text-xs font-bold uppercase">
              Admin
            </span>
          </div>
          <a href="/en" className="text-xs text-[#a0a0a0] hover:text-[#e10600]">
            View Site →
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
