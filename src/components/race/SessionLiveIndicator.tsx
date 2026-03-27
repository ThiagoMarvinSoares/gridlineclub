"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SessionLiveIndicator({ dict }: { dict: any }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-border bg-surface p-12">
      <div className="flex items-center gap-3">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-racing-red opacity-75" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-racing-red" />
        </span>
        <span className="animate-pulse text-2xl font-bold text-text-primary sm:text-3xl">
          {dict.sessionInProgress}
        </span>
      </div>
      <p className="mt-4 text-sm text-text-muted">
        {dict.liveRefreshNote}
      </p>
    </div>
  );
}
