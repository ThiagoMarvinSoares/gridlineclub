"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Race } from "@/lib/types";
import { getTimeUntil, formatToET, formatToBRT } from "@/lib/dates";
import { getLocalizedRace } from "@/lib/race-utils";

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-surface-light text-2xl font-bold text-text-primary sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NextRaceWidget({ race, dict, locale }: { race: Race; dict: any; locale: string }) {
  const [countdown, setCountdown] = useState<ReturnType<typeof getTimeUntil>>(null);

  useEffect(() => {
    setCountdown(getTimeUntil(race.sessions.race));
    const interval = setInterval(() => {
      setCountdown(getTimeUntil(race.sessions.race));
    }, 1000);
    return () => clearInterval(interval);
  }, [race.sessions.race]);

  const loc = getLocalizedRace(race, locale);

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border bg-gradient-to-r from-racing-red/10 to-transparent px-6 py-3">
            <span className="text-sm font-bold uppercase tracking-wider text-racing-red">
              {dict.title} &mdash; {dict.round} {race.round}
            </span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
              <div className="text-center lg:text-left">
                <h3 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                  {loc.name}
                </h3>
                <p className="mt-1 text-text-secondary">{loc.circuit}</p>
                <p className="text-sm text-text-muted">{loc.location}</p>

                <div className="mt-4 flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-8 rounded bg-surface-light px-1.5 py-0.5 text-center text-xs font-bold text-racing-orange">
                      ET
                    </span>
                    <span className="text-text-secondary">
                      {formatToET(race.sessions.race, locale)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 rounded bg-surface-light px-1.5 py-0.5 text-center text-xs font-bold text-racing-yellow">
                      BR
                    </span>
                    <span className="text-text-secondary">
                      {formatToBRT(race.sessions.race, locale)}
                    </span>
                  </div>
                </div>
              </div>

              {countdown ? (
                <div className="flex items-center gap-3">
                  <CountdownBox value={countdown.days} label={dict.days} />
                  <span className="text-2xl font-bold text-racing-red">:</span>
                  <CountdownBox value={countdown.hours} label={dict.hours} />
                  <span className="text-2xl font-bold text-racing-red">:</span>
                  <CountdownBox value={countdown.minutes} label={dict.min} />
                  <span className="text-2xl font-bold text-racing-red">:</span>
                  <CountdownBox value={countdown.seconds} label={dict.sec} />
                </div>
              ) : (
                <div className="rounded-lg bg-racing-red/10 px-6 py-3 text-center">
                  <span className="text-lg font-bold text-racing-red">
                    {dict.raceComplete}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 text-center lg:text-left">
              <Link
                href={`/${locale}/calendar`}
                className="text-sm font-medium text-racing-red transition-colors hover:text-racing-orange"
              >
                {dict.viewCalendar} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
