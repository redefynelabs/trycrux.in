"use client";

import { useRegion } from "@/components/currency-picker";
import { CURRENCIES, formatMoney, fromInr } from "@/lib/currency";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { Avatar } from "@/components/avatar";
import { CrmIcon, FinanceIcon, PeopleIcon, ProjectsIcon } from "@/components/icons";
import { Marquee } from "@/components/magicui/marquee";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { MODULES } from "@/content/features";
import { cn } from "@/lib/utils";

/** Runs fn every ms while motion is allowed. */
function useTick(ms: number, calm: boolean, fn: () => void) {
  useEffect(() => {
    if (calm) return;
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
    // fn only calls state setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div key={who + what} className="flex items-start gap-3 rounded-2xl bg-bg p-3 ring-1 ring-line">
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
          <div key={name} className="flex flex-col gap-2 rounded-2xl bg-soft/70 p-2.5 ring-1 ring-line">
            <p className="flex items-center justify-between px-1 text-xs font-semibold text-muted">{name}<span className="rounded-full bg-bg px-1.5 text-[10px] ring-1 ring-line">{TASKS.filter((t) => col[t.id] === i).length}</span></p>
            {TASKS.filter((t) => col[t.id] === i).map((t) => (
              <motion.div key={t.id} layout layoutId={`task-${t.id}`} transition={{ type: "spring", stiffness: 380, damping: 32 }} className="rounded-xl bg-bg p-2.5 text-xs shadow-xs ring-1 ring-line">
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
              <div className={cn("relative flex h-9 items-center gap-1.5 overflow-hidden rounded-xl px-1.5 ring-1 ring-line", i === 4 ? "bg-ok-soft" : "bg-soft")}>
                <motion.span aria-hidden="true" className={cn("absolute inset-y-0 left-0 rounded-xl", i === 4 ? "bg-ok/15" : "bg-brand/10")} animate={{ width: `${Math.max(12, (here.length / 4) * 100)}%` }} transition={spring} />
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
      <div className="flex items-end justify-between rounded-2xl bg-soft px-4 py-3 ring-1 ring-line">
        <div><p className="text-xs text-muted">Collected</p><Count prefix={cur.symbol.length > 1 ? `${cur.symbol} ` : cur.symbol} locale={cur.locale} value={fromInr(collected, region)} className="text-2xl font-semibold" /></div>
        <p className="text-xs text-muted">{state.filter((v) => v === 2).length} of {INVOICES.length} paid</p>
      </div>
      {INVOICES.map((inv, i) => (
        <div key={inv.n} className="flex items-center gap-3 rounded-2xl bg-bg px-4 py-2.5 text-sm ring-1 ring-line">
          <div className="min-w-0 flex-1"><p className="font-medium">{inv.n}</p><p className="truncate text-xs text-muted">{inv.c}</p></div>
          <span className="tabular-nums text-muted">{formatMoney(fromInr(inv.amt, region), region)}</span>
          <motion.span key={state[i]} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cn("w-16 rounded-full px-2.5 py-1 text-center text-xs font-semibold", TONE[FLOW[state[i]]])}>{FLOW[state[i]]}</motion.span>
        </div>
      ))}
    </div>
  );
}

// ---- The cards ----

const CARDS: { id: string; icon: typeof PeopleIcon; visual: ReactNode; span: string }[] = [
  { id: "people", icon: PeopleIcon, visual: <PeopleFeed />, span: "lg:col-span-4" },
  { id: "crm", icon: CrmIcon, visual: <Pipeline />, span: "lg:col-span-2" },
  { id: "work", icon: ProjectsIcon, visual: <TaskBoard />, span: "lg:col-span-2" },
  { id: "finance", icon: FinanceIcon, visual: <InvoiceFlow />, span: "lg:col-span-4" },
];

/** The four modules as a bento: a live picture of each working, its name, one line and the parts it is made of. */
export function ModuleGrid() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line ring-1 ring-line lg:grid-cols-6">
      {CARDS.map((c) => {
        const m = MODULES.find((x) => x.id === c.id)!;
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
              <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-xl text-brand sm:size-11 sm:rounded-2xl sm:text-2xl"><Icon /></span>
              <h3 className="mt-3 text-lg leading-tight font-semibold tracking-tight sm:mt-5 sm:text-2xl">{m.name}</h3>
              <p className="mt-1.5 text-sm text-muted sm:mt-2 sm:text-lg">{m.tagline}</p>
              <ul className="mt-5 hidden flex-wrap gap-2 sm:flex">
                {m.features.slice(0, 4).map((f) => (
                  <li key={f.title} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">{f.title}</li>
                ))}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
