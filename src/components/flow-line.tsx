"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/use-reduced-motion";

/** A week as a row of steps joined by a line that draws itself as the row scrolls into view. */
export function FlowLine({ steps }: { steps: string[] }) {
  const calm = useReducedMotion();
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute top-4 right-[10%] left-[10%] hidden h-0.5 bg-line lg:block">
        <motion.span className="block h-full origin-left bg-brand" initial={calm ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1.4, ease: "easeOut" }} />
      </div>
      <ol className="relative grid gap-4 lg:grid-flow-col lg:auto-cols-fr">
        {steps.map((s, n) => (
          <motion.li key={s} className="flex items-start gap-4 lg:flex-col lg:items-center lg:text-center" initial={calm ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: n * 0.15 }}>
            <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-semibold text-white ring-4 ring-bg">{n + 1}</span>
            <span className="pt-1 text-sm lg:pt-0 lg:text-base">{s}</span>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
