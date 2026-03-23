import { clsx } from "clsx";

export default function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={clsx(
        "font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl",
        className
      )}
    >
      <span className="inline-block border-b-2 border-racing-red pb-1">
        {children}
      </span>
    </h2>
  );
}
