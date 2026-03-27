import { OpenF1Driver, OpenF1Session, SessionResult } from "@/lib/types";

const API_BASE = "https://api.openf1.org/v1";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url);
    if (res.ok) return res.json();
    if (res.status === 429) {
      const wait = 1000 * Math.pow(2, attempt);
      await sleep(wait);
      continue;
    }
    throw new Error(`OpenF1 API error: ${res.status}`);
  }
  throw new Error("OpenF1 API: too many retries (rate limited)");
}

// Cache for session data (10 min TTL)
const sessionCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = sessionCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data as T;
  }
  return null;
}

function setCache(key: string, data: unknown) {
  sessionCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Fetch all sessions for a specific GP by country name and year.
 */
export async function fetchSessionsForMeeting(
  year: number,
  countryName: string
): Promise<OpenF1Session[]> {
  const cacheKey = `sessions-${year}-${countryName}`;
  const cached = getCached<OpenF1Session[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry<OpenF1Session[]>(
    `${API_BASE}/sessions?year=${year}&country_name=${encodeURIComponent(countryName)}`
  );
  setCache(cacheKey, data);
  return data;
}

/**
 * Find the matching OpenF1 session type for our tab names.
 */
function mapTabToSessionName(tab: string): string {
  const mapping: Record<string, string> = {
    fp1: "Practice 1",
    fp2: "Practice 2",
    fp3: "Practice 3",
    qualifying: "Qualifying",
    race: "Race",
    sprint: "Sprint",
    sprintQualifying: "Sprint Qualifying",
  };
  return mapping[tab] || tab;
}

/**
 * Find a specific session from the meeting sessions list.
 */
export function findSession(
  sessions: OpenF1Session[],
  tab: string
): OpenF1Session | undefined {
  const sessionName = mapTabToSessionName(tab);
  return sessions.find((s) => s.session_name === sessionName);
}

/**
 * Check if a session is currently live.
 */
export function isSessionLive(session: OpenF1Session): boolean {
  const now = Date.now();
  const start = new Date(session.date_start).getTime();
  const end = new Date(session.date_end).getTime();
  return now >= start && now <= end;
}

/**
 * Check if a session has completed.
 */
export function isSessionCompleted(session: OpenF1Session): boolean {
  return Date.now() > new Date(session.date_end).getTime();
}

/**
 * Fetch results for a specific session — combines position data with driver info.
 */
export async function fetchSessionResults(
  sessionKey: number
): Promise<SessionResult[]> {
  const cacheKey = `results-${sessionKey}`;
  const cached = getCached<SessionResult[]>(cacheKey);
  if (cached) return cached;

  // Fetch positions and drivers in parallel
  const [positions, drivers] = await Promise.all([
    fetchWithRetry<Array<{
      date: string;
      session_key: number;
      position: number;
      driver_number: number;
    }>>(`${API_BASE}/position?session_key=${sessionKey}`),
    fetchWithRetry<OpenF1Driver[]>(
      `${API_BASE}/drivers?session_key=${sessionKey}`
    ),
  ]);

  // Build driver lookup
  const driverMap = new Map<number, OpenF1Driver>();
  for (const d of drivers) {
    driverMap.set(d.driver_number, d);
  }

  // Get final position for each driver (latest timestamp)
  const latest = new Map<number, { date: string; position: number }>();
  for (const p of positions) {
    const prev = latest.get(p.driver_number);
    if (!prev || p.date > prev.date) {
      latest.set(p.driver_number, { date: p.date, position: p.position });
    }
  }

  // Try to fetch lap data for timing info
  let lapData: Array<{
    driver_number: number;
    lap_duration: number | null;
    lap_number: number;
  }> = [];
  try {
    lapData = await fetchWithRetry(
      `${API_BASE}/laps?session_key=${sessionKey}`
    );
  } catch {
    // Lap data not available for all sessions
  }

  // Get best lap time per driver and lap count
  const bestLaps = new Map<number, number>();
  const lapCounts = new Map<number, number>();
  for (const lap of lapData) {
    if (lap.lap_duration && lap.lap_duration > 0) {
      const prev = bestLaps.get(lap.driver_number);
      if (!prev || lap.lap_duration < prev) {
        bestLaps.set(lap.driver_number, lap.lap_duration);
      }
    }
    const count = lapCounts.get(lap.driver_number) || 0;
    lapCounts.set(lap.driver_number, Math.max(count, lap.lap_number));
  }

  // Find the fastest overall lap time
  let fastestTime = Infinity;
  for (const time of bestLaps.values()) {
    if (time < fastestTime) fastestTime = time;
  }

  // Build results
  const results: SessionResult[] = [];
  for (const [driverNum, posData] of latest) {
    const driver = driverMap.get(driverNum);
    if (!driver) continue;

    const driverBestLap = bestLaps.get(driverNum);
    let timeStr = "";
    let gapStr = "";

    if (driverBestLap) {
      timeStr = formatLapTime(driverBestLap);
      if (posData.position === 1) {
        gapStr = timeStr;
      } else {
        const diff = driverBestLap - fastestTime;
        gapStr = diff > 0 ? `+${diff.toFixed(3)}` : timeStr;
      }
    }

    results.push({
      position: posData.position,
      driverNumber: driverNum,
      fullName: driver.full_name,
      nameAcronym: driver.name_acronym,
      teamName: driver.team_name,
      teamColour: driver.team_colour || "808080",
      headshotUrl: driver.headshot_url || "",
      time: timeStr,
      gap: gapStr,
      laps: lapCounts.get(driverNum) || 0,
    });
  }

  // Sort by position
  results.sort((a, b) => a.position - b.position);

  setCache(cacheKey, results);
  return results;
}

/**
 * Format seconds into mm:ss.xxx format.
 */
function formatLapTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) {
    return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
  }
  return secs.toFixed(3);
}
