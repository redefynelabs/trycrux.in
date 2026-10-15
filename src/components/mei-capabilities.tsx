"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { Marquee } from "@/components/magicui/marquee";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { CAPABILITIES } from "@/content/mei";
import { cn } from "@/lib/utils";

/** Counts 0..n-1 forever, one step every ms; stays at 0 when motion is reduced. */
function useCycle(n: number, ms: number) {
  const calm = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [calm, n, ms]);
  return calm ? n - 1 : i;
}

const QA = [
  ["Who was late most often in September?", "Ravi Menon, 6 times, 22 minutes on average."],
  ["What is our profit this quarter?", "₹18.4 lakh, up 12% on last quarter."],
  ["Which projects are over budget?", "2 of 14: Website redesign and ERP rollout."],
  ["What does Granite Builders owe?", "₹1,02,660 across 3 open invoices."],
] as const;

/** A question types itself, Mei thinks for a moment, then the answer streams in. */
function Typing() {
  const calm = useReducedMotion();
  const [q, setQ] = useState(0);
  const [n, setN] = useState(0); // characters typed, then answered
  const [question, answer] = QA[q];
  const asked = n >= question.length;
  const thinking = asked && n < question.length + 14;
  const said = Math.max(0, n - question.length - 14);
  const done = said >= answer.length;
  useEffect(() => {
    if (calm) return;
    if (done) {
      const t = setTimeout(() => { setQ((v) => (v + 1) % QA.length); setN(0); }, 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN(n + 1), !asked ? 36 : thinking ? 55 : 22);
    return () => clearTimeout(t);
  }, [calm, n, asked, thinking, done]);
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6">
      <div className="ml-auto max-w-[88%] rounded-2xl rounded-br-md bg-bg px-4 py-2.5 text-[15px] shadow-xs ring-1 ring-line">
        {calm ? question : question.slice(0, n)}
        {!calm && !asked && <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-brand" />}
      </div>
      <div className="flex min-h-12 items-start gap-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-sm text-white"><SparkIcon /></span>
        <div className="rounded-2xl rounded-tl-md bg-brand-soft px-4 py-2.5 text-[15px] text-fg">
          {calm ? answer : thinking ? (
            <span className="flex h-6 items-center gap-1" aria-label="Mei is thinking">
              {[0, 1, 2].map((d) => <motion.span key={d} className="size-1.5 rounded-full bg-brand" animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.15 }} />)}
            </span>
          ) : asked ? answer.slice(0, said) : <span className="text-muted">Mei answers from your data</span>}
        </div>
      </div>
    </div>
  );
}

const REPORTS = ["Attendance · CSV", "Profit and loss · PDF", "Receivables · CSV", "Tax summary · CSV", "Project status · PDF", "Timesheet hours · CSV"];

function Reports() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      {[0, 1].map((row) => (
        <Marquee key={row} reverse={row === 1} repeat={3} className="[--duration:22s] [--gap:0.6rem]">
          {(row ? [...REPORTS].reverse() : REPORTS).map((r) => (
            <span key={r} className="whitespace-nowrap rounded-full bg-bg px-3.5 py-1.5 text-xs font-medium shadow-xs ring-1 ring-line">{r}</span>
          ))}
        </Marquee>
      ))}
    </div>
  );
}

function Confirm() {
  const step = useCycle(3, 1700);
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full rounded-2xl bg-bg p-4 ring-1 ring-line">
        <p className="text-xs text-muted">Draft invoice</p>
        <p className="mt-0.5 text-sm font-semibold">Anita Desai · ₹1,02,660</p>
        <div className="mt-3 flex items-center gap-2">
          <AnimatePresence mode="wait" initial={false}>
            {step === 2 ? (
              <motion.span key="ok" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-3.5 py-1.5 text-xs font-semibold text-ok"><CheckIcon className="size-3.5" /> Created as draft</motion.span>
            ) : (
              <motion.span key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn("rounded-full bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-transform", step === 1 && "scale-95 ring-4 ring-blue-600/20")}>Confirm</motion.span>
            )}
          </AnimatePresence>
          {step !== 2 && <span className="text-xs text-muted">Edit first</span>}
        </div>
      </div>
    </div>
  );
}

const PACK = [
  { name: "Sales register", kind: "CSV", tone: "bg-emerald-500" },
  { name: "Tax summary", kind: "CSV", tone: "bg-emerald-500" },
  { name: "INV-0004", kind: "PDF", tone: "bg-rose-500" },
  { name: "INV-0005", kind: "PDF", tone: "bg-rose-500" },
  { name: "Receipt, travel", kind: "JPG", tone: "bg-amber-500" },
] as const;

/** Files line up one by one, drop into the zip as it fills, and the pack turns ready. */
function TaxPack() {
  const step = useCycle(PACK.length + 3, 800);
  const packed = Math.min(step, PACK.length);
  const ready = step >= PACK.length + 1;
  return (
    <div className="flex h-full items-center gap-5 px-6 pb-4">
      <ul className="flex-1 space-y-1.5">
        {PACK.map((f, i) => (
          <motion.li key={f.name} animate={{ opacity: step > i && !ready ? 1 : ready ? 0.55 : 0.3, x: step === i + 1 ? 4 : 0 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} className="flex items-center gap-2.5 rounded-xl bg-bg px-2.5 py-1.5 text-xs font-medium shadow-xs ring-1 ring-line">
            <span className={cn("grid h-5 w-8 place-items-center rounded-md text-[9px] font-bold text-white", f.tone)}>{f.kind}</span>
            <span className="flex-1 truncate">{f.name}</span>
            {step > i && <CheckIcon className="size-3.5 text-ok" />}
          </motion.li>
        ))}
      </ul>
      <motion.div animate={{ y: ready ? -4 : 0, scale: ready ? 1.04 : 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className={cn("relative w-32 shrink-0 overflow-hidden rounded-2xl p-4 text-white shadow-lg transition-colors duration-500", ready ? "bg-ok" : "bg-brand")}>
        <p className="text-sm font-semibold">tax-pack.zip</p>
        <p className="mt-0.5 text-[11px] opacity-85">{ready ? "Ready to download" : `${packed} of ${PACK.length} files`}</p>
        <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-white/25"><motion.span className="block h-full rounded-full bg-white" animate={{ width: `${(packed / PACK.length) * 100}%` }} transition={{ type: "spring", stiffness: 140, damping: 20 }} /></span>
        <AnimatePresence>
          {ready && <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-white text-ok"><CheckIcon className="size-3" /></motion.span>}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

const PEOPLE = [
  { name: "Ananya Rao", on: true },
  { name: "Daniel Brooks", on: true },
  { name: "Sofia Alvarez", on: false },
  { name: "Kenji Mori", on: true },
  { name: "Amara Okafor", on: false },
] as const;

/** Each person is looked at in turn: the ring and the switch show whether Mei is on for them. */
function Access() {
  const step = useCycle(PEOPLE.length, 1400);
  const who = PEOPLE[step];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 pb-4">
      <div className="flex gap-2.5">
        {PEOPLE.map((f, i) => (
          <motion.span key={f.name} animate={{ scale: i === step ? 1.18 : 1, y: i === step ? -3 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className={cn("rounded-full ring-2 ring-offset-2 ring-offset-bg transition-all duration-300", i === step ? (f.on ? "ring-ok" : "ring-warn") : "opacity-50 ring-transparent")}>
            <Avatar name={f.name} className="size-11 text-sm" />
          </motion.span>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-full bg-bg py-1.5 pr-4 pl-2 text-xs font-medium shadow-xs ring-1 ring-line">
        <span className={cn("relative h-5 w-9 rounded-full transition-colors duration-300", who.on ? "bg-ok" : "bg-line")}>
          <motion.span className="absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow-xs" animate={{ x: who.on ? 16 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 28 }} />
        </span>
        <span>{who.name.split(" ")[0]}: {who.on ? "Mei is on" : "Ask your administrator"}</span>
      </div>
    </div>
  );
}

const BARS = [38, 72, 54, 90, 63, 46, 80, 58, 94, 67];

/** A rolling window of days: every beat the chart slides one day to the left and a new bar grows in on the right. */
function Usage() {
  const calm = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => setT((v) => v + 1), 1300);
    return () => clearInterval(id);
  }, [calm]);
  const shown = Array.from({ length: 7 }, (_, i) => BARS[(t + i) % BARS.length]);
  return (
    <div className="flex h-full flex-col justify-end gap-3 px-6 pb-6">
      <div className="flex items-end justify-between">
        <p className="text-xs text-muted">Questions per day</p>
        <p className="text-xs font-semibold tabular-nums text-brand">{shown[6] * 2} today</p>
      </div>
      <div className="flex h-24 items-end gap-2">
        {shown.map((b, i) => (
          <motion.span key={(t + i) % BARS.length} layout initial={{ height: 0, opacity: 0 }} animate={{ height: `${b}%`, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} className={cn("flex-1 rounded-t-md", i === 6 ? "bg-brand" : "bg-brand/25")} />
        ))}
      </div>
    </div>
  );
}

const VISUAL: Record<string, { node: ReactNode; span: string }> = {
  "Ask in plain words": { node: <Typing />, span: "sm:col-span-2" },
  "Reports on demand": { node: <Reports />, span: "" },
  "Acts only with your OK": { node: <Confirm />, span: "" },
  "You choose who gets it": { node: <Access />, span: "" },
  "See who used it and how much": { node: <Usage />, span: "" },
  "A tax pack with only what is needed": { node: <TaxPack />, span: "sm:col-span-2" },
};
const ORDER = ["Ask in plain words", "Reports on demand", "Acts only with your OK", "You choose who gets it", "See who used it and how much", "A tax pack with only what is needed"];

/** What Mei does, as six small live pictures in a bento. */
export function MeiCapabilities() {
  return (
    <div className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
      {ORDER.map((title) => {
        const c = CAPABILITIES.find((x) => x.title === title)!;
        const v = VISUAL[title];
        return (
          <article key={title} className={cn("flex flex-col bg-bg", v.span)}>
            <div aria-hidden="true" className="relative h-60 overflow-hidden bg-gradient-to-b from-soft/50 to-bg">
              {v.node}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
            </div>
            <div className="px-7 pt-3 pb-7">
              <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
              <p className="mt-2 text-muted">{c.text}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
