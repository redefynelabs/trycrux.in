"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowRightIcon } from "@/components/icons";
import { ANNOUNCEMENT } from "@/content/announcement";

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

/** The announcement above the navigation. A visitor can close it; it stays closed until the message changes. */
export function AnnouncementBar() {
  // The server and the first render show the bar; the visitor's choice is read from the browser after that.
  const closed = useSyncExternalStore(subscribe, closedNow, () => false);
  if (!ANNOUNCEMENT || closed) return null;
  return (
    <div role="region" aria-label="Announcement" className="relative bg-fg px-10 py-2 text-center text-sm text-bg">
      <p className="mx-auto max-w-4xl">
        {ANNOUNCEMENT.text}{" "}
        <Link href={ANNOUNCEMENT.href} className="group inline-flex items-center gap-1 font-semibold underline underline-offset-4">
          {ANNOUNCEMENT.cta}
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </p>
      <button
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
        className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-bg/70 transition-colors hover:bg-bg/15 hover:text-bg"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  );
}
