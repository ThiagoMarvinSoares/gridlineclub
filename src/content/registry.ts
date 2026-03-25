import { Locale } from "@/i18n/config";

export interface PostEntry {
  slug: string;
  meta: Record<Locale, { title: string; excerpt: string }>;
  series: "f1";
  category: "regulations" | "race-recaps" | "technical" | "how-it-works";
  publishedAt: string;
  author: string;
  readingTime: number;
  tags: string[];
}

export const posts: PostEntry[] = [
  {
    slug: "understanding-2026-f1-regulations",
    meta: {
      en: {
        title: "Understanding the 2026 F1 Regulations",
        excerpt:
          "A comprehensive breakdown of the massive regulation changes for the 2026 Formula 1 season, including new power units, active aerodynamics, and sustainable fuels.",
      },
      "pt-br": {
        title: "Entendendo os Regulamentos da F1 2026",
        excerpt:
          "Uma análise completa das grandes mudanças de regulamento para a temporada de Fórmula 1 2026, incluindo novas unidades de potência, aerodinâmica ativa e combustíveis sustentáveis.",
      },
    },
    series: "f1",
    category: "regulations",
    publishedAt: "2026-01-15",
    author: "GridLine Club Team",
    readingTime: 8,
    tags: ["regulations", "2026-season", "fia", "rules", "new-era"],
  },
  {
    slug: "how-f1-tire-strategy-works",
    meta: {
      en: {
        title: "How F1 Tire Strategy Works",
        excerpt:
          "Ever wondered why teams pit at different times or switch between tire compounds? This guide explains the fundamentals of F1 tire strategy and why it can make or break a race.",
      },
      "pt-br": {
        title: "Como Funciona a Estratégia de Pneus na F1",
        excerpt:
          "Já se perguntou por que as equipes param em momentos diferentes ou trocam entre compostos de pneus? Este guia explica os fundamentos da estratégia de pneus na F1 e por que ela pode definir uma corrida.",
      },
    },
    series: "f1",
    category: "how-it-works",
    publishedAt: "2026-02-10",
    author: "GridLine Club Team",
    readingTime: 6,
    tags: ["tires", "strategy", "pirelli", "beginner-guide"],
  },
  {
    slug: "active-aerodynamics-2026-explained",
    meta: {
      en: {
        title: "Active Aerodynamics in 2026: How F1's New Wings Work",
        excerpt:
          "For the first time in modern F1, cars feature wings that change shape mid-lap. A deep dive into Z-mode, active front and rear wings, and how they transform racing in the new era.",
      },
      "pt-br": {
        title: "Aerodinâmica Ativa em 2026: Como Funcionam as Novas Asas da F1",
        excerpt:
          "Pela primeira vez na F1 moderna, os carros possuem asas que mudam de forma durante a volta. Um mergulho profundo no Z-mode, asas dianteira e traseira ativas, e como elas transformam as corridas na nova era.",
      },
    },
    series: "f1",
    category: "technical",
    publishedAt: "2026-02-25",
    author: "GridLine Club Team",
    readingTime: 10,
    tags: ["aerodynamics", "active-aero", "z-mode", "2026-regulations", "engineering"],
  },
  {
    slug: "2026-australian-gp-recap",
    meta: {
      en: {
        title: "2026 Australian GP: Season Opener Recap",
        excerpt:
          "The 2026 season kicks off in Melbourne with the new regulations in full effect. Drama, overtakes, and the first glimpse of the new era of Formula 1.",
      },
      "pt-br": {
        title: "GP da Austrália 2026: Resumo da Abertura de Temporada",
        excerpt:
          "A temporada 2026 começa em Melbourne com os novos regulamentos em pleno vigor. Drama, ultrapassagens e o primeiro vislumbre da nova era da Fórmula 1.",
      },
    },
    series: "f1",
    category: "race-recaps",
    publishedAt: "2026-03-08",
    author: "GridLine Club Team",
    readingTime: 5,
    tags: ["race-recap", "australian-gp", "2026-season", "melbourne"],
  },
  {
    slug: "2026-chinese-gp-recap",
    meta: {
      en: {
        title: "2026 Chinese GP: Antonelli's Maiden Win",
        excerpt:
          "Kimi Antonelli claimed his first victory as Mercedes scored a dominant 1-2 at Shanghai. Full race recap, strategy analysis, and championship implications.",
      },
      "pt-br": {
        title: "GP da China 2026: Primeira Vitória de Antonelli",
        excerpt:
          "Kimi Antonelli conquistou sua primeira vitória com a Mercedes fazendo 1-2 em Xangai. Resumo completo da corrida, análise estratégica e implicações no campeonato.",
      },
    },
    series: "f1",
    category: "race-recaps",
    publishedAt: "2026-03-23",
    author: "GridLine Club Team",
    readingTime: 8,
    tags: ["race-recap", "chinese-gp", "2026-season", "shanghai", "antonelli", "mercedes"],
  },
];
