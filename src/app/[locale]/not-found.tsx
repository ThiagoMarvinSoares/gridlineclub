import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Container className="text-center">
        <h1 className="font-heading text-6xl font-bold text-racing-red">404</h1>
        <p className="mt-4 text-xl text-text-secondary">Page not found</p>
        <p className="mt-2 text-text-muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-racing-red px-8 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-racing-red/80">
          Back to Home
        </Link>
      </Container>
    </div>
  );
}
