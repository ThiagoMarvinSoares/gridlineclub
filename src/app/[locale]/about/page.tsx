import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getDictionary } from "@/i18n/dictionaries";
import { isValidLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.about.heading, description: dict.about.metaDescription };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <div className="py-12">
      <Container className="max-w-3xl">
        <SectionHeading as="h1">{dict.about.heading}</SectionHeading>
        <div className="prose-racing mt-8 text-lg">
          <p dangerouslySetInnerHTML={{ __html: dict.about.intro }} />
          <h2>{dict.about.whatWeCover}</h2>
          <ul>
            <li dangerouslySetInnerHTML={{ __html: dict.about.coverRecaps }} />
            <li dangerouslySetInnerHTML={{ __html: dict.about.coverRegulations }} />
            <li dangerouslySetInnerHTML={{ __html: dict.about.coverTechnical }} />
            <li dangerouslySetInnerHTML={{ __html: dict.about.coverHowItWorks }} />
          </ul>
          <h2>{dict.about.raceCalendar}</h2>
          <p>{dict.about.calendarDesc}</p>
          <h2>{dict.about.ourMission}</h2>
          <p>{dict.about.missionDesc}</p>
        </div>
      </Container>
    </div>
  );
}
