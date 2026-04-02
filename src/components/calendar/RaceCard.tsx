import { Race } from "@/lib/types";
import { formatTimeET, formatTimeBRT, formatDateOnly, isRacePast } from "@/lib/dates";
import { getLocalizedRace } from "@/lib/race-utils";
import { clsx } from "clsx";
import Link from "next/link";

function SessionRow({ label, utcTime, locale }: { label: string; utcTime: string; locale: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-muted">{label}</span>
      <div className="flex gap-4">
        <span className="w-24 text-right text-text-secondary">
          {formatTimeET(utcTime, locale)}
        </span>
        <span className="w-24 text-right text-text-secondary">
          {formatTimeBRT(utcTime, locale)}
        </span>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RaceCard({
  race,
  isNext,
  dict,
  locale,
}: {
  race: Race;
  isNext: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  locale: string;
}) {
  const past = isRacePast(race);
  const hasSprint = !!race.sessions.sprint;
  const loc = getLocalizedRace(race, locale);

  // Show "View Results" for past races AND the current/next race (some sessions may be done)
  const hasStarted = new Date(race.sessions.fp1).getTime() < Date.now();
  const showViewResults = past || hasStarted;

  return (
    <div
      className={clsx(
        "rounded-xl border bg-surface p-5 transition-all",
        isNext
          ? "border-racing-red shadow-lg shadow-racing-red/10"
          : past
          ? "border-border"
          : "border-border hover:border-border/80"
      )}
    >
      {/* Card content — dimmed for past races */}
      <div className={clsx(past && "opacity-60")}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold",
                isNext
                  ? "bg-racing-red text-white"
                  : "bg-surface-light text-text-secondary"
              )}
            >
              R{race.round}
            </span>
            <div>
              <h3 className="font-heading text-lg font-bold text-text-primary">
                {loc.name}
              </h3>
              <p className="text-sm text-text-secondary">{loc.circuit}</p>
              <p className="text-xs text-text-muted">{loc.location}</p>
            </div>
          </div>
          {isNext && (
            <span className="rounded-full bg-racing-red/10 px-3 py-0.5 text-xs font-bold text-racing-red">
              {dict.next}
            </span>
          )}
          {past && (
            <span className="rounded-full bg-surface-light px-3 py-0.5 text-xs font-bold text-text-muted">
              {dict.completed}
            </span>
          )}
          {hasSprint && !past && !isNext && (
            <span className="rounded-full bg-racing-orange/10 px-3 py-0.5 text-xs font-bold text-racing-orange">
              {dict.sprint}
            </span>
          )}
        </div>

        {/* Date */}
        <div className="mt-4 text-sm font-medium text-text-primary">
          {formatDateOnly(race.sessions.race, "America/New_York", locale)}
        </div>

        {/* Session times header */}
        <div className="mt-3 flex items-center justify-between border-b border-border pb-2 text-xs font-bold uppercase tracking-wider">
          <span className="text-text-muted">{dict.session}</span>
          <div className="flex gap-4">
            <span className="w-24 text-right text-racing-orange">{dict.etLabel}</span>
            <span className="w-24 text-right text-racing-yellow">{dict.brtLabel}</span>
          </div>
        </div>

        {/* Sessions */}
        <div className="mt-2 space-y-1.5">
          {hasSprint && race.sessions.sprintQualifying && (
            <SessionRow label={dict.sprintQuali} utcTime={race.sessions.sprintQualifying} locale={locale} />
          )}
          {hasSprint && race.sessions.sprint && (
            <SessionRow label={dict.sprintRace} utcTime={race.sessions.sprint} locale={locale} />
          )}
          {!hasSprint && (
            <>
              <SessionRow label={dict.fp1} utcTime={race.sessions.fp1} locale={locale} />
              <SessionRow label={dict.fp2} utcTime={race.sessions.fp2} locale={locale} />
              <SessionRow label={dict.fp3} utcTime={race.sessions.fp3} locale={locale} />
            </>
          )}
          <SessionRow label={dict.qualifying} utcTime={race.sessions.qualifying} locale={locale} />
          <div className="border-t border-border/50 pt-1.5">
            <SessionRow label={dict.race} utcTime={race.sessions.race} locale={locale} />
          </div>
        </div>
      </div>

      {/* View Results link — outside the dimmed wrapper, always full opacity */}
      {showViewResults && (
        <div className="mt-4 border-t border-border/50 pt-3">
          <Link
            href={`/${locale}/race/${race.slug}`}
            className="text-sm font-bold text-racing-red transition-colors hover:text-racing-orange"
          >
            {dict.viewResults || "View Results"} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
