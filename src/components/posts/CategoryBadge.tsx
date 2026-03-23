import { getCategoryInfo } from "@/data/categories";
import { Category } from "@/lib/types";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CategoryBadge({
  category,
  linked = true,
  locale,
  dict,
}: {
  category: Category;
  linked?: boolean;
  locale: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}) {
  const info = getCategoryInfo(category);
  if (!info) return null;

  // Use dict for display name if available, fallback to info.name
  const catDict = dict?.[category];
  const displayName = typeof catDict === "object" ? catDict.name : (catDict || info.name);

  const badge = (
    <span
      className="inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{
        backgroundColor: `${info.color}20`,
        color: info.color,
      }}
    >
      {displayName}
    </span>
  );

  if (linked) {
    return (
      <Link href={`/${locale}/category/${category}`} className="transition-opacity hover:opacity-80">
        {badge}
      </Link>
    );
  }

  return badge;
}
