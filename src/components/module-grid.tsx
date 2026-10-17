"use client";

import { useRegion } from "@/components/currency-picker";
import { CURRENCIES, formatMoney, fromInr } from "@/lib/currency";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import Link from "next/link";
import { ArrowRightIcon, CrmIcon, FinanceIcon, InventoryIcon, PayrollIcon, PeopleIcon, ProjectsIcon } from "@/components/icons";
import { Marquee } from "@/components/magicui/marquee";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { MODULES } from "@/content/features";
import { cn } from "@/lib/utils";

/** Runs fn every ms while motion is allowed. It always runs the latest fn, so it can read current state. */
function useTick(ms: number, calm: boolean, fn: () => void) {
  const latest = useRef(fn);
  useEffect(() => {
    latest.current = fn;
  });
  useEffect(() => {
    if (calm) return;
    const id = setInterval(() => latest.current(), ms);
    return () => clearInterval(id);
  }, [ms, calm]);
}

/** A number that eases to its new value. */
function Count({ value, prefix = "", locale = "en-IN", className }: { value: number; prefix?: string; locale?: string; className?: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const from = shown;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, Math.max(0, (t - t0) / 700));
      setShown(Math.round(from + (value - from) * (1 - (1 - k) ** 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // The animation starts from whatever is shown now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span className={cn("tabular-nums", className)}>{prefix}{shown.toLocaleString(locale)}</span>;
}

// ---- People: a feed of what is happening, scrolling by like an audit log ----

const PEOPLE_EVENTS = [
  ["Ananya Rao", "checked in", "09:02"],
  ["Rohan Verma", "assigned to the Night shift", "09:24"],
  ["Sameer Khan", "marked late, 41 minutes", "09:41"],
  ["Meera Iyer", "leave approved, 14 to 15 Oct", "10:05"],
  ["Arjun Mehta", "attendance corrected for 8 Oct", "10:30"],
  ["Vikram Shah", "joined the Design team", "11:15"],
  ["Farah Khan", "checked out, 8h 52m", "18:04"],
] as const;

function PeopleFeed() {
  return (
    <div className="relative h-full overflow-hidden px-5 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <Marquee vertical repeat={3} className="[--duration:26s] [--gap:0.65rem]">
        {PEOPLE_EVENTS.map(([who, what, when]) => (
          <div key={who + what} className="flex items-start gap-3 bg-bg p-3 ring-1 ring-line">
            <Avatar name={who} />
            <div className="min-w-0 flex-1 text-sm"><p><span className="font-medium">{who}</span> <span className="text-muted">{what}</span></p></div>
            <span className="text-xs text-muted tabular-nums">{when}</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

// ---- Projects: a task moving across the board ----

const COLUMNS = ["Pending", "Working", "Done"];
const TASKS = [
  { id: "a", key: "BRD-2", title: "Wireframes and flows" },
  { id: "b", key: "BRD-4", title: "Build the core screens" },
  { id: "c", key: "BRD-5", title: "Connect the data" },
  { id: "d", key: "BRD-7", title: "Fix feedback" },
];

function TaskBoard() {
  const calm = useReducedMotion();
  const [col, setCol] = useState<Record<string, number>>({ a: 2, b: 1, c: 0, d: 0 });
  const [turn, setTurn] = useState(0);
  useTick(1700, calm, () => {
    const t = TASKS[turn % TASKS.length];
    setCol((c) => ({ ...c, [t.id]: (c[t.id] + 1) % 3 }));
    setTurn((n) => n + 1);
  });
  return (
    <LayoutGroup>
      <div className="grid h-full grid-cols-3 gap-3 px-5 py-6">
        {COLUMNS.map((name, i) => (
          <div key={name} className="flex flex-col gap-2 bg-soft/70 p-2.5 ring-1 ring-line">
            <p className="flex items-center justify-between px-1 text-xs font-semibold text-muted">{name}<span className="rounded-full bg-bg px-1.5 text-[10px] ring-1 ring-line">{TASKS.filter((t) => col[t.id] === i).length}</span></p>
            {TASKS.filter((t) => col[t.id] === i).map((t) => (
              <motion.div key={t.id} layout layoutId={`task-${t.id}`} transition={{ type: "spring", stiffness: 380, damping: 32 }} className="bg-bg p-2.5 text-xs shadow-xs ring-1 ring-line">
                <p className="text-[10px] text-muted">{t.key}</p>
                <p className="mt-0.5 font-medium leading-snug">{t.title}</p>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}

// ---- CRM: the pipeline filling as leads arrive ----

const STAGES = ["New", "Contacted", "Qualified", "Proposal", "Won"];
const LEADS = [
  { id: 0, name: "Granite Builders", tone: "bg-blue-500" },
  { id: 1, name: "Cedar Wellness", tone: "bg-emerald-500" },
  { id: 2, name: "Lakeview Hotels", tone: "bg-violet-500" },
  { id: 3, name: "Nova Pharmacies", tone: "bg-amber-500" },
  { id: 4, name: "Summit Fitness", tone: "bg-rose-500" },
  { id: 5, name: "Lumen Studio", tone: "bg-cyan-500" },
  { id: 6, name: "Harbor Logistics", tone: "bg-indigo-500" },
  { id: 7, name: "Orchard Foods", tone: "bg-teal-500" },
];
const ORDER = [2, 0, 5, 3, 7, 1, 6, 4];

function Pipeline() {
  const calm = useReducedMotion();
  const [stage, setStage] = useState([0, 0, 1, 1, 2, 3, 0, 4]);
  const [turn, setTurn] = useState(0);
  const [last, setLast] = useState<{ id: number; to: number } | null>(null);
  useTick(1500, calm, () => {
    const id = ORDER[turn % ORDER.length];
    const to = (stage[id] + 1) % STAGES.length;
    setStage((s) => s.map((v, j) => (j === id ? to : v)));
    setLast({ id, to });
    setTurn((t) => t + 1);
  });
  const spring = { type: "spring", stiffness: 260, damping: 26 } as const;
  const won = stage.filter((v) => v === 4).length;
  return (
    <LayoutGroup>
      <div className="flex h-full flex-col justify-center gap-2.5 px-6 py-6">
        <div className="relative h-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={turn} initial={{ y: 12, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -12, opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.25 }} className="absolute left-0 inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-medium text-brand">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" /><span className="relative size-2 rounded-full bg-brand" /></span>
              {last ? `${LEADS[last.id].name} moved to ${STAGES[last.to]}` : "Live pipeline"}
            </motion.p>
          </AnimatePresence>
        </div>
        {STAGES.map((name, i) => {
          const here = LEADS.filter((l) => stage[l.id] === i);
          return (
            <div key={name} className="grid grid-cols-[5.5rem_1fr_1.5rem] items-center gap-3 text-sm">
              <span className={cn("text-muted", i === 4 && "font-medium text-ok")}>{name}</span>
              <div className={cn("relative flex h-9 items-center gap-1.5 overflow-hidden px-1.5 ring-1 ring-line", i === 4 ? "bg-ok-soft" : "bg-soft")}>
                <motion.span aria-hidden="true" className={cn("absolute inset-y-0 left-0", i === 4 ? "bg-ok/15" : "bg-brand/10")} animate={{ width: `${Math.max(12, (here.length / 4) * 100)}%` }} transition={spring} />
                {here.map((l) => (
                  <motion.span key={l.id} layout layoutId={`lead-${l.id}`} transition={spring} title={l.name} className={cn("relative grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white shadow-xs ring-2 ring-bg", l.tone)}>
                    {l.name[0]}
                  </motion.span>
                ))}
              </div>
              <Count value={here.length} className="text-right font-semibold" />
            </div>
          );
        })}
        <span className="sr-only">{won} won</span>
      </div>
    </LayoutGroup>
  );
}

// ---- Finance: invoices getting paid and the total climbing ----

const FLOW = ["Draft", "Issued", "Paid"] as const;
const INVOICES = [
  { n: "INV-0007", c: "Granite Builders", amt: 84200 },
  { n: "INV-0008", c: "Cedar Wellness", amt: 66150 },
  { n: "INV-0009", c: "Lumen Studio", amt: 52030 },
  { n: "INV-0010", c: "Summit Fitness", amt: 31900 },
];
const TONE = { Draft: "bg-soft text-muted", Issued: "bg-brand-soft text-brand", Paid: "bg-ok-soft text-ok" } as const;

function InvoiceFlow() {
  const calm = useReducedMotion();
  const [state, setState] = useState([2, 1, 1, 0]);
  const [turn, setTurn] = useState(0);
  useTick(1700, calm, () => {
    const i = turn % INVOICES.length;
    setState((s) => s.map((v, j) => (j === i ? (v + 1) % 3 : v)));
    setTurn((t) => t + 1);
  });
  const region = useRegion();
  const cur = CURRENCIES[region];
  const collected = INVOICES.reduce((sum, inv, i) => sum + (state[i] === 2 ? inv.amt : 0), 0);
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-6 py-5">
      <div className="flex items-end justify-between bg-soft px-4 py-3 ring-1 ring-line">
        <div><p className="text-xs text-muted">Collected</p><Count prefix={cur.symbol.length > 1 ? `${cur.symbol} ` : cur.symbol} locale={cur.locale} value={fromInr(collected, region)} className="text-2xl font-semibold" /></div>
        <p className="text-xs text-muted">{state.filter((v) => v === 2).length} of {INVOICES.length} paid</p>
      </div>
      {INVOICES.map((inv, i) => (
        <div key={inv.n} className="flex items-center gap-3 bg-bg px-4 py-2.5 text-sm ring-1 ring-line">
          <div className="min-w-0 flex-1"><p className="font-medium">{inv.n}</p><p className="truncate text-xs text-muted">{inv.c}</p></div>
          <span className="tabular-nums text-muted">{formatMoney(fromInr(inv.amt, region), region)}</span>
          <motion.span key={state[i]} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("w-16 rounded-full px-2.5 py-1 text-center text-xs font-semibold", TONE[FLOW[state[i]]])}>{FLOW[state[i]]}</motion.span>
        </div>
      ))}
    </div>
  );
}

// ---- Inventory: stock moving with sales and purchase orders, and a low-stock flag ----

const STOCK = [
  { name: "Router AX-3", qty: 24, reorder: 10, max: 40 },
  { name: "Cable 5 m", qty: 40, reorder: 15, max: 60 },
  { name: "Switch 24-port", qty: 9, reorder: 8, max: 30 },
  { name: "Wall mount", qty: 18, reorder: 6, max: 30 },
];
/** Each item is sold and restocked by the same amount, so the cycle returns to where it began. */
const STOCK_EVENTS: [number, number, string][] = [
  [0, -6, "Sold 6 Router AX-3 · INV-0011"],
  [2, -3, "Sold 3 Switch 24-port · INV-0012"],
  [2, 3, "Received 3 Switch 24-port · PO-0042"],
  [1, -12, "Sold 12 Cable 5 m · INV-0013"],
  [0, 6, "Received 6 Router AX-3 · PO-0043"],
  [1, 12, "Received 12 Cable 5 m · PO-0044"],
  [3, -5, "Sold 5 Wall mount · INV-0014"],
  [3, 5, "Received 5 Wall mount · PO-0045"],
];

function StockLevels() {
  const calm = useReducedMotion();
  const [qty, setQty] = useState(STOCK.map((s) => s.qty));
  const [turn, setTurn] = useState(0);
  const [last, setLast] = useState<string | null>(null);
  useTick(1700, calm, () => {
    const [i, d, text] = STOCK_EVENTS[turn % STOCK_EVENTS.length];
    setQty((q) => q.map((v, j) => (j === i ? v + d : v)));
    setLast(text);
    setTurn((t) => t + 1);
  });
  const low = STOCK.filter((s, i) => qty[i] <= s.reorder).length;
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-6 py-5">
      <div className="relative h-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={turn} initial={{ y: 12, opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={{ y: -12, opacity: 0, filter: "blur(4px)" }} transition={{ duration: 0.25 }} className="absolute left-0 inline-flex max-w-full items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-medium text-brand">
            <span className="relative flex size-2 shrink-0"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" /><span className="relative size-2 rounded-full bg-brand" /></span>
            <span className="truncate">{last ?? "Live stock"}</span>
          </motion.p>
        </AnimatePresence>
      </div>
      {STOCK.map((s, i) => {
        const isLow = qty[i] <= s.reorder;
        return (
          <div key={s.name} className="bg-bg px-4 py-2.5 text-sm ring-1 ring-line">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium">{s.name}</p>
              <span className="flex items-center gap-2">
                {isLow && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-full bg-warn-soft px-2 py-0.5 text-[10px] font-semibold text-warn">Low stock</motion.span>}
                <Count value={qty[i]} className="font-semibold" />
              </span>
            </div>
            <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-soft">
              <motion.span aria-hidden="true" className={cn("absolute inset-y-0 left-0 rounded-full", isLow ? "bg-warn" : "bg-brand")} animate={{ width: `${Math.min(100, (qty[i] / s.max) * 100)}%` }} transition={{ type: "spring", stiffness: 160, damping: 24 }} />
            </div>
          </div>
        );
      })}
      <span className="sr-only">{low} items low on stock</span>
    </div>
  );
}

// ---- Payroll: a pay run moving from draft to paid, and the payslips appearing ----

const RUN_STEPS = ["Draft", "Calculated", "Approved", "Paid"] as const;
const PAYSLIPS = [
  { who: "Ananya Rao", net: 78400 },
  { who: "Rohan Verma", net: 64250 },
  { who: "Meera Iyer", net: 71900 },
  { who: "Sameer Khan", net: 52600 },
];

function PayrollRun() {
  const calm = useReducedMotion();
  const [step, setStep] = useState(2);
  useTick(1900, calm, () => setStep((s) => (s + 1) % RUN_STEPS.length));
  const region = useRegion();
  const cur = CURRENCIES[region];
  const net = PAYSLIPS.reduce((sum, p) => sum + p.net, 0);
  const ready = step >= 2;
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-6 py-5">
      <div className="bg-soft px-4 py-3 ring-1 ring-line">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-xs text-muted">October pay run · net pay</p><Count prefix={cur.symbol.length > 1 ? `${cur.symbol} ` : cur.symbol} locale={cur.locale} value={step === 0 ? 0 : fromInr(net, region)} className="text-2xl font-semibold" /></div>
          <motion.span key={step} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", step === 3 ? "bg-ok-soft text-ok" : step === 0 ? "bg-soft text-muted ring-1 ring-line" : "bg-brand-soft text-brand")}>{RUN_STEPS[step]}</motion.span>
        </div>
        <ol className="mt-3 flex gap-1.5" aria-label="Run progress">
          {RUN_STEPS.map((name, i) => (
            <li key={name} className="flex-1"><span className={cn("block h-1.5 rounded-full transition-colors duration-500", i <= step ? "bg-brand" : "bg-line")} /></li>
          ))}
        </ol>
      </div>
      {PAYSLIPS.map((p) => (
        <div key={p.who} className="flex items-center gap-3 bg-bg px-4 py-2.5 text-sm ring-1 ring-line">
          <Avatar name={p.who} />
          <div className="min-w-0 flex-1"><p className="truncate font-medium">{p.who}</p><p className="text-xs text-muted">{ready ? "Payslip ready" : "Waiting for approval"}</p></div>
          <span className="tabular-nums text-muted">{step === 0 ? "—" : formatMoney(fromInr(p.net, region), region)}</span>
        </div>
      ))}
    </div>
  );
}

// ---- The cards ----

/** A card is a module from the content file, or its own name, line and parts (payroll is a part of People & HR with a card of its own). */
const CARDS: { id: string; icon: typeof PeopleIcon; visual: ReactNode; span: string; own?: { name: string; tagline: string; parts: string[] }; page: string }[] = [
  { id: "people", page: "people-hr", icon: PeopleIcon, visual: <PeopleFeed />, span: "lg:col-span-4" },
  { id: "crm", page: "crm-sales", icon: CrmIcon, visual: <Pipeline />, span: "lg:col-span-2" },
  { id: "work", page: "projects-tasks", icon: ProjectsIcon, visual: <TaskBoard />, span: "lg:col-span-2" },
  { id: "finance", page: "finance-billing", icon: FinanceIcon, visual: <InvoiceFlow />, span: "lg:col-span-4" },
  { id: "inventory", page: "inventory-purchasing", icon: InventoryIcon, visual: <StockLevels />, span: "lg:col-span-4" },
  {
    id: "payroll", page: "payroll", icon: PayrollIcon, visual: <PayrollRun />, span: "lg:col-span-2",
    own: { name: "Payroll & Payslips", tagline: "A pay run each month, approved by someone else.", parts: ["Pay components", "Salary structures", "Approval", "Payslip PDFs"] },
  },
];

/** The modules as a bento: a live picture of each working, its name, one line and the parts it is made of. */
export function ModuleGrid() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line ring-1 ring-line lg:grid-cols-6">
      {CARDS.map((c) => {
        const found = MODULES.find((x) => x.id === c.id);
        const m = c.own ? { name: c.own.name, tagline: c.own.tagline, parts: c.own.parts } : { name: found!.name, tagline: found!.tagline, parts: found!.features.slice(0, 4).map((f) => f.title) };
        const Icon = c.icon;
        return (
          <article key={c.id} className={cn("flex flex-col bg-bg", c.span)}>
            <div className="relative h-44 overflow-hidden bg-gradient-to-b from-soft/50 to-bg sm:h-[24rem]" aria-hidden="true">
              {/* Phones show the same live picture at half size, so two cards fit side by side. */}
              <div className="h-[200%] w-[200%] origin-top-left scale-50 sm:h-full sm:w-full sm:scale-100">{c.visual}</div>
              {/* The live picture fades into the card instead of ending on a line. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-bg via-bg/60 to-transparent" />
            </div>
            <div className="relative flex flex-1 flex-col px-4 pt-1 pb-5 sm:px-8 sm:pt-3 sm:pb-8">
              <span className="grid size-9 place-items-center bg-brand-soft text-xl text-brand sm:size-11 sm:sm:text-2xl"><Icon /></span>
              <h3 className="mt-3 text-lg leading-tight font-semibold tracking-tight sm:mt-5 sm:text-2xl">{m.name}</h3>
              <p className="mt-1.5 text-sm text-muted sm:mt-2 sm:text-lg">{m.tagline}</p>
              <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
                {m.parts.map((t) => (
                  <li key={t} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">{t}</li>
                ))}
              </ul>
              <Link href={`/product/${c.page}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline sm:mt-5">Explore <ArrowRightIcon className="size-4" /></Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export type VisualKind = "people" | "tasks" | "pipeline" | "invoices" | "stock" | "payroll";

/** One module's live picture, by name, for pages other than the home page. */
export function ModuleVisual({ kind }: { kind: VisualKind }) {
  switch (kind) {
    case "people": return <PeopleFeed />;
    case "tasks": return <TaskBoard />;
    case "pipeline": return <Pipeline />;
    case "invoices": return <InvoiceFlow />;
    case "stock": return <StockLevels />;
    case "payroll": return <PayrollRun />;
  }
}
