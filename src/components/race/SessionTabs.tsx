"use client";

import { useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active tab when it changes
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const button = activeRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="flex gap-1 overflow-x-auto border-b border-border pb-0"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
    >
      <style jsx>{`div::-webkit-scrollbar { display: none; }`}</style>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          ref={tab.key === activeTab ? activeRef : undefined}
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
