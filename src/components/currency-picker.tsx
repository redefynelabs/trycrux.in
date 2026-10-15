"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Flag } from "@/components/flags";
import { track } from "@/lib/analytics";
import { CURRENCIES, CURRENCY_CODES, DEFAULT_CURRENCY, currencySnapshot, localize, pickCurrency, subscribeCurrency, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** The visitor's region (keyed by its currency). The server renders the default; the visitor's own shows once the page is running. */
export function useRegion(): CurrencyCode {
  return useSyncExternalStore(subscribeCurrency, currencySnapshot, () => DEFAULT_CURRENCY);
}

/** The currency of the visitor's region. */
export const useCurrency = useRegion;

/** Sample text fitted to the visitor's region (see localize). */
export function Local({ children }: { children: string }) {
  return <>{localize(children, useRegion())}</>;
}

/** The flag button in the header: shows the visitor's region, and opens a menu to change it. */
export function CurrencyPicker({ className }: { className?: string }) {
  const currency = useRegion();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const list = useId();

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const away = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("mousedown", away);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("mousedown", away);
    };
  }, [open]);

  function choose(c: CurrencyCode) {
    pickCurrency(c);
    setOpen(false);
    track("tab_select", { tab_group: "Region", tab_name: CURRENCIES[c].region });
  }

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={list}
        aria-label={`Region: ${CURRENCIES[currency].region}. Change region`}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-muted transition-colors hover:bg-soft hover:text-fg"
      >
        <Flag currency={currency} />
        <span>{CURRENCIES[currency].short}</span>
        <svg aria-hidden="true" viewBox="0 0 12 12" className={cn("size-3 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 4.5 6 8l3.5-3.5" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={list}
            role="listbox"
            aria-label="Region"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full right-0 z-50 mt-2 w-60 rounded-2xl bg-bg p-1.5 shadow-[0_24px_60px_-20px_rgba(30,50,120,0.35)] ring-1 ring-line"
          >
            {CURRENCY_CODES.map((c) => (
              <li key={c} role="option" aria-selected={c === currency}>
                <button type="button" onClick={() => choose(c)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-soft", c === currency && "bg-soft")}>
                  <Flag currency={c} className="h-4 w-6" />
                  <span className="flex-1 text-sm font-medium">{CURRENCIES[c].region}</span>
                  {c === currency && <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** "Prices exclude applicable taxes such as GST", with the visitor's own tax. */
export function TaxNote() {
  return <>Prices exclude applicable taxes such as {CURRENCIES[useRegion()].tax}.</>;
}
