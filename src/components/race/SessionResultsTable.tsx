"use client";

import { SessionResult } from "@/lib/types";
import Image from "next/image";
import { clsx } from "clsx";

const podiumColors: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SessionResultsTable({
  results,
  dict,
}: {
  results: SessionResult[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}) {
  if (results.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-border bg-surface p-8">
        <p className="text-text-muted">{dict.noDataAvailable}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface">
      {/* Desktop header */}
      <div className="hidden items-center gap-2 border-b border-border bg-surface-light px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted sm:grid sm:grid-cols-[2.5rem_2.5rem_1fr_1fr_7rem_3.5rem]">
        <span>{dict.pos}</span>
        <span />
        <span>{dict.driver}</span>
        <span>{dict.team}</span>
        <span className="text-right">{dict.gap}</span>
        <span className="text-right">{dict.laps}</span>
      </div>

      {/* Mobile header */}
      <div className="grid grid-cols-[2rem_2rem_1fr_5.5rem_2.5rem] items-center gap-1.5 border-b border-border bg-surface-light px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted sm:hidden">
        <span>{dict.pos}</span>
        <span />
        <span>{dict.driver}</span>
        <span className="text-right">{dict.gap}</span>
        <span className="text-right">{dict.laps}</span>
      </div>

      {/* Rows */}
      {results.map((r, i) => {
        const borderColor = podiumColors[r.position];
        const firstName = r.fullName.split(" ").slice(0, -1).join(" ");
        const lastName = r.fullName.split(" ").pop();

        return (
          <div
            key={r.driverNumber}
            className={clsx(
              i < results.length - 1 && "border-b border-border/50",
              i % 2 === 0 ? "bg-surface" : "bg-surface/80"
            )}
            style={borderColor ? { borderLeft: `3px solid ${borderColor}` } : undefined}
          >
            {/* Desktop row */}
            <div className="hidden items-center gap-2 px-4 py-3 sm:grid sm:grid-cols-[2.5rem_2.5rem_1fr_1fr_7rem_3.5rem]">
              <span
                className={clsx(
                  "text-lg font-bold",
                  r.position <= 3 ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {r.position}
              </span>

              <div>
                {r.headshotUrl ? (
                  <Image
                    src={r.headshotUrl}
                    alt={r.fullName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: `#${r.teamColour}` }}
                  >
                    {r.nameAcronym.substring(0, 2)}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <span className="text-sm text-text-secondary">{firstName} </span>
                <span className="text-sm font-bold uppercase text-text-primary">{lastName}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: `#${r.teamColour}` }}
                />
                <span className="truncate text-sm text-text-secondary">{r.teamName}</span>
              </div>

              <span
                className={clsx(
                  "text-right font-mono text-sm",
                  r.position === 1 ? "font-bold text-text-primary" : "text-text-secondary"
                )}
              >
                {r.gap || "—"}
              </span>

              <span className="text-right text-sm text-text-muted">{r.laps || "—"}</span>
            </div>

            {/* Mobile row */}
            <div className="grid grid-cols-[2rem_2rem_1fr_5.5rem_2.5rem] items-center gap-1.5 px-3 py-2.5 sm:hidden">
              {/* Position */}
              <span
                className={clsx(
                  "text-base font-bold",
                  r.position <= 3 ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {r.position}
              </span>

              {/* Driver photo */}
              <div>
                {r.headshotUrl ? (
                  <Image
                    src={r.headshotUrl}
                    alt={r.fullName}
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[8px] font-bold text-white"
                    style={{ backgroundColor: `#${r.teamColour}` }}
                  >
                    {r.nameAcronym.substring(0, 2)}
                  </div>
                )}
              </div>

              {/* Driver name + team */}
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-text-secondary">{firstName}</span>
                  <span className="text-xs font-bold uppercase text-text-primary">{lastName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className="h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: `#${r.teamColour}` }}
                  />
                  <span className="truncate text-[10px] text-text-muted">{r.teamName}</span>
                </div>
              </div>

              {/* Gap */}
              <span
                className={clsx(
                  "text-right font-mono text-xs",
                  r.position === 1 ? "font-bold text-text-primary" : "text-text-secondary"
                )}
              >
                {r.gap || "—"}
              </span>

              {/* Laps */}
              <span className="text-right text-xs text-text-muted">{r.laps || "—"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
