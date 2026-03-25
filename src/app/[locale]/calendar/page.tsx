import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import RaceCard from "@/components/calendar/RaceCard";
import { f1Calendar2026 } from "@/data/f1-2026-calendar";
import { getNextRace } from "@/lib/dates";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.calendar.heading,
    description: dict.calendar.metaDescription,
  };
}

export default async function CalendarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const nextRace = getNextRace(f1Calendar2026);

  return (
    <div className="py-12">
      <Container>
        <div className="mb-4">
          <SectionHeading as="h1">{dict.calendar.heading}</SectionHeading>
          <p className="mt-3 text-text-secondary">
            {dict.calendar.timezoneIntro}{" "}
            <span className="font-bold text-racing-orange">{dict.calendar.timezoneET}</span>{" "}
            {dict.calendar.and}{" "}
            <span className="font-bold text-racing-yellow">{dict.calendar.timezoneBRT}</span>{" "}
            {dict.calendar.timezoneSuffix}
          </p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {f1Calendar2026.map((race) => (
            <RaceCard key={race.round} race={race} isNext={nextRace?.round === race.round} dict={dict.calendar} locale={locale} />
          ))}
        </div>
      </Container>
    </div>
  );
}
