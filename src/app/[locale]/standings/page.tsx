import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import StandingsClient from "./StandingsClient";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";
import { getAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    title: dict.standings.heading,
    description: dict.standings.metaDescription,
    alternates: getAlternates(locale, "/standings"),
  };
}

export default async function StandingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="py-12">
      <Container>
        <SectionHeading as="h1">{dict.standings.heading}</SectionHeading>
        <p className="mt-3 text-text-secondary">{dict.standings.metaDescription}</p>
        <p className="mt-2 text-sm text-text-muted">
          {dict.standings.apiCredit}{" "}
          <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="text-racing-red transition-colors hover:text-racing-orange">OpenF1</a>{" "}
          {dict.standings.apiSuffix}
        </p>
        <div className="mt-8">
          <StandingsClient dict={dict.standings} />
        </div>
      </Container>
    </div>
  );
}
