"use client";

import { useEffect, useState } from "react";
import { dayLabel, monthLabel, type Entry } from "@/content/changelog";
import { cn } from "@/lib/utils";

/** The timeline down the left of the changelog: every update by date, a line that fills as you read, and the update being read marked. */
export function ChangelogNav({ entries }: { entries: Entry[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = entries.map((_, i) => document.getElementById(`u-${i}`));
    // The update whose top has most recently passed a line a little below the header is the one being read.
    const onScroll = () => {
      const line = 170;
      let current = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [entries]);

  // Keep the marked update in view when the timeline is longer than the screen.
  useEffect(() => {
    document.querySelector('[aria-current="location"]')?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <nav aria-label="Updates by date" className="max-h-[calc(100vh-10rem)] overflow-y-auto py-1 pr-3 pl-1 [scrollbar-width:thin]">
      <ol className="relative">
        {/* The rail, and the part of it already read. */}
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[0.4375rem] w-px bg-line" />
        <span aria-hidden="true" className="absolute top-3 left-[0.4375rem] w-px bg-brand transition-[height] duration-300" style={{ height: `calc((100% - 1.5rem) * ${entries.length > 1 ? active / (entries.length - 1) : 0})` }} />
        {entries.map((e, i) => {
          const on = i === active;
          const read = i < active;
          const newMonth = i === 0 || monthLabel(entries[i - 1].date) !== monthLabel(e.date);
          return (
            <li key={`${e.date}-${i}`} className="relative">
              {newMonth && <p className={cn("pl-7 text-[0.6875rem] font-semibold tracking-wider text-muted uppercase", i > 0 && "mt-5", "mb-1")}>{monthLabel(e.date)}</p>}
              <a
                href={`#u-${i}`}
                aria-current={on ? "location" : undefined}
                className={cn("group relative flex items-start gap-3 rounded-xl py-2 pr-3 pl-0 transition-colors", on ? "bg-brand-soft/70" : "hover:bg-soft")}
              >
                <span aria-hidden="true" className={cn("relative z-10 mt-1.5 ml-0 grid size-[0.9375rem] shrink-0 place-items-center rounded-full ring-4 ring-bg transition-colors", on ? "bg-brand" : read ? "bg-brand/70" : "bg-line group-hover:bg-muted/50")}>
                  {on && <span className="size-1.5 rounded-full bg-white" />}
                </span>
                <span className="min-w-0">
                  <span className={cn("block text-xs tabular-nums", on ? "font-semibold text-brand" : "text-muted")}>{dayLabel(e.date)}</span>
                  <span className={cn("block text-sm leading-snug", on ? "font-medium text-fg" : "text-muted group-hover:text-fg")}>{e.title}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
