"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { DEMO } from "@/content/mei";
import { cn } from "@/lib/utils";

type Phase = "typing" | "reading" | "answer";

/** An example conversation with Mei, played on a loop: the question is typed, the data is read, the answer appears. */
export function MeiDemo() {
  const calm = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState(0);
  const scenario = DEMO[index];

  // With reduced motion, show a finished answer and let the visitor choose.
  const showPhase: Phase = calm ? "answer" : phase;
  const shown = calm ? scenario.question.length : typed;

  useEffect(() => {
    if (calm) return;
    if (phase === "typing") {
      if (typed < scenario.question.length) {
        const t = setTimeout(() => setTyped((n) => n + 1), 22);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("reading"), 450);
      return () => clearTimeout(t);
    }
    if (phase === "reading") {
      const t = setTimeout(() => setPhase("answer"), 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % DEMO.length);
      setTyped(0);
      setPhase("typing");
    }, 11000);
    return () => clearTimeout(t);
  }, [calm, phase, typed, scenario.question.length]);

  function pick(i: number) {
    setIndex(i);
    setTyped(0);
    setPhase("typing");
  }

  const rise = (n: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: calm ? 0 : 0.12 + n * 0.09, duration: 0.4, ease: "easeOut" as const } });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div role="tablist" aria-label="Example questions" className="mb-8 flex flex-wrap justify-center gap-2">
        {DEMO.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={i === index}
            onClick={() => pick(i)}
            className={cn("relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors", i === index ? "text-white" : "bg-soft text-muted ring-1 ring-line hover:text-fg")}
          >
            {i === index && <motion.span layoutId="mei-tab" className="absolute inset-0 rounded-full bg-blue-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative">{d.label}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-none bg-soft p-3 ring-1 ring-line sm:p-4">
        <div className="flex min-h-[38rem] flex-col gap-5 rounded-none bg-bg/70 p-5 ring-1 ring-line sm:p-7" aria-live="polite">
          <div className="flex justify-end">
            <p className="max-w-[88%] rounded-3xl rounded-br-md bg-blue-600 px-5 py-3 text-[15px] text-white">
              {scenario.question.slice(0, shown)}
              {showPhase === "typing" && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-white" />}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {showPhase === "reading" && (
              <motion.div key="read" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
                <span className="relative grid size-9 place-items-center rounded-full bg-bg text-brand shadow-sm ring-1 ring-line">
                  <span className="absolute inset-0 animate-ping rounded-full bg-brand/20" />
                  <SparkIcon className="relative size-4" />
                </span>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="font-medium text-brand">Mei is reading</span>
                  {scenario.reading.map((r, i) => (
                    <motion.span key={r} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.3 }} className="rounded-none bg-bg/80 px-3 py-1 text-xs font-medium text-fg shadow-xs ring-1 ring-line">{r}</motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {showPhase === "answer" && (
              <motion.div key={scenario.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-blue-600 text-white"><SparkIcon className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <motion.p {...rise(0)} className="text-[15px]">{scenario.intro}</motion.p>
                  {scenario.id === "invoice" ? (
                    <>
                    <motion.div {...rise(1)} className="mt-3 overflow-hidden rounded-none bg-bg ring-1 ring-line">
                      <div className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                        <span className="font-semibold">Draft invoice for Anita Desai</span>
                        <span className="rounded-none bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">Needs your OK</span>
                      </div>
                      <ul className="text-sm">
                        {scenario.rows.map((r, i) => (
                          <motion.li key={r[0]} {...rise(2 + i)} className="grid grid-cols-[1fr_auto_auto] gap-4 border-t border-line px-5 py-2.5"><span>{r[0]}</span><span className="text-muted">× {r[1]}</span><span className="tabular-nums">{r[2]}</span></motion.li>
                        ))}
                      </ul>
                      <motion.div {...rise(5)} className="flex items-center gap-2 border-t border-line bg-soft/60 px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white"><CheckIcon className="size-3.5" /> Create draft invoice</span>
                        <span className="px-3 py-1.5 text-sm text-muted">Dismiss</span>
                        <span className="ml-auto hidden text-xs text-muted sm:block">{scenario.note}</span>
                      </motion.div>
                    </motion.div>
                    <motion.ul {...rise(6)} className="mt-4 space-y-2 text-sm">
                      {scenario.points.map((t) => <li key={t} className="flex gap-2.5"><CheckIcon className="mt-0.5 size-4 shrink-0 text-ok" />{t}</li>)}
                    </motion.ul>
                    </>
                  ) : (
                    <>
                      <motion.div {...rise(1)} className="mt-3 overflow-x-auto rounded-none bg-bg ring-1 ring-line">
                        <table className="w-full text-sm">
                          <thead className="text-left text-xs text-muted">
                            <tr>{scenario.head.map((h, i) => <th key={h} className={cn("px-5 py-3 font-medium", i > 0 && "text-right")}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {scenario.rows.map((r, ri) => (
                              <motion.tr key={r[0]} {...rise(2 + ri)} className="border-t border-line">
                                {r.map((c, i) => <td key={i} className={cn("px-5 py-2.5", i > 0 && "text-right tabular-nums", i === 0 && "font-medium")}>{c}</td>)}
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                      <motion.ul {...rise(6)} className="mt-4 space-y-2 text-sm">
                        {scenario.points.map((t) => <li key={t} className="flex gap-2.5"><CheckIcon className="mt-0.5 size-4 shrink-0 text-ok" />{t}</li>)}
                      </motion.ul>
                      <motion.p {...rise(7)} className="mt-4 text-sm text-muted">{scenario.note}</motion.p>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-auto flex items-center gap-3 rounded-full bg-bg px-5 py-3 text-sm text-muted ring-1 ring-line">
            <SparkIcon className="size-4 text-brand" /> Ask Mei about people, projects, clients or money
            <span className="ml-auto grid size-7 place-items-center rounded-full bg-blue-600 text-white">↑</span>
          </div>
        </div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-muted">An example conversation. Figures are from the sample company.</p>
    </div>
  );
}
