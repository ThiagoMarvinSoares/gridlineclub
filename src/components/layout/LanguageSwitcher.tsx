"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function LanguageSwitcher({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) {
  const pathname = usePathname();

  function switchLocalePath(targetLocale: string) {
    // Replace /en/... or /pt-br/... with the target locale
    const segments = pathname.split("/");
    segments[1] = targetLocale;
    return segments.join("/");
  }

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      <a
        href={switchLocalePath("en")}
        className={clsx(
          "px-2 py-1 text-xs font-bold rounded",
          locale === "en"
            ? "bg-racing-red text-white"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        EN
      </a>
      <a
        href={switchLocalePath("pt-br")}
        className={clsx(
          "px-2 py-1 text-xs font-bold rounded",
          locale === "pt-br"
            ? "bg-racing-red text-white"
            : "text-text-muted hover:text-text-primary"
        )}
      >
        BR
      </a>
    </div>
  );
}
