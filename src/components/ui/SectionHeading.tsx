import { clsx } from "clsx";

export default function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={clsx(
        "font-heading text-2xl font-bold tracking-tight text-text-primary sm:text-3xl",
        className
      )}
    >
      <span className="inline-block border-b-2 border-racing-red pb-1">
        {children}
      </span>
    </Tag>
  );
}
