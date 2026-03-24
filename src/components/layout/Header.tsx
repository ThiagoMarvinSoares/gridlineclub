import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import MobileNav from "./MobileNav";
import clsx from "clsx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Header({ dict, locale }: { dict: any; locale: string }) {
  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/calendar`, label: dict.nav.calendar },
    { href: `/${locale}/standings`, label: dict.nav.standings },
    { href: `/${locale}/posts`, label: dict.nav.articles },
    { href: `/${locale}/about`, label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="GridLine Club"
              width={200}
              height={60}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium uppercase tracking-wider text-text-secondary transition-colors hover:text-racing-red"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-1 ml-6 border-l border-border pl-6">
              <a href="/en" className={clsx("px-2 py-1 text-xs font-bold rounded", locale === "en" ? "bg-racing-red text-white" : "text-text-muted hover:text-text-primary")}>EN</a>
              <a href="/pt-br" className={clsx("px-2 py-1 text-xs font-bold rounded", locale === "pt-br" ? "bg-racing-red text-white" : "text-text-muted hover:text-text-primary")}>BR</a>
            </div>
          </nav>

          <MobileNav dict={dict} locale={locale} />
        </div>
      </Container>
      <div className="h-[2px] bg-gradient-to-r from-racing-red via-racing-orange to-racing-red" />
    </header>
  );
}
