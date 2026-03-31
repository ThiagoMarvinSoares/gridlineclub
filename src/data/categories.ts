import { CategoryInfo } from "@/lib/types";

export const categories: CategoryInfo[] = [
  {
    slug: "regulations",
    name: "Regulations",
    description: "Rule changes, FIA directives, and regulatory analysis",
    color: "#e10600",
  },
  {
    slug: "race-recaps",
    name: "Race Recaps",
    description: "Post-race analysis, key moments, and results breakdown",
    color: "#ff6b00",
  },
  {
    slug: "race-preview",
    name: "Race Preview",
    description: "Pre-race analysis, practice data, qualifying predictions, and race winner picks",
    color: "#a855f7",
  },
  {
    slug: "technical",
    name: "Technical",
    description: "Car design, engineering, aerodynamics, and development",
    color: "#00bfff",
  },
  {
    slug: "news",
    name: "News",
    description: "Breaking news, driver transfers, team announcements, and F1 updates",
    color: "#eab308",
  },
  {
    slug: "how-it-works",
    name: "How It Works",
    description: "Explainers for newcomers and deep dives into how F1 operates",
    color: "#22c55e",
  },
];

export function getCategoryInfo(slug: string): CategoryInfo | undefined {
  return categories.find((c) => c.slug === slug);
}
