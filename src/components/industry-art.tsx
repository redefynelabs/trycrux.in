"use client";

import { motion } from "motion/react";
import { CrmIcon, FinanceIcon, InventoryIcon, PeopleIcon, ProjectsIcon } from "@/components/icons";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof PeopleIcon> = {
  "software-and-it": ProjectsIcon,
  agencies: CrmIcon,
  clinics: PeopleIcon,
  "trades-and-field-service": InventoryIcon,
  "distribution-and-retail": InventoryIcon,
  "professional-services": FinanceIcon,
};

/** Where each word sits (percent of the panel, centre of the chip). Kept apart so they never collide. */
const SPOTS = [
  { x: 18, y: 22 }, { x: 80, y: 20 }, { x: 84, y: 56 }, { x: 16, y: 66 }, { x: 52, y: 88 },
];

/**
 * An illustration for an industry: the trade's icon in the middle, rings pulsing out from it, and the trade's own words
 * joined to it by lines that carry a moving dot, so it reads as one system connected to the things the trade works with.
 */
export function IndustryArt({ slug, words, className }: { slug: string; words: string[]; className?: string }) {
  const calm = useReducedMotion();
  const Icon = ICONS[slug] ?? ProjectsIcon;
  const shown = words.slice(0, SPOTS.length);
  return (
    <div aria-hidden="true" className={cn("relative isolate overflow-hidden bg-gradient-to-br from-brand-soft via-bg to-soft ring-1 ring-line", className)}>
      <div className="hero-grid absolute inset-0 -z-10 opacity-40" />
      <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {shown.map((w, i) => (
          <g key={w}>
            <line x1="50" y1="50" x2={SPOTS[i].x} y2={SPOTS[i].y} stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="50" y1="50" x2={SPOTS[i].x} y2={SPOTS[i].y} stroke="var(--brand)" strokeWidth="2" strokeDasharray="4 20" vectorEffect="non-scaling-stroke" className="animate-[flow_2.4s_linear_infinite] motion-reduce:animate-none" style={{ animationDelay: `${i * -0.5}s` }} />
          </g>
        ))}
      </svg>
      {!calm && [0, 1].map((n) => (
        <motion.span key={n} className="absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 border border-brand/40" initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 3.4, opacity: 0 }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: n * 1.7 }} />
      ))}
      <span className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center bg-brand text-4xl text-white shadow-lg"><Icon /></span>
      {shown.map((w, i) => (
        <motion.span
          key={w}
          className="absolute -translate-x-1/2 -translate-y-1/2 bg-bg px-3 py-1 text-xs font-medium whitespace-nowrap shadow-sm ring-1 ring-line"
          style={{ left: `${SPOTS[i].x}%`, top: `${SPOTS[i].y}%` }}
          animate={calm ? undefined : { y: [0, i % 2 ? 4 : -4, 0] }}
          transition={{ duration: 3.6 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}
