import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale, locales } from "@/i18n/config";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: {
      default: `${dict.site.name} - ${dict.site.tagline}`,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.site.description,
    keywords: locale === "pt-br"
      ? ["formula 1", "f1", "automobilismo", "corridas", "calendario f1", "classificação f1", "regulamentos f1", "gridline club"]
      : ["formula 1", "f1", "motorsport", "racing", "f1 calendar", "f1 standings", "f1 regulations", "gridline club"],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
