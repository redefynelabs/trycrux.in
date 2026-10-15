"use client";

import { Local } from "@/components/currency-picker";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { BentoCard } from "@/components/bento";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { Marquee } from "@/components/magicui/marquee";
import { useReducedMotion } from "@/components/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Calls fn every ms while motion is allowed. fn only calls state setters. */
function useTick(ms: number, fn: () => void) {
  const calm = useReducedMotion();
  useEffect(() => {
    if (calm) return;
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, calm]);
}

const spring = { type: "spring", stiffness: 320, damping: 26 } as const;

const ROLES = ["Admin", "Manager", "Member"] as const;
const PERMISSIONS = ["View invoices", "Approve leave", "Edit clients", "Export reports", "Manage roles and settings"];
const FLAGS = [
  [true, true, false],
  [true, true, false],
  [true, true, true],
  [true, true, false],
  [true, false, false],
];
// The cells that get switched, one per beat: [row, role].
const FLIPS: [number, number][] = [[1, 2], [3, 1], [0, 2], [4, 1], [3, 2]];

/** Who can do what: the built-in roles, each permission on or off. A permission is switched every moment and its row lights up. */
function RoleMatrix() {
  const [flags, setFlags] = useState(FLAGS);
  const [beat, setBeat] = useState(0);
  const [row, setRow] = useState<number | null>(null);
  useTick(1600, () => {
    const [r, c] = FLIPS[beat % FLIPS.length];
    setFlags((f) => f.map((fr, i) => (i === r ? fr.map((v, j) => (j === c ? !v : v)) : fr)));
    setRow(r);
    setBeat((b) => b + 1);
  });
  return (
    <div aria-hidden="true" className="px-6 pt-8 pb-2 sm:px-10 [mask-image:linear-gradient(to_bottom,black_55%,transparent_96%)]">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl bg-bg shadow-xs ring-1 ring-line">
        <div className="grid grid-cols-[1.6fr_repeat(3,1fr)] bg-soft px-5 py-3 text-xs font-medium text-muted">
          <span>Permission</span>
          {ROLES.map((r) => <span key={r} className="text-center">{r}</span>)}
        </div>
        <ul className="divide-y divide-line">
          {PERMISSIONS.map((name, r) => (
            <li key={name} className={cn("grid grid-cols-[1.6fr_repeat(3,1fr)] items-center px-5 py-3.5 text-sm transition-colors duration-500", row === r && "bg-brand-soft/60")}>
              <span>{name}</span>
              {flags[r].map((on, i) => (
                <span key={i} className="flex justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    {on ? (
                      <motion.span key="on" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring} className="grid size-6 place-items-center rounded-full bg-ok-soft text-ok"><CheckIcon className="size-3.5" /></motion.span>
                    ) : (
                      <motion.span key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid size-6 place-items-center"><span className="h-px w-3 bg-muted/40" /></motion.span>
                    )}
                  </AnimatePresence>
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const EVENTS = [
  ["Priya Shah", "issued invoice INV-0006", "2m ago"],
  ["Jordan Reyes", "moved Granite Builders to Qualified", "9m ago"],
  ["Nadia Hussain", "approved leave for Meera Iyer", "21m ago"],
  ["Alex Morgan", "changed the Manager role", "1h ago"],
  ["Tomas Rivera", "recorded a payment of ₹33,921.80", "1h ago"],
  ["Farah Khan", "corrected attendance for 8 Oct", "3h ago"],
];

/** The audit log, scrolling by. Names are the demo company's. */
function AuditFeed() {
  return (
    <div aria-hidden="true" className="relative h-72 overflow-hidden px-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
      <Marquee vertical repeat={3} className="[--duration:28s] [--gap:0.75rem]">
        {EVENTS.map(([who, what, when]) => (
          <div key={who + what} className="flex items-start gap-3 rounded-2xl bg-bg p-3.5 ring-1 ring-line">
            <Avatar name={who} />
            <div className="min-w-0 text-sm">
              <p><span className="font-medium">{who}</span> <span className="text-muted"><Local>{what}</Local></span></p>
              <p className="mt-0.5 text-xs text-muted">{when}</p>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

const REQUESTS = [
  { t: "Leave request", d: "Meera Iyer · 14–15 Oct", tag: "Leave" },
  { t: "Expense claim", d: "₹4,200 · client lunch", tag: "Expense" },
  { t: "Invoice INV-0006 is overdue", d: "Reminder sent by WhatsApp", tag: "Reminder" },
  { t: "Attendance correction", d: "Arjun Mehta · 8 Oct", tag: "Attendance" },
  { t: "Timesheet submitted", d: "Design team · week 41", tag: "Timesheet" },
  { t: "Purchase approval", d: "Office chairs · ₹38,500", tag: "Purchase" },
];

/** Requests arrive like notifications: each drops in at the top, the others make room, and the oldest fades out below. */
function Approvals() {
  const [n, setN] = useState(3);
  useTick(1900, () => setN((v) => v + 1));
  const list = [0, 1, 2, 3].map((k) => ({ ...REQUESTS[(n - k) % REQUESTS.length], id: n - k }));
  return (
    <div aria-hidden="true" className="relative h-72 overflow-hidden px-6 pt-5 [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]">
      <ul className="space-y-3">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((r, i) => (
            <motion.li key={r.id} layout initial={{ opacity: 0, y: -28, scale: 0.96 }} animate={{ opacity: 1 - i * 0.22, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={spring} className="flex items-center gap-3 rounded-2xl bg-bg p-3.5 shadow-sm ring-1 ring-line">
              <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand">
                {i === 0 && <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/30" />}
                <span className="relative size-2 rounded-full bg-brand" />
              </span>
              <div className="min-w-0 flex-1 text-sm"><p className="truncate font-medium">{r.t}</p><p className="truncate text-xs text-muted"><Local>{r.d}</Local></p></div>
              <span className="rounded-full bg-soft px-2.5 py-1 text-[11px] font-medium text-muted ring-1 ring-line">{i === 0 ? "Just now" : r.tag}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

const ACCESS = ["Everyone", "Accounts team", "Sales department", "Aiko Tanaka", "Ben Walker"] as const;

/** Mei given to chosen people, teams and departments only: a selector glides down the list and grants or removes access as it lands. */
function MeiAccess() {
  const [on, setOn] = useState([false, true, false, true, false]);
  const [cur, setCur] = useState(1);
  const [beat, setBeat] = useState(0);
  useTick(1300, () => {
    const next = 1 + (beat % (ACCESS.length - 1));
    setCur(next);
    setOn((o) => o.map((v, j) => (j === next ? !v : v)));
    setBeat((b) => b + 1);
  });
  return (
    <div aria-hidden="true" className="relative flex h-72 flex-col justify-center gap-1 px-6 [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_80%,transparent)]">
      {ACCESS.map((name, i) => (
        <div key={name} className="relative flex items-center gap-3 rounded-xl px-3 py-2">
          {cur === i && <motion.span layoutId="mei-cursor" transition={spring} className="absolute inset-0 rounded-xl bg-bg shadow-sm ring-1 ring-brand/30" />}
          <span className="relative">{i === 3 || i === 4 ? <Avatar name={name} /> : <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{name[0]}</span>}</span>
          <span className="relative flex-1 text-sm font-medium">{name}</span>
          <span className="relative h-6 w-24">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(on[i])} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className={cn("absolute inset-0 inline-flex items-center justify-center gap-1 rounded-full text-xs font-medium", on[i] ? "bg-brand text-white" : "bg-soft text-muted ring-1 ring-line")}>
                {on[i] ? <><SparkIcon className="size-3" /> Mei on</> : "No access"}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      ))}
    </div>
  );
}

const DAYS = [28, 44, 36, 61, 52, 78, 49, 66, 83, 57, 72, 91, 64, 88];
const USERS = [["Alex Morgan", 25, 100], ["Ben Walker", 22, 90], ["Farah Khan", 21, 84]] as const;

/** Usage over two weeks, and who used it: the days roll along and the totals climb. */
function MeiUsage() {
  const [t, setT] = useState(0);
  useTick(1200, () => setT((v) => v + 1));
  const shown = Array.from({ length: DAYS.length }, (_, i) => DAYS[(t + i) % DAYS.length]);
  const stats = [[String(90 + t * 2), "questions"], [`${543 + t * 6}k`, "tokens"], ["4", "people"]];
  return (
    <div aria-hidden="true" className="relative px-5 py-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-bg p-4 shadow-xs ring-1 ring-line">
        <div className="grid grid-cols-3 gap-2 text-center">
          {stats.map(([v, l]) => (
            <div key={l} className="rounded-xl bg-soft px-3 py-2.5"><p className="text-xl font-semibold tabular-nums">{v}</p><p className="text-xs text-muted">{l}</p></div>
          ))}
        </div>
        <div className="mt-5 flex h-24 items-end gap-1.5">
          {shown.map((h, i) => (
            <motion.span key={(t + i) % DAYS.length} layout initial={{ height: 0, opacity: 0 }} animate={{ height: `${h}%`, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }} className={cn("flex-1 rounded-t", i === DAYS.length - 1 ? "bg-brand" : "bg-brand/30")} />
          ))}
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          {USERS.map(([n, q, w]) => (
            <li key={n} className="flex items-center gap-3"><Avatar name={n} className="size-6" /><span className="w-24 truncate font-medium">{n}</span><span className="h-2 flex-1 overflow-hidden rounded-full bg-soft"><motion.span className="block h-full rounded-full bg-brand" animate={{ width: `${Math.min(100, w - 6 + ((t * 3 + q) % 7))}%` }} transition={{ type: "spring", stiffness: 90, damping: 18 }} /></span><span className="w-8 text-right tabular-nums text-muted">{q + Math.floor(t / 3)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ControlBento() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line ring-1 ring-line lg:grid-cols-3">
      <BentoCard className="lg:col-span-2" title="Roles and permissions" text="Built-in roles you can change, and a permission for every action, so people see and do only what they should.">
        <RoleMatrix />
      </BentoCard>
      <BentoCard half className="lg:col-span-1" title="An audit log of everything" text="Who changed what, and when, for the things that matter.">
        <AuditFeed />
      </BentoCard>
      <BentoCard half className="lg:col-span-1" title="Approvals and reminders" text="Leave, expenses and corrections wait for the right person, with email and WhatsApp nudges.">
        <Approvals />
      </BentoCard>
      <BentoCard half className="lg:col-span-1" title="Give Mei to the right people" text="Turn the AI assistant on for everyone, or only for chosen people, teams and departments.">
        <MeiAccess />
      </BentoCard>
      <BentoCard half className="lg:col-span-1" title="See who used the AI, and how much" text="Questions, people and tokens for any period, so the provider's bill is never a surprise.">
        <MeiUsage />
      </BentoCard>
    </div>
  );
}
