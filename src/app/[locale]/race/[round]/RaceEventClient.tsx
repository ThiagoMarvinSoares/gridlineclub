"use client";

import { useEffect, useState } from "react";
import { Race, SessionResult, SessionTab } from "@/lib/types";
import {
  fetchSessionsForMeeting,
  findSession,
  isSessionLive,
  isSessionCompleted,
  fetchSessionResults,
} from "@/lib/openf1-sessions";
import { OpenF1Session } from "@/lib/types";
import SessionTabs from "@/components/race/SessionTabs";
import SessionResultsTable from "@/components/race/SessionResultsTable";
import SessionLiveIndicator from "@/components/race/SessionLiveIndicator";

type SessionState = "completed" | "live" | "upcoming" | "nodata";

interface SessionData {
  status: SessionState;
  results: SessionResult[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RaceEventClient({ race, dict }: { race: Race; dict: any }) {
  const hasSprint = !!race.sessions.sprint;

  const allTabs: SessionTab[] = hasSprint
    ? ["fp1", "sprintQualifying", "sprint", "qualifying", "race"]
    : ["fp1", "fp2", "fp3", "qualifying", "race"];

  const [activeTab, setActiveTab] = useState<SessionTab>("race");
  const [allSessionData, setAllSessionData] = useState<Record<string, SessionData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ALL sessions on mount — one load, instant tab switching
  useEffect(() => {
    async function loadAllSessions() {
      try {
        const sessions = await fetchSessionsForMeeting(2026, race.country);
        const dataMap: Record<string, SessionData> = {};

        // Determine status for each tab
        const completedSessions: { tab: SessionTab; session: OpenF1Session }[] = [];

        for (const tab of allTabs) {
          const session = findSession(sessions, tab);
          if (!session) {
            dataMap[tab] = { status: "upcoming", results: [] };
          } else if (isSessionLive(session)) {
            dataMap[tab] = { status: "live", results: [] };
          } else if (isSessionCompleted(session)) {
            completedSessions.push({ tab, session });
          } else {
            dataMap[tab] = { status: "upcoming", results: [] };
          }
        }

        // Fetch results for all completed sessions in parallel (batched)
        const BATCH_SIZE = 2;
        for (let i = 0; i < completedSessions.length; i += BATCH_SIZE) {
          const batch = completedSessions.slice(i, i + BATCH_SIZE);
          const results = await Promise.all(
            batch.map(({ session }) => fetchSessionResults(session.session_key))
          );
          for (let j = 0; j < batch.length; j++) {
            const data = results[j];
            dataMap[batch[j].tab] = {
              status: data.length > 0 ? "completed" : "nodata",
              results: data,
            };
          }
          // Small delay between batches to avoid rate limiting
          if (i + BATCH_SIZE < completedSessions.length) {
            await new Promise((r) => setTimeout(r, 300));
          }
        }

        setAllSessionData(dataMap);

        // Auto-select the most relevant tab (latest completed or live)
        for (let i = allTabs.length - 1; i >= 0; i--) {
          const d = dataMap[allTabs[i]];
          if (d && (d.status === "completed" || d.status === "live")) {
            setActiveTab(allTabs[i]);
            break;
          }
        }

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      }
    }

    loadAllSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [race.country]);

  const tabLabels: Record<SessionTab, string> = {
    fp1: dict.fp1,
    fp2: dict.fp2,
    fp3: dict.fp3,
    qualifying: dict.qualifying,
    race: dict.race,
    sprint: dict.sprint,
    sprintQualifying: dict.sprintQualifying,
  };

  const tabConfig = allTabs.map((tab) => ({
    key: tab,
    label: tabLabels[tab],
    disabled: false,
  }));

  const currentData = allSessionData[activeTab];

  function LoadingSkeleton() {
    return (
      <div className="space-y-1 rounded-xl border border-border bg-surface overflow-hidden">
        <div className="grid grid-cols-[3rem_1fr_1fr_7rem_3.5rem] gap-2 border-b border-border bg-surface-light px-4 py-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface-light" />
          ))}
        </div>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[3rem_1fr_1fr_7rem_3.5rem] gap-2 px-4 py-3 border-b border-border/30">
            <div className="h-5 w-8 animate-pulse rounded bg-surface-light" />
            <div className="h-5 w-32 animate-pulse rounded bg-surface-light" />
            <div className="h-5 w-24 animate-pulse rounded bg-surface-light" />
            <div className="h-5 w-16 animate-pulse rounded bg-surface-light ml-auto" />
            <div className="h-5 w-8 animate-pulse rounded bg-surface-light ml-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <SessionTabs tabs={tabConfig} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {error ? (
          <div className="rounded-xl border border-racing-red/30 bg-racing-red/10 p-8 text-center">
            <p className="text-lg font-bold text-racing-red">{dict.failedToLoad}</p>
            <p className="mt-2 text-sm text-text-secondary">{error}</p>
          </div>
        ) : loading || !currentData ? (
          <LoadingSkeleton />
        ) : currentData.status === "live" ? (
          <SessionLiveIndicator dict={dict} />
        ) : currentData.status === "upcoming" ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-8">
            <p className="text-lg text-text-muted">{dict.sessionNotStarted}</p>
          </div>
        ) : currentData.status === "nodata" ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-8">
            <p className="text-lg text-text-muted">{dict.noDataAvailable}</p>
          </div>
        ) : (
          <SessionResultsTable results={currentData.results} dict={dict} />
        )}
      </div>
    </div>
  );
}
