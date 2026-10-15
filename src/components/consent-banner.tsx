"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { buttonClass } from "@/components/buttons";
import { track } from "@/lib/analytics";
import { CHANGE_EVENT, OPEN_EVENT, applyConsent, consentFirst, currentConsent, readConsent, saveConsent, type Consent } from "@/lib/consent";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type Choice = Pick<Consent, "analytics" | "recordings">;

/** Loads Microsoft Clarity once recordings are allowed. Its tag is not in GTM, so nothing records before consent. */
function loadClarity() {
  const id = SITE.clarityId;
  if (!id || id === "off" || document.getElementById("clarity-tag")) return;
  const w = window as unknown as { clarity?: { (...a: unknown[]): void; q?: unknown[] } };
  w.clarity = w.clarity || Object.assign((...a: unknown[]) => (w.clarity!.q = w.clarity!.q || []).push(a), { q: [] as unknown[] });
  const s = document.createElement("script");
  s.id = "clarity-tag";
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${id}`;
  document.head.appendChild(s);
}

function Toggle({ label, text, checked, onChange, locked }: { label: string; text: string; checked: boolean; onChange?: (v: boolean) => void; locked?: boolean }) {
  return (
    <label className={cn("flex items-start justify-between gap-4 rounded-2xl p-4 ring-1 ring-line", locked ? "bg-soft" : "cursor-pointer bg-bg")}>
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-muted">{text}</span>
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} disabled={locked} onChange={(e) => onChange?.(e.target.checked)} />
        <span aria-hidden="true" className={cn("h-6 w-11 rounded-full transition-colors", checked ? "bg-brand" : "bg-line", locked && "opacity-60")} />
        <span aria-hidden="true" className={cn("absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform", checked && "translate-x-5")} />
        <span aria-hidden="true" className="absolute -inset-1 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-brand" />
      </span>
    </label>
  );
}

/**
 * The cookie banner and settings. Visitors where consent is required first see the banner until they choose; everyone can
 * reopen it from "Cookie settings" in the footer. Accept and reject are equally easy, and a choice lasts six months.
 */
/** Whether this visitor still has to choose: consent-first region and nothing saved. The server says no. */
function useNeedsChoice(): boolean {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener(CHANGE_EVENT, cb);
      return () => window.removeEventListener(CHANGE_EVENT, cb);
    },
    () => !readConsent() && consentFirst(),
    () => false,
  );
}

export function ConsentBanner() {
  const needsChoice = useNeedsChoice();
  const [reopened, setReopened] = useState(false);
  const [custom, setCustom] = useState(false);
  const [choice, setChoice] = useState<Choice>({ analytics: false, recordings: false });

  useEffect(() => {
    // Apply what is in force on this page view (the boot script already told Google; this tells Clarity).
    const now = currentConsent();
    applyConsent(now);
    if (now.recordings) loadClarity();
    const reopen = () => {
      setChoice(currentConsent());
      setCustom(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const open = reopened || needsChoice;

  function decide(c: Choice, how: string) {
    saveConsent(c);
    if (c.recordings) loadClarity();
    setChoice(c);
    setReopened(false);
    setCustom(false);
    track("consent_update", { consent_analytics: c.analytics, consent_recordings: c.recordings, consent_method: how });
  }

  if (!open) return null;
  return (
    <div role="dialog" aria-modal="false" aria-labelledby="consent-title" className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-104">
      <div className="rounded-3xl bg-bg p-5 shadow-[0_24px_60px_-20px_rgba(30,50,120,0.45)] ring-1 ring-line sm:p-6">
        <p id="consent-title" className="font-display text-lg font-semibold">Cookies on {SITE.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We would like to use cookies to understand how the site is used (Google Analytics) and to see where pages are confusing (Microsoft Clarity recordings). They are off until you allow them. See our{" "}
          <Link href="/legal/privacy" className="font-medium text-fg underline underline-offset-2">privacy notice</Link>.
        </p>
        {custom && (
          <div className="mt-4 space-y-2">
            <Toggle label="Strictly necessary" text="The bot check on our forms and remembering this choice. Always on." checked locked />
            <Toggle label="Analytics" text="Google Analytics: visits, pages and which buttons are used. No form contents." checked={choice.analytics} onChange={(v) => setChoice((c) => ({ ...c, analytics: v }))} />
            <Toggle label="Session recordings" text="Microsoft Clarity: heatmaps and recordings of clicks and scrolls, with typed text hidden." checked={choice.recordings} onChange={(v) => setChoice((c) => ({ ...c, recordings: v }))} />
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => decide({ analytics: false, recordings: false }, "reject_all")} className={buttonClass("outline", "md")}>Reject all</button>
          <button type="button" onClick={() => decide({ analytics: true, recordings: true }, "accept_all")} className={buttonClass("brand", "md")}>Accept all</button>
          {custom ? (
            <button type="button" onClick={() => decide(choice, "custom")} className={buttonClass("ghost", "md", "col-span-2")}>Save my choices</button>
          ) : (
            <button type="button" onClick={() => { setChoice(currentConsent()); setCustom(true); }} className={buttonClass("ghost", "md", "col-span-2")}>Customize</button>
          )}
        </div>
      </div>
    </div>
  );
}

/** "Cookie settings" in the footer: reopens the choices. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}
