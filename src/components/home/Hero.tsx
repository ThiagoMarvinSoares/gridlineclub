import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Hero({ dict, locale, description }: { dict: any; locale: string; description: string }) {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 checkered-pattern" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      {/* Red glow effect */}
      <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-racing-red/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-racing-red/30 bg-racing-red/10 px-4 py-1.5 text-sm font-medium text-racing-red">
            <span className="h-2 w-2 animate-pulse rounded-full bg-racing-red" />
            {dict.badge}
          </div>

          <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-7xl">
            <span className="text-text-primary">{dict.headingLine1}</span>
            <br />
            <span className="bg-gradient-to-r from-racing-red to-racing-orange bg-clip-text text-transparent">
              {dict.headingLine2}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-text-secondary sm:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/posts`}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-gradient-to-r from-racing-red to-racing-orange px-8 text-sm font-bold uppercase tracking-wider text-white transition-all hover:shadow-lg hover:shadow-racing-red/25"
            >
              {dict.readArticles}
            </Link>
            <Link
              href={`/${locale}/calendar`}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-surface px-8 text-sm font-bold uppercase tracking-wider text-text-secondary transition-all hover:border-racing-red hover:text-racing-red"
            >
              {dict.raceCalendar}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
