"use client";

import { SessionTab } from "@/lib/types";
import { clsx } from "clsx";

interface SessionTabsProps {
  tabs: { key: SessionTab; label: string; disabled: boolean }[];
  activeTab: SessionTab;
  onTabChange: (tab: SessionTab) => void;
}

export default function SessionTabs({
  tabs,
  activeTab,
  onTabChange,
}: SessionTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border pb-0 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onTabChange(tab.key)}
          disabled={tab.disabled}
          className={clsx(
            "whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all sm:px-6 sm:text-sm",
            activeTab === tab.key
              ? "border-b-2 border-racing-red text-racing-red"
              : tab.disabled
              ? "cursor-not-allowed text-text-muted/40"
              : "cursor-pointer text-text-muted hover:text-text-secondary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
