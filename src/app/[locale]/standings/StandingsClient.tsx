"use client";

import { useEffect, useState } from "react";
import { DriverStanding, ConstructorStanding } from "@/lib/types";
import DriverStandings from "@/components/standings/DriverStandings";
import ConstructorStandings from "@/components/standings/ConstructorStandings";
import { computeStandings } from "@/lib/openf1";
import { clsx } from "clsx";

type Tab = "drivers" | "constructors";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StandingsClient({ dict }: { dict: any }) {
  const [tab, setTab] = useState<Tab>("drivers");
  const [drivers, setDrivers] = useState<DriverStanding[]>([]);
  const [constructors, setConstructors] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    computeStandings(2026)
      .then(({ drivers, constructors }) => {
        setDrivers(drivers);
        setConstructors(constructors);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || dict.failedToLoad);
        setLoading(false);
      });
  }, [dict.failedToLoad]);

  function LoadingSkeleton() {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-light" />
            <div className="hidden h-12 w-12 animate-pulse rounded-full bg-surface-light sm:block" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-surface-light" />
              <div className="h-4 w-24 animate-pulse rounded bg-surface-light" />
            </div>
            <div className="h-8 w-16 animate-pulse rounded bg-surface-light" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab("drivers")} className={clsx("rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all", tab === "drivers" ? "bg-racing-red text-white" : "bg-surface text-text-secondary hover:text-text-primary")}>{dict.drivers}</button>
        <button onClick={() => setTab("constructors")} className={clsx("rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all", tab === "constructors" ? "bg-racing-red text-white" : "bg-surface text-text-secondary hover:text-text-primary")}>{dict.constructors}</button>
      </div>
      {loading ? <LoadingSkeleton /> : error ? (
        <div className="rounded-xl border border-racing-red/30 bg-racing-red/10 p-8 text-center">
          <p className="text-lg font-bold text-racing-red">{dict.failedToLoad}</p>
          <p className="mt-2 text-sm text-text-secondary">{error}</p>
        </div>
      ) : tab === "drivers" ? (
        <DriverStandings standings={drivers} dict={dict} />
      ) : (
        <ConstructorStandings standings={constructors} dict={dict} />
      )}
    </div>
  );
}
