import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Footer({ dict, locale }: { dict: any; locale: string }) {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <Link href={`/${locale}`} className="inline-block">
              <Image
                src="/images/logo.png"
                alt="GridLine Club"
                width={200}
                height={56}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm text-text-secondary">
              {dict.site.description}
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-primary">
              {dict.footer.navigate}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.nav.home}</Link></li>
              <li><Link href={`/${locale}/calendar`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.nav.calendar}</Link></li>
              <li><Link href={`/${locale}/standings`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.nav.standings}</Link></li>
              <li><Link href={`/${locale}/posts`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.nav.articles}</Link></li>
              <li><Link href={`/${locale}/about`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-primary">
              {dict.footer.categories}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href={`/${locale}/category/regulations`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.categories.regulations.name}</Link></li>
              <li><Link href={`/${locale}/category/race-recaps`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.categories["race-recaps"].name}</Link></li>
              <li><Link href={`/${locale}/category/race-preview`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.categories["race-preview"].name}</Link></li>
              <li><Link href={`/${locale}/category/technical`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.categories.technical.name}</Link></li>
              <li><Link href={`/${locale}/category/how-it-works`} className="text-text-secondary hover:text-racing-red transition-colors">{dict.categories["how-it-works"].name}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-text-muted">
          <p>&copy; {new Date().getFullYear()} {dict.site.name}. {dict.footer.copyright}</p>
          <p className="mt-1">{dict.footer.builtWith}</p>
        </div>
      </Container>
    </footer>
  );
}
