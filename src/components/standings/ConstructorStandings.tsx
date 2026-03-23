import { ConstructorStanding } from "@/lib/types";

const podiumColors: Record<number, string> = {
  1: "#FFD700",
  2: "#C0C0C0",
  3: "#CD7F32",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ConstructorStandings({
  standings,
  dict,
}: {
  standings: ConstructorStanding[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
}) {
  // Find max points for the progress bar
  const maxPoints = standings[0]?.points || 1;

  return (
    <div className="space-y-2">
      {standings.map((team) => (
        <div
          key={team.teamName}
          className="overflow-hidden rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border/80"
          style={{
            borderLeftWidth: "4px",
            borderLeftColor: `#${team.teamColour}`,
          }}
        >
          <div className="flex items-center gap-4">
            {/* Position */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-light">
              <span
                className="text-lg font-bold"
                style={{
                  color: podiumColors[team.position] || "#a0a0a0",
                }}
              >
                {team.position}
              </span>
            </div>

            {/* Team colour dot */}
            <div
              className="hidden h-10 w-10 shrink-0 rounded-lg sm:block"
              style={{ backgroundColor: `#${team.teamColour}` }}
            />

            {/* Team Name & Drivers */}
            <div className="min-w-0 flex-1">
              <span className="font-heading text-lg font-bold text-text-primary">
                {team.teamName}
              </span>
              <div className="flex gap-2">
                {team.drivers.map((d) => (
                  <span
                    key={d}
                    className="text-sm text-text-muted"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Wins */}
            {team.wins > 0 && (
              <div className="hidden flex-col items-center sm:flex">
                <span className="text-lg font-bold text-racing-yellow">
                  {team.wins}
                </span>
                <span className="text-xs text-text-muted">
                  {team.wins === 1 ? dict.win : dict.wins}
                </span>
              </div>
            )}

            {/* Points */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-text-primary">
                {team.points}
              </span>
              <span className="text-xs text-text-muted">{dict.pts}</span>
            </div>
          </div>

          {/* Points bar */}
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-light">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(team.points / maxPoints) * 100}%`,
                backgroundColor: `#${team.teamColour}`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
