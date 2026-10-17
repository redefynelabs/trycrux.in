"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { CheckIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ModuleVisual, type VisualKind } from "@/components/module-grid";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * The product in a window: a sidebar that names things the way the industry does (Patients, Jobs) and a live picture
 * of the module at work. The highlighted menu item moves on its own so the window feels in use.
 */
export function AppWindow({ nav, visual, toasts = [], className, children }: { nav: string[]; visual?: VisualKind; toasts?: string[]; className?: string; children?: ReactNode }) {
  const calm = useReducedMotion();
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => setActive((a) => (a + 1) % nav.length), 2600);
    return () => clearInterval(id);
  }, [calm, nav.length]);
  const [toast, setToast] = useState(0);
  useEffect(() => {
    if (calm || toasts.length === 0) return;
    const id = setInterval(() => setToast((t) => t + 1), 3200);
    return () => clearInterval(id);
  }, [calm, toasts.length]);
  return (
    <div className="relative">
    <div className={cn("relative overflow-hidden bg-bg shadow-[0_30px_90px_-40px_rgba(37,99,235,0.5)] ring-1 ring-line", className)} aria-hidden="true">
      <div className="flex items-center gap-1.5 border-b border-line bg-soft px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-fg/15" /><span className="size-2.5 rounded-full bg-fg/15" /><span className="size-2.5 rounded-full bg-fg/15" />
        <span className="mx-auto rounded-full bg-bg px-10 py-0.5 text-[11px] text-muted ring-1 ring-line">app.yourcompany.com</span>
      </div>
      <div className="grid grid-cols-[8.5rem_1fr] sm:grid-cols-[11rem_1fr]">
        <div className="border-r border-line bg-soft/60 p-3">
          <Logo className="mb-4 h-5 text-[1.25rem]" />
          <ul className="space-y-1">
            {nav.map((n, i) => (
              <li key={n} className="relative px-2.5 py-1.5 text-xs font-medium sm:text-sm">
                {i === active && <motion.span layoutId="aw-active" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} className="absolute inset-0 bg-brand-soft" />}
                <span className={cn("relative", i === active ? "text-brand" : "text-muted")}>{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[22rem] overflow-hidden sm:h-[26rem]">
          {visual ? <ModuleVisual kind={visual} /> : children}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
        </div>
      </div>
    </div>
      {toasts.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.p
            key={toast}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className={cn("absolute z-10 flex max-w-[16rem] items-center gap-2.5 bg-bg px-3.5 py-2.5 text-xs font-medium shadow-xl ring-1 ring-line sm:text-sm", toast % 2 === 0 ? "-bottom-5 -left-3 sm:-left-8" : "-top-4 -right-3 sm:-right-8")}
          >
            <span className="grid size-5 shrink-0 place-items-center bg-ok text-white"><CheckIcon className="size-3" /></span>
            {toasts[toast % toasts.length]}
          </motion.p>
        </AnimatePresence>
      )}
    </div>
  );
}
