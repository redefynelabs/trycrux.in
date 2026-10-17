"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { useReducedMotion } from "@/components/use-reduced-motion";
import type { SceneStage } from "@/content/industries";
import { cn } from "@/lib/utils";

/**
 * One piece of work travelling through the system, in the industry's own words. Each stage is a card; the current one
 * opens to show what happened and what changed, earlier ones tick off, and a marker slides down the line between them.
 */
export function WorkflowScene({ stages, className }: { stages: SceneStage[]; className?: string }) {
  const calm = useReducedMotion();
  const [at, setAt] = useState(0);
  useEffect(() => {
    if (calm) return;
    // Hold a little longer on the last stage, then start the next piece of work.
    const id = setTimeout(() => setAt((a) => (a + 1) % (stages.length + 1)), at === stages.length - 1 ? 3200 : 2300);
    return () => clearTimeout(id);
  }, [at, calm, stages.length]);
  const done = at >= stages.length;
  const current = Math.min(at, stages.length - 1);
  return (
    <div className={cn("relative overflow-hidden bg-bg shadow-[0_30px_90px_-40px_rgba(37,99,235,0.5)] ring-1 ring-line", className)} aria-hidden="true">
      <div className="flex items-center justify-between border-b border-line bg-soft px-5 py-3">
        <Logo className="h-5 text-[1.25rem]" />
        <span className="flex items-center gap-2 text-xs font-medium text-muted">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-ok/60 motion-reduce:animate-none" /><span className="relative inline-flex size-2 rounded-full bg-ok" /></span>
          {done ? "Done, next one starting" : `Step ${current + 1} of ${stages.length}`}
        </span>
      </div>
      <ol className="relative px-5 py-5">
        <span className="absolute top-8 bottom-8 left-[2.15rem] w-px bg-line" />
        <motion.span className="absolute top-8 left-[2.15rem] w-px origin-top bg-brand" animate={{ height: `calc((100% - 4rem) * ${done ? 1 : current / (stages.length - 1)})` }} transition={{ duration: 0.7, ease: "easeInOut" }} />
        {stages.map((s, i) => {
          const state = done || i < current ? "done" : i === current ? "now" : "next";
          return (
            <li key={s.stage} className="relative flex gap-4 py-1.5">
              <motion.span
                className={cn("relative z-10 mt-2 grid size-6 shrink-0 place-items-center text-[11px] font-semibold ring-4 ring-bg", state === "done" ? "bg-ok text-white" : state === "now" ? "bg-brand text-white" : "bg-soft text-muted ring-bg")}
                animate={state === "now" ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                {state === "done" ? <CheckIcon className="size-3.5" /> : i + 1}
              </motion.span>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                className={cn("min-w-0 flex-1 px-4 py-2.5 ring-1", state === "now" ? "bg-bg shadow-md ring-brand/40" : state === "done" ? "bg-soft/60 ring-line" : "bg-soft/40 opacity-60 ring-line")}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold tracking-wide text-muted uppercase">{s.stage}</p>
                  {state === "done" && <span className="text-[11px] font-medium text-ok">Done</span>}
                </div>
                <p className="mt-0.5 text-sm font-semibold">{s.title}</p>
                <AnimatePresence initial={false}>
                  {state === "now" && (
                    <motion.div key="open" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                      <p className="mt-1 text-sm text-muted">{s.detail}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"><CheckIcon className="size-3" />{s.result}</p>
                      <span className="mt-3 block h-0.5 bg-line"><motion.span key={at} className="block h-full origin-left bg-brand" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: at === stages.length - 1 ? 3.2 : 2.3, ease: "linear" }} /></span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
