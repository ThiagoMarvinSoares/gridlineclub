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
    <div className="overflow-x-auto rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="grid grid-cols-[3rem_1fr_1fr_7rem_3.5rem] items-center gap-2 border-b border-border bg-surface-light px-4 py-3 text-xs font-bold uppercase tracking-wider text-text-muted sm:grid-cols-[3rem_2.5rem_1fr_1fr_7rem_3.5rem]">
        <span>{dict.pos}</span>
        <span className="hidden sm:block" />
        <span>{dict.driver}</span>
        <span>{dict.team}</span>
        <span className="text-right">{dict.gap}</span>
        <span className="text-right">{dict.laps}</span>
      </div>

      {/* Rows */}
      {results.map((r, i) => {
        const borderColor = podiumColors[r.position];
        return (
          <div
            key={r.driverNumber}
            className={clsx(
              "grid grid-cols-[3rem_1fr_1fr_7rem_3.5rem] items-center gap-2 px-4 py-3 sm:grid-cols-[3rem_2.5rem_1fr_1fr_7rem_3.5rem]",
              i < results.length - 1 && "border-b border-border/50",
              i % 2 === 0 ? "bg-surface" : "bg-surface/80"
            )}
            style={borderColor ? { borderLeft: `3px solid ${borderColor}` } : undefined}
          >
            {/* Position */}
            <span
              className={clsx(
                "text-lg font-bold",
                r.position <= 3 ? "text-text-primary" : "text-text-secondary"
              )}
            >
              {r.position}
            </span>

            {/* Driver headshot */}
            <div className="hidden sm:block">
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

            {/* Driver name */}
            <div className="min-w-0">
              <span className="text-sm text-text-secondary">
                {r.fullName.split(" ").slice(0, -1).join(" ")}{" "}
              </span>
              <span className="text-sm font-bold uppercase text-text-primary">
                {r.fullName.split(" ").pop()}
              </span>
            </div>

            {/* Team */}
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="hidden h-3 w-3 flex-shrink-0 rounded-full sm:block"
                style={{ backgroundColor: `#${r.teamColour}` }}
              />
              <span className="truncate text-sm text-text-secondary">
                {r.teamName}
              </span>
            </div>

            {/* Gap */}
            <span
              className={clsx(
                "text-right font-mono text-sm",
                r.position === 1
                  ? "font-bold text-text-primary"
                  : "text-text-secondary"
              )}
            >
              {r.gap || "—"}
            </span>

            {/* Laps */}
            <span className="text-right text-sm text-text-muted">
              {r.laps || "—"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
