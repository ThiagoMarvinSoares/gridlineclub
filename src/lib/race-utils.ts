import { Race } from "@/lib/types";

/** Get localized race name, circuit, and location. Falls back to English. */
export function getLocalizedRace(race: Race, locale: string) {
  const loc = race.localized?.[locale];
  return {
    name: loc?.name || race.name,
    circuit: loc?.circuit || race.circuit,
    location: loc?.location || race.location,
  };
}
