"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ANNOUNCEMENT } from "@/content/announcement";
import { cn } from "@/lib/utils";

const KEY = "announcement-closed";
const listeners = new Set<() => void>();
// Remembers a close for this visit even when the browser will not store it.
let closedThisVisit = false;

function closedNow(): boolean {
  if (closedThisVisit) return true;
  try {
    return !!ANNOUNCEMENT && localStorage.getItem(KEY) === ANNOUNCEMENT.id;
  } catch {
    return false; // storage is unavailable: the bar simply shows
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function Message({ focusable = true }: { focusable?: boolean }) {
  return (
    <>
      {ANNOUNCEMENT!.text}{" "}
      <Link href={ANNOUNCEMENT!.href} tabIndex={focusable ? undefined : -1} data-track="announcement_click" data-track-announcement={ANNOUNCEMENT!.id} className="group/link inline-flex items-center gap-1 font-semibold underline underline-offset-4">
        {ANNOUNCEMENT!.cta}
        <ArrowRightIcon className="size-3.5 transition-transform group-hover/link:translate-x-0.5" />
      </Link>
    </>
  );
}

/** The announcement above the navigation. A visitor can close it; it stays closed until the message changes. */
export function AnnouncementBar() {
  // The server and the first render show the bar; the visitor's choice is read from the browser after that.
  const closed = useSyncExternalStore(subscribe, closedNow, () => false);
  if (!ANNOUNCEMENT || closed) return null;
  return (
    <div role="region" aria-label="Announcement" data-announcement className="relative bg-fg py-2 pr-10 text-sm text-bg sm:px-10 sm:text-center">
      {/* One line. On phones it scrolls from right to left, with a second copy so it loops without a gap; it stays still
          for people who ask for less motion. */}
      <div className="group flex overflow-hidden whitespace-nowrap [--duration:22s] [--gap:3rem] sm:justify-center sm:overflow-visible sm:whitespace-normal">
        {[0, 1].map((copy) => (
          <p key={copy} aria-hidden={copy === 1 || undefined} className={cn("flex shrink-0 animate-marquee items-center gap-1 pl-(--gap) group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:block sm:max-w-4xl sm:shrink sm:animate-none sm:pl-0", copy === 1 && "sm:hidden")}>
            <Message focusable={copy === 0} />
          </p>
        ))}
      </div>
      <button
        data-track="announcement_close"
        data-track-announcement={ANNOUNCEMENT.id}
        type="button"
        aria-label="Close the announcement"
        onClick={() => {
          closedThisVisit = true;
          try {
            localStorage.setItem(KEY, ANNOUNCEMENT!.id);
          } catch {
            /* ignore */
          }
          listeners.forEach((cb) => cb());
        }}
        className="absolute top-1/2 right-1.5 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-fg text-bg/70 sm:right-3 transition-colors hover:bg-bg/15 hover:text-bg"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}
