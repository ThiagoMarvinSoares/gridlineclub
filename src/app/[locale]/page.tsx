import { notFound } from "next/navigation";
import Hero from "@/components/home/Hero";
import NextRaceWidget from "@/components/home/NextRaceWidget";
import LatestPosts from "@/components/home/LatestPosts";
import { f1Calendar2026 } from "@/data/f1-2026-calendar";
import { getNextRace } from "@/lib/dates";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const nextRace = getNextRace(f1Calendar2026);

  return (
    <>
      <Hero dict={dict.hero} locale={locale} description={dict.site.description} />
      {nextRace && <NextRaceWidget race={nextRace} dict={dict.nextRace} locale={locale} />}
      <LatestPosts dict={dict} locale={locale} />
    </>
  );
}
