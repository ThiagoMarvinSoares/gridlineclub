import { DriverStanding } from "@/lib/types";

const podiumColors: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DriverStandings({
  standings,
  dict,
}: {
  standings: DriverStanding[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}) {
  return (
    <div className="space-y-2">
      {standings.map((driver) => (
        <div
          key={driver.driverNumber}
          className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border/80"
          style={{
            borderLeftWidth: "4px",
            borderLeftColor: `#${driver.teamColour}`,
          }}
        >
          {/* Position */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light">
            <span
              className="text-lg font-bold"
              style={{
                color: podiumColors[driver.position] || "#a0a0a0",
              }}
            >
              {driver.position}
            </span>
          </div>

          {/* Driver photo */}
          <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-light sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={driver.headshotUrl}
              alt={driver.fullName}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Name & Team */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-heading text-lg font-bold text-text-primary">
                {driver.fullName}
              </span>
              <span className="hidden rounded bg-surface-light px-1.5 py-0.5 text-xs font-bold text-text-muted sm:inline">
                {driver.nameAcronym}
              </span>
            </div>
            <span
              className="text-sm font-medium"
              style={{ color: `#${driver.teamColour}` }}
            >
              {driver.teamName}
            </span>
          </div>

          {/* Wins */}
          {driver.wins > 0 && (
            <div className="hidden flex-col items-center sm:flex">
              <span className="text-lg font-bold text-racing-yellow">
                {driver.wins}
              </span>
              <span className="text-xs text-text-muted">
                {driver.wins === 1 ? dict.win : dict.wins}
              </span>
            </div>
          )}

          {/* Points */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-text-primary">
              {driver.points}
            </span>
            <span className="text-xs text-text-muted">{dict.pts}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
