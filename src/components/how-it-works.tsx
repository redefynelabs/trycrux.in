"use client";

import { useRegion } from "@/components/currency-picker";
import { CURRENCIES, fromInr } from "@/lib/currency";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { CheckIcon, CloudIcon, CrmIcon, FinanceIcon, PeopleIcon, ProjectsIcon, ServerIcon } from "@/components/icons";
import { STEPS } from "@/content/steps";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

const STEP_MS = 7500;

/** Counts 0..max once, one step every ms; jumps to the end when motion is reduced. */
function useStages(max: number, ms: number, calm: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (calm || n >= max) return;
    const id = setTimeout(() => setN((v) => v + 1), ms);
    return () => clearTimeout(id);
  }, [n, max, ms, calm]);
  return calm ? max : n;
}

function Spinner() {
  return <span aria-hidden="true" className="size-4 animate-spin border-2 border-brand/25 border-t-brand motion-reduce:animate-none" style={{ borderRadius: 0 }} />;
}

function Tick({ tone = "ok" }: { tone?: "ok" | "warn" }) {
  return (
    <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 500, damping: 22 }} className={cn("grid size-5 place-items-center", tone === "ok" ? "bg-ok text-white" : "bg-warn text-white")}>
      <CheckIcon className="size-3" />
    </motion.span>
  );
}

function Window({ title, step, children }: { title: string; step: number; children: ReactNode }) {
  return (
    <div className="flex h-full flex-col bg-bg ring-1 ring-line">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3">
        <span aria-hidden="true" className="size-2 bg-brand" />
        <span className="text-xs font-semibold">{title}</span>
        <span className="ml-auto text-xs text-muted tabular-nums">Step {step} of {STEPS.length}</span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">{children}</div>
    </div>
  );
}

/** Step 1: a demo being made, line by line, then ready. */
function DemoLaunch({ calm }: { calm: boolean }) {
  const lines = ["Creating your private copy", "Loading the sample company", "Opening your sign-in"];
  const stage = useStages(lines.length, 1000, calm);
  const ready = stage >= lines.length;
  return (
    <Window title="Starting your demo" step={1}>
      <ul className="space-y-4">
        {lines.map((l, i) => (
          <li key={l} className={cn("flex items-center gap-3 text-sm transition-opacity duration-300", i > stage && "opacity-30")}>
            <span className="grid size-5 place-items-center">{i < stage ? <Tick /> : i === stage ? <Spinner /> : <span className="size-1.5 bg-line" />}</span>
            <span className={cn(i === stage && "font-medium")}>{l}</span>
            {i < stage && <span className="ml-auto text-xs text-muted tabular-nums">{(0.8 + i * 1.3).toFixed(1)}s</span>}
          </li>
        ))}
      </ul>
      <div className="mt-8 h-1.5 bg-soft">
        <motion.div className="h-full bg-brand" animate={{ width: `${Math.min(stage / lines.length, 1) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
      <div className="mt-6 h-[5.5rem]">
        <AnimatePresence>
          {ready && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="flex items-center justify-between gap-3 bg-brand-soft px-5 py-4 ring-1 ring-brand/30">
              <div className="flex items-center gap-3">
                <Tick />
                <div>
                  <p className="text-sm font-semibold text-brand">Your demo is ready</p>
                  <p className="text-xs text-muted">Signed in as the administrator · lasts one hour</p>
                </div>
              </div>
              <motion.span animate={calm ? undefined : { scale: [1, 1, 0.94, 1] }} transition={{ duration: 1.2, delay: 1.2, repeat: Infinity, repeatDelay: 2.5 }} className="bg-accent px-4 py-1.5 text-xs font-semibold text-white">Open</motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Window>
  );
}

/** Step 2: a cursor moves between the licence terms and picks one. */
function ChooseHosting({ calm }: { calm: boolean }) {
  const [at, setAt] = useState(2);
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => setAt((v) => (v + 1) % 3), 2600);
    return () => clearInterval(id);
  }, [calm]);
  const options = [
    { name: "1 year", text: "Use it for a year, updates included.", Icon: CloudIcon, facts: ["Cheapest to start", "Updates for the year", "Renew when it ends"] },
    { name: "2 years", text: "Two years at a lower yearly cost.", Icon: ServerIcon, facts: ["Lower yearly cost", "Updates for both years", "Renew when it ends"] },
    { name: "Lifetime", text: "Pay once, keep it. The data never leaves you.", Icon: ServerIcon, facts: ["Pay once", "Runs on your server", "One year of updates"] },
  ];
  return (
    <Window title="Choose your licence" step={2}>
      <div className="relative">
        <div className="grid gap-4 sm:grid-cols-3">
          {options.map(({ name, text, Icon }, i) => {
            const on = at === i;
            return (
              <div key={name} className={cn("relative p-5 ring-1 transition-all duration-500", on ? "bg-bg ring-2 ring-brand" : "bg-soft/60 opacity-60 ring-line")}>
                <span className="grid size-10 place-items-center bg-brand-soft text-lg text-brand"><Icon /></span>
                <p className="mt-4 font-semibold">{name}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
                <span className={cn("absolute top-4 right-4 grid size-5 place-items-center ring-1 transition-colors duration-300", on ? "bg-brand text-white ring-brand" : "bg-bg ring-line")}>{on && <CheckIcon className="size-3" />}</span>
              </div>
            );
          })}
        </div>
        {!calm && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute z-10" animate={{ left: `${16 + at * 33}%`, top: "66%" }} transition={{ type: "spring", stiffness: 120, damping: 18 }}>
            <svg viewBox="0 0 24 24" className="size-6 drop-shadow" fill="#0f172a" stroke="#fff" strokeWidth="1.5"><path d="M5 3l14 7-6 2-2 6z" /></svg>
            <motion.span key={at} className="absolute -top-2 -left-2 size-10 border-2 border-brand" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.2], opacity: [0.8, 0] }} transition={{ duration: 0.7, delay: 0.5 }} />
          </motion.div>
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={at} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="flex flex-wrap gap-2">
            {options[at].facts.map((f) => <li key={f} className="flex items-center gap-1.5 bg-soft px-3 py-1.5 text-xs font-medium ring-1 ring-line"><CheckIcon className="size-3 text-ok" />{f}</li>)}
          </motion.ul>
        </AnimatePresence>
      </div>
    </Window>
  );
}

const ROWS = [
  ["Cedar Wellness", "Mei Lin", "New", ""],
  ["Lakeview Hotels", "Hannah Cole", "Contacted", ""],
  ["Granite Builders", "Vikram Rao", "Qualified", "Fixed phone number"],
  ["Nova Pharmacies", "Isha Kapoor", "Proposal", ""],
  ["Summit Fitness", "Noah Brooks", "New", ""],
];

/** Step 3: a spreadsheet checked row by row before anything is imported. */
function ImportData({ calm }: { calm: boolean }) {
  const stage = useStages(ROWS.length, 850, calm);
  const done = stage >= ROWS.length;
  return (
    <Window title="leads.csv, checked before it is imported" step={3}>
      <div className="relative overflow-hidden ring-1 ring-line">
        <div className="grid grid-cols-[1.4fr_1fr_0.9fr_7.5rem] gap-3 bg-soft px-4 py-2 text-[11px] font-medium text-muted"><span>Company</span><span>Contact</span><span>Stage</span><span>Check</span></div>
        <ul className="divide-y divide-line">
          {ROWS.map((r, i) => (
            <li key={r[0]} className={cn("grid grid-cols-[1.4fr_1fr_0.9fr_7.5rem] items-center gap-3 px-4 py-3 text-sm transition-colors duration-300", i === stage && "bg-brand-soft/60")}>
              <span className="truncate font-medium">{r[0]}</span><span className="truncate text-muted">{r[1]}</span><span className="text-muted">{r[2]}</span>
              <span className="flex items-center gap-2 text-xs">
                {i < stage ? <><Tick tone={r[3] ? "warn" : "ok"} /><span className={r[3] ? "text-warn" : "text-ok"}>{r[3] ? "Fixed" : "Valid"}</span></> : i === stage ? <><Spinner /><span className="text-muted">Checking</span></> : <span className="text-muted/60">Waiting</span>}
              </span>
            </li>
          ))}
        </ul>
        {!done && !calm && <motion.span aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-px bg-brand" initial={{ top: "12%" }} animate={{ top: `${12 + ((stage + 0.5) / ROWS.length) * 88}%` }} transition={{ duration: 0.6 }} />}
      </div>
      <div className="mt-5 flex min-h-10 items-center justify-between gap-3">
        <p className="text-sm"><span className="font-semibold text-ok tabular-nums">{Math.min(stage, ROWS.length)} of {ROWS.length} rows valid.</span> <span className="text-muted">Nothing is imported until you confirm.</span></p>
        <AnimatePresence>
          {done && <motion.span initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="shrink-0 bg-accent px-4 py-2 text-xs font-semibold text-white">Import {ROWS.length} rows</motion.span>}
        </AnimatePresence>
      </div>
    </Window>
  );
}

const EVENTS = [
  ["Aiko Tanaka checked in", "People"],
  ["Invoice INV-0008 was paid", "Finance"],
  ["Granite Builders moved to Qualified", "CRM"],
  ["Task BRD-4 marked done", "Projects"],
  ["Leave approved for Meera Iyer", "People"],
  ["INV-0009 issued to Lumen Studio", "Finance"],
  ["New lead from the website", "CRM"],
  ["Timesheet submitted by Ben Walker", "Projects"],
] as const;
const TAG_ICON = { People: PeopleIcon, Finance: FinanceIcon, CRM: CrmIcon, Projects: ProjectsIcon } as const;

/** A number that eases to its new value. */
function Count({ value, prefix = "", suffix = "", locale = "en-IN" }: { value: number; prefix?: string; suffix?: string; locale?: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const from = shown;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - t0) / 600));
      setShown(Math.round(from + (value - from) * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // The animation starts from whatever is shown now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className="tabular-nums">{prefix}{shown.toLocaleString(locale)}{suffix}</span>;
}

/** Step 4: the company running, as live numbers and a feed of what just happened. */
function RunIt({ calm }: { calm: boolean }) {
  const tick = useStages(100000, 1500, calm);
  const present = Math.min(12, 9 + Math.floor(tick / 3));
  const region = useRegion();
  const cur = CURRENCIES[region];
  const tiles = [
    { name: "People", Icon: PeopleIcon, node: <><Count value={present} /><span className="text-base font-medium text-muted"> / 12</span></>, note: "present today" },
    { name: "Projects", Icon: ProjectsIcon, node: <Count value={8 + (tick % 4)} />, note: "open tasks" },
    { name: "CRM", Icon: CrmIcon, node: <Count value={26 + Math.floor(tick / 2)} />, note: "leads in the pipeline" },
    { name: "Finance", Icon: FinanceIcon, node: <Count prefix={cur.symbol.length > 1 ? `${cur.symbol} ` : cur.symbol} locale={cur.locale} value={fromInr(240000 + tick * 8200, region)} />, note: "collected this month" },
  ];
  const feed = [0, 1, 2].map((k) => EVENTS[(tick + 4 - k) % EVENTS.length]).map((e, k) => ({ e, id: tick - k }));
  return (
    <Window title="Northwind Traders, today" step={4}>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(({ name, Icon, node, note }) => (
          <div key={name} className="bg-soft p-4 ring-1 ring-line">
            <div className="flex items-center gap-2 text-sm font-medium"><span className="grid size-7 place-items-center bg-brand-soft text-base text-brand"><Icon /></span>{name}</div>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{node}</p>
            <p className="text-xs text-muted">{note}</p>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping bg-ok/60 motion-reduce:animate-none" /><span className="relative inline-flex size-2 bg-ok" /></span>Happening now</p>
        <ul className="h-[7.5rem] space-y-1.5 overflow-hidden">
          <AnimatePresence initial={false}>
            {feed.map(({ e, id }) => {
              const Icon = TAG_ICON[e[1]];
              return (
                <motion.li key={id} layout initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className="flex items-center gap-3 bg-bg px-3 py-2 text-sm ring-1 ring-line">
                  <span className="grid size-6 shrink-0 place-items-center bg-brand-soft text-sm text-brand"><Icon /></span>
                  <span className="min-w-0 flex-1 truncate">{e[0]}</span>
                  <span className="text-xs text-muted">{e[1]}</span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>
    </Window>
  );
}

const VISUALS = [DemoLaunch, ChooseHosting, ImportData, RunIt];

/** Four steps that advance by themselves: a stepper on one side, what that step looks like on the other. */
export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (paused || reduced) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, paused, reduced]);
  const Visual = VISUALS[active];
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      {/* Phones: the steps as a row of progress bars, the step's words, then its picture right below. */}
      <div className="lg:hidden">
        <div role="tablist" aria-label="Steps" className="grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <button key={s.title} type="button" role="tab" aria-selected={i === active} aria-label={`Step ${i + 1}: ${s.title}`} onClick={() => setActive(i)} className="group py-2 text-left">
              <span className={cn("text-xs font-semibold", i === active ? "text-brand" : "text-muted")}>{i + 1}</span>
              <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-line">
                <motion.span key={`${active}-${paused}-${i}`} className="block h-full bg-brand" initial={{ width: i < active ? "100%" : 0 }} animate={{ width: i < active || (i === active && (paused || reduced)) ? "100%" : i === active ? "100%" : 0 }} transition={{ duration: i === active && !paused && !reduced ? STEP_MS / 1000 : 0, ease: "linear" }} />
              </span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="mt-4 min-h-[6.5rem]">
            <h3 className="text-xl font-semibold tracking-tight">{STEPS[active].title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{STEPS[active].text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <ol className="hidden lg:col-span-5 lg:block">
        {STEPS.map((s, i) => {
          const on = i === active;
          const last = i === STEPS.length - 1;
          return (
            <li key={s.title} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5">
              {!last && (
                <span aria-hidden="true" className="absolute top-10 bottom-0 left-5 w-px -translate-x-1/2 bg-line">
                  <motion.span key={`${active}-${paused}-${i}`} className="block w-full bg-brand" initial={{ height: i < active ? "100%" : 0 }} animate={{ height: i < active ? "100%" : on && !paused && !reduced ? "100%" : on ? "0%" : 0 }} transition={{ duration: on && !paused ? STEP_MS / 1000 : 0, ease: "linear" }} />
                </span>
              )}
              <button type="button" onClick={() => setActive(i)} aria-current={on ? "step" : undefined} className={cn("relative z-10 grid size-10 place-items-center text-sm font-semibold transition-colors", on ? "bg-accent text-white" : i < active ? "bg-brand text-white" : "bg-bg text-muted ring-1 ring-line hover:text-fg")}>
                {i < active ? <CheckIcon className="size-4" /> : i + 1}
              </button>
              <div className={cn(!last && "pb-9")}>
                <button type="button" onClick={() => setActive(i)} className="flex min-h-10 w-full items-center text-left">
                  <span className={cn("text-lg font-semibold tracking-tight transition-colors", on ? "text-fg" : "text-muted hover:text-fg")}>{s.title}</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden text-muted">
                      <span className="block pt-1">{s.text}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="relative -mt-4 h-[26rem] sm:h-[30rem] lg:col-span-7 lg:mt-0" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: "easeOut" }} className="h-full">
            <Visual calm={reduced} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
