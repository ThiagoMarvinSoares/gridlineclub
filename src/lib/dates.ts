import { Race } from "@/lib/types";

function getDateLocale(locale: string): string {
  if (locale === "pt-br") return "pt-BR";
  return "en-US";
}

export function formatToTimezone(utcDateStr: string, timeZone: string, locale = "en"): string {
  const date = new Date(utcDateStr);
  return date.toLocaleString(getDateLocale(locale), {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatTimeOnly(utcDateStr: string, timeZone: string, locale = "en"): string {
  const date = new Date(utcDateStr);
  return date.toLocaleString(getDateLocale(locale), {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateOnly(utcDateStr: string, timeZone: string, locale = "en"): string {
  const date = new Date(utcDateStr);
  return date.toLocaleString(getDateLocale(locale), {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatToET(utcDateStr: string, locale = "en"): string {
  return formatToTimezone(utcDateStr, "America/New_York", locale);
}

export function formatToBRT(utcDateStr: string, locale = "en"): string {
  return formatToTimezone(utcDateStr, "America/Sao_Paulo", locale);
}

export function formatTimeET(utcDateStr: string, locale = "en"): string {
  return formatTimeOnly(utcDateStr, "America/New_York", locale);
}

export function formatTimeBRT(utcDateStr: string, locale = "en"): string {
  return formatTimeOnly(utcDateStr, "America/Sao_Paulo", locale);
}

export function getTimeUntil(utcDateStr: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} | null {
  const target = new Date(utcDateStr).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    total: diff,
  };
}

export function getNextRace(races: Race[]): Race | null {
  const now = Date.now();
  return (
    races.find((race) => new Date(race.sessions.race).getTime() > now) ?? null
  );
}

export function isRacePast(race: Race): boolean {
  return new Date(race.sessions.race).getTime() < Date.now();
}

export function formatRaceDate(dateStr: string, locale = "en"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(getDateLocale(locale), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
