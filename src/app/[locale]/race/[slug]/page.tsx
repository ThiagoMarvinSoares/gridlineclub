import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import { f1Calendar2026 } from "@/data/f1-2026-calendar";
import { getLocalizedRace } from "@/lib/race-utils";
import { formatRaceDate } from "@/lib/dates";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getAlternates } from "@/lib/seo";
import { getDictionary } from "@/i18n/dictionaries";
import RaceEventClient from "./RaceEventClient";
import Link from "next/link";

export function generateStaticParams() {
  return f1Calendar2026.map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return { title: "Race Not Found" };
  const race = f1Calendar2026.find((r) => r.slug === slug);
  if (!race) return { title: "Race Not Found" };

  const loc = getLocalizedRace(race, locale);
  const dict = await getDictionary(locale as Locale);

  // Don't index future races (no content yet)
  const hasStarted = new Date(race.sessions.fp1).getTime() < Date.now();

  return {
    title: `${loc.name} — ${dict.raceEvent.results}`,
    description: `${loc.name} ${dict.raceEvent.sessionResults} — ${loc.circuit}, ${loc.location}`,
    alternates: getAlternates(locale, `/race/${slug}`),
    ...(hasStarted ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function RaceEventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const race = f1Calendar2026.find((r) => r.slug === slug);
  if (!race) notFound();

  const dict = await getDictionary(locale);
  const loc = getLocalizedRace(race, locale);
  const raceDate = formatRaceDate(race.dateStart, locale);

  return (
    <div className="py-12">
      <Container>
        <Link
          href={`/${locale}/calendar`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-racing-red"
        >
          &larr; {dict.calendar.heading}
        </Link>

        {/* Race header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-racing-red text-lg font-bold text-white">
              R{race.round}
            </span>
            <div>
              <h1 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                {loc.name}
              </h1>
              <p className="text-text-secondary">{loc.circuit}</p>
              <p className="text-sm text-text-muted">
                {loc.location} &middot; {raceDate}
              </p>
            </div>
          </div>
        </div>

        <p className="mb-6 text-text-secondary">{dict.raceEvent.introText}</p>

        <RaceEventClient race={race} dict={dict.raceEvent} />

        <div className="mt-4 text-right text-xs text-text-muted">
          {dict.standings.apiCredit}{" "}
          <a
            href="https://openf1.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-racing-red hover:text-racing-orange"
          >
            OpenF1
          </a>{" "}
          {dict.standings.apiSuffix}
        </div>
      </Container>
    </div>
  );
}
