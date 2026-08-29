"use client";

import { useEffect, useState } from "react";
import { Zap, Eye, Send, Sparkles } from "lucide-react";

const LIVE_EVENTS = [
  {
    type: "boost",
    text: "Alex R. claimed #1 Spotlight in AI",
    amount: "$50",
    time: "2m ago",
  },
  {
    type: "view",
    text: "Seed-stage AI founder viewed 4 profiles in Engineering",
    time: "4m ago",
  },
  {
    type: "boost",
    text: "Marcus V. claimed #1 Spotlight in Product Design",
    amount: "$30",
    time: "7m ago",
  },
  {
    type: "relay",
    text: "Direct opportunity relayed to Senior Distributed Systems Builder",
    time: "11m ago",
  },
  {
    type: "boost",
    text: "Elena P. claimed #2 Spotlight in Software Engineering",
    amount: "$25",
    time: "14m ago",
  },
];

export function MarketTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const event = LIVE_EVENTS[index];

  return (
    <div className="w-full max-w-[860px] mx-auto px-4 py-2">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xs text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[var(--color-lime)]/20 border border-[var(--color-lime-dark)]/30 text-[var(--color-ink)] flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime-ink)] animate-ping" />
            <span className="mono text-[10px] font-black uppercase tracking-wider">Live</span>
          </div>

          <div className="flex items-center gap-1.5 truncate text-[var(--color-ink)] font-medium">
            {event.type === "boost" && <Zap className="w-3.5 h-3.5 text-[var(--color-ink)] flex-shrink-0" />}
            {event.type === "view" && <Eye className="w-3.5 h-3.5 text-[var(--color-muted)] flex-shrink-0" />}
            {event.type === "relay" && <Send className="w-3.5 h-3.5 text-[var(--color-muted)] flex-shrink-0" />}
            <span className="truncate">{event.text}</span>
            {event.amount && (
              <span className="mono font-bold text-[var(--color-ink)] px-1.5 py-0.2 rounded bg-[var(--color-warm)]">
                {event.amount}
              </span>
            )}
          </div>
        </div>

        <div className="mono text-[10px] text-[var(--color-muted)] flex-shrink-0">
          {event.time}
        </div>
      </div>
    </div>
  );
}
