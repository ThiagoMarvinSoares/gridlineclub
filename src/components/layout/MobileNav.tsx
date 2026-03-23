"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function MobileNav({ dict, locale }: { dict: any; locale: string }) {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/calendar`, label: dict.nav.calendar },
    { href: `/${locale}/standings`, label: dict.nav.standings },
    { href: `/${locale}/posts`, label: dict.nav.articles },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center text-text-primary"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-3 text-lg font-medium text-text-secondary transition-colors hover:text-racing-red"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 pt-4">
              <a href="/en" className={clsx("px-3 py-1.5 text-sm font-bold rounded", locale === "en" ? "bg-racing-red text-white" : "text-text-muted hover:text-text-primary")}>EN</a>
              <a href="/pt-br" className={clsx("px-3 py-1.5 text-sm font-bold rounded", locale === "pt-br" ? "bg-racing-red text-white" : "text-text-muted hover:text-text-primary")}>BR</a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
