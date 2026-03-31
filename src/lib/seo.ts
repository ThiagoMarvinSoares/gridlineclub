import { locales } from "@/i18n/config";

const BASE_URL = "https://gridlineclub.com";

/**
 * Generate alternates metadata (canonical + hreflang) for a page.
 * @param locale - Current locale (e.g., "en")
 * @param path - Path after locale (e.g., "/posts/my-article" or "" for home)
 */
export function getAlternates(locale: string, path: string = "") {
  const canonical = `${BASE_URL}/${locale}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const lang = loc === "pt-br" ? "pt-BR" : loc;
    languages[lang] = `${BASE_URL}/${loc}${path}`;
  }
  // x-default points to English version
  languages["x-default"] = `${BASE_URL}/en${path}`;

  return {
    canonical,
    languages,
  };
}
