import {
  OpenF1Driver,
  OpenF1Session,
  OpenF1Position,
  DriverStanding,
  ConstructorStanding,
} from "@/lib/types";

const API_BASE = "https://api.openf1.org/v1";

// Points awarded per finishing position (race)
const RACE_POINTS: Record<number, number> = {
  1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
  6: 8, 7: 6, 8: 4, 9: 2, 10: 1,
};

// Points awarded per finishing position (sprint)
const SPRINT_POINTS: Record<number, number> = {
  1: 8, 2: 7, 3: 6, 4: 5, 5: 4,
  6: 3, 7: 2, 8: 1,
};

// Cache standings in localStorage (persists across navigations)
const STANDINGS_CACHE_KEY = "openf1_standings";
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// In-memory fallback
let standingsCache: {
  data: { drivers: DriverStanding[]; constructors: ConstructorStanding[] };
  timestamp: number;
} | null = null;

function getStandingsCache(): typeof standingsCache {
  if (standingsCache && Date.now() - standingsCache.timestamp < CACHE_TTL) {
    return standingsCache;
  }
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = localStorage.getItem(STANDINGS_CACHE_KEY);
      if (raw) {
        const entry = JSON.parse(raw);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
          standingsCache = entry;
          return entry;
        }
        localStorage.removeItem(STANDINGS_CACHE_KEY);
      }
    }
  } catch { /* ignore */ }
  return null;
}

function setStandingsCache(data: { drivers: DriverStanding[]; constructors: ConstructorStanding[] }) {
  const entry = { data, timestamp: Date.now() };
  standingsCache = entry;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STANDINGS_CACHE_KEY, JSON.stringify(entry));
    }
  } catch { /* localStorage full */ }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status === 429) {
      // Rate limited — wait with exponential backoff
      const wait = 1000 * Math.pow(2, attempt);
      await sleep(wait);
      continue;
    }
    throw new Error(`OpenF1 API error: ${res.status}`);
  }
  throw new Error("OpenF1 API: too many retries (rate limited)");
}

export async function fetchDrivers(): Promise<OpenF1Driver[]> {
  return fetchWithRetry<OpenF1Driver[]>(`${API_BASE}/drivers?session_key=latest`);
}

export async function fetchRaceSessions(year: number): Promise<OpenF1Session[]> {
  return fetchWithRetry<OpenF1Session[]>(
    `${API_BASE}/sessions?year=${year}&session_name=Race`
  );
}

export async function fetchSprintSessions(year: number): Promise<OpenF1Session[]> {
  return fetchWithRetry<OpenF1Session[]>(
    `${API_BASE}/sessions?year=${year}&session_name=Sprint`
  );
}

export async function fetchPositions(sessionKey: number): Promise<OpenF1Position[]> {
  try {
    return await fetchWithRetry<OpenF1Position[]>(
      `${API_BASE}/position?session_key=${sessionKey}`
    );
  } catch {
    // Return empty array for cancelled races or failed fetches
    return [];
  }
}

/**
 * Get final finishing positions for a session.
 * The API returns position updates over time — the last entry per driver is their final result.
 */
export function getFinalPositions(
  positions: OpenF1Position[]
): Map<number, number> {
  const latest = new Map<number, { date: string; position: number }>();

  for (const p of positions) {
    const prev = latest.get(p.driver_number);
    if (!prev || p.date > prev.date) {
      latest.set(p.driver_number, { date: p.date, position: p.position });
    }
  }

  const result = new Map<number, number>();
  for (const [driver, data] of latest) {
    result.set(driver, data.position);
  }
  return result;
}

/**
 * Filter sessions to only those that have already started.
 */
function getPastSessions(sessions: OpenF1Session[]): OpenF1Session[] {
  const now = new Date();
  return sessions.filter((s) => new Date(s.date_start) < now);
}

/**
 * Fetch positions for multiple sessions with rate-limit-friendly pacing.
 * Fetches 2 at a time with a small delay between batches.
 */
async function fetchAllPositions(
  sessions: OpenF1Session[]
): Promise<Map<number, OpenF1Position[]>> {
  const result = new Map<number, OpenF1Position[]>();

  // Fetch ONE at a time with 500ms delay to avoid 429
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const positions = await fetchPositions(session.session_key);
    result.set(session.session_key, positions);

    // Wait between each request
    if (i < sessions.length - 1) {
      await sleep(500);
    }
  }

  return result;
}

export async function computeStandings(year: number): Promise<{
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
}> {
  // Return cached data if fresh (checks localStorage too)
  const cached = getStandingsCache();
  if (cached) {
    return cached.data;
  }

  // Fetch metadata in parallel (3 lightweight calls)
  const [driversList, raceSessions, sprintSessions] = await Promise.all([
    fetchDrivers(),
    fetchRaceSessions(year),
    fetchSprintSessions(year),
  ]);

  // Build driver info lookup
  const driverInfo = new Map<number, OpenF1Driver>();
  for (const d of driversList) {
    driverInfo.set(d.driver_number, d);
  }

  // Only process completed sessions
  const completedRaces = getPastSessions(raceSessions);
  const completedSprints = getPastSessions(sprintSessions);

  // Fetch all position data with rate-limit pacing
  const allSessions = [...completedRaces, ...completedSprints];
  const allPositions = await fetchAllPositions(allSessions);

  // Track points and wins per driver
  const driverPoints = new Map<number, number>();
  const driverWins = new Map<number, number>();

  // Process race results
  for (const session of completedRaces) {
    const positions = allPositions.get(session.session_key);
    if (!positions) continue;
    const finals = getFinalPositions(positions);

    for (const [driverNum, position] of finals) {
      const pts = RACE_POINTS[position] || 0;
      driverPoints.set(driverNum, (driverPoints.get(driverNum) || 0) + pts);
      if (position === 1) {
        driverWins.set(driverNum, (driverWins.get(driverNum) || 0) + 1);
      }
    }
  }

  // Process sprint results
  for (const session of completedSprints) {
    const positions = allPositions.get(session.session_key);
    if (!positions) continue;
    const finals = getFinalPositions(positions);

    for (const [driverNum, position] of finals) {
      const pts = SPRINT_POINTS[position] || 0;
      driverPoints.set(driverNum, (driverPoints.get(driverNum) || 0) + pts);
    }
  }

  // Build driver standings
  const drivers: DriverStanding[] = [];
  for (const [driverNum, points] of driverPoints) {
    const info = driverInfo.get(driverNum);
    if (!info) continue;

    drivers.push({
      position: 0,
      driverNumber: driverNum,
      fullName: info.full_name,
      nameAcronym: info.name_acronym,
      teamName: info.team_name,
      teamColour: info.team_colour,
      headshotUrl: info.headshot_url,
      points,
      wins: driverWins.get(driverNum) || 0,
    });
  }

  // Sort by points descending, then wins
  drivers.sort((a, b) => b.points - a.points || b.wins - a.wins);
  drivers.forEach((d, i) => (d.position = i + 1));

  // Build constructor standings
  const teamMap = new Map<
    string,
    { points: number; wins: number; colour: string; drivers: string[] }
  >();

  for (const d of drivers) {
    const existing = teamMap.get(d.teamName);
    if (existing) {
      existing.points += d.points;
      existing.wins += d.wins;
      if (!existing.drivers.includes(d.nameAcronym)) {
        existing.drivers.push(d.nameAcronym);
      }
    } else {
      teamMap.set(d.teamName, {
        points: d.points,
        wins: d.wins,
        colour: d.teamColour,
        drivers: [d.nameAcronym],
      });
    }
  }

  const constructors: ConstructorStanding[] = [];
  for (const [teamName, data] of teamMap) {
    constructors.push({
      position: 0,
      teamName,
      teamColour: data.colour,
      points: data.points,
      wins: data.wins,
      drivers: data.drivers,
    });
  }

  constructors.sort((a, b) => b.points - a.points || b.wins - a.wins);
  constructors.forEach((c, i) => (c.position = i + 1));

  const result = { drivers, constructors };

  // Cache the result (memory + localStorage)
  setStandingsCache(result);

  return result;
}
