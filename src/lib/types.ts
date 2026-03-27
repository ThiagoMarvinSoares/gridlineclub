export type Series = "f1" | "motogp" | "wec" | "indycar";

export type Category = "regulations" | "race-recaps" | "technical" | "how-it-works";

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  series: Series;
  category: Category;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  author: string;
  readingTime: number;
  tags: string[];
}

export interface RaceSession {
  fp1: string;
  fp2: string;
  fp3: string;
  qualifying: string;
  race: string;
  sprint?: string;
  sprintQualifying?: string;
}

export interface RaceLocalized {
  name: string;
  circuit: string;
  location: string;
}

export interface Race {
  round: number;
  name: string;
  officialName: string;
  circuit: string;
  location: string;
  country: string;
  countryCode: string;
  dateStart: string;
  sessions: RaceSession;
  localized?: Record<string, RaceLocalized>;
}

export interface CategoryInfo {
  slug: Category;
  name: string;
  description: string;
  color: string;
}

// OpenF1 API types
export interface OpenF1Driver {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  first_name: string;
  last_name: string;
  headshot_url: string;
  country_code: string | null;
}

export interface OpenF1Session {
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  meeting_key: number;
  circuit_short_name: string;
  country_name: string;
  location: string;
  year: number;
}

export interface OpenF1Position {
  date: string;
  session_key: number;
  position: number;
  meeting_key: number;
  driver_number: number;
}

export interface DriverStanding {
  position: number;
  driverNumber: number;
  fullName: string;
  nameAcronym: string;
  teamName: string;
  teamColour: string;
  headshotUrl: string;
  points: number;
  wins: number;
}

export interface ConstructorStanding {
  position: number;
  teamName: string;
  teamColour: string;
  points: number;
  wins: number;
  drivers: string[];
}

// Race event session results
export interface SessionResult {
  position: number;
  driverNumber: number;
  fullName: string;
  nameAcronym: string;
  teamName: string;
  teamColour: string;
  headshotUrl: string;
  time: string;
  gap: string;
  laps: number;
}

export type SessionTab = "fp1" | "fp2" | "fp3" | "qualifying" | "race" | "sprint" | "sprintQualifying";
