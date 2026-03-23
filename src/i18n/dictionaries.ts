import type { Locale } from "./config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, () => Promise<any>> = {
  en: () => import("./en.json").then((m) => m.default),
  "pt-br": () => import("./pt-br.json").then((m) => m.default),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDictionary(locale: Locale): Promise<any> {
  return dictionaries[locale]();
}
