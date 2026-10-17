"use client";

import { motion } from "motion/react";
import { CrmIcon, FinanceIcon, InventoryIcon, PayrollIcon, PeopleIcon, ProjectsIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";

const LEFT = [
  { name: "Google Sheets", note: "Spreadsheets", src: "/tools/googlesheets.svg" },
  { name: "Zoho", note: "HR software", src: "/tools/zoho.svg" },
  { name: "Trello", note: "Project tracker", src: "/tools/trello.svg" },
  { name: "HubSpot", note: "CRM", src: "/tools/hubspot.svg" },
  { name: "QuickBooks", note: "Invoicing", src: "/tools/quickbooks.svg" },
];
const RIGHT = [
  { name: "Notion", note: "Docs and notes", src: "/tools/notion.svg" },
  { name: "Jira", note: "Issue tracking", src: "/tools/jira.svg" },
  { name: "Salesforce", note: "Sales CRM", src: "/tools/salesforce.svg" },
  { name: "Asana", note: "Task lists", src: "/tools/asana.svg" },
  { name: "Airtable", note: "Databases", src: "/tools/airtable.svg" },
];

type Tool = (typeof LEFT)[number];

function ToolCard({ t }: { t: Tool }) {
  return (
    <div className={`flex w-full max-w-[17rem] items-center gap-4 bg-bg p-3 ring-1 ring-line transition-colors hover:ring-brand/40`}>
      <span className="grid size-14 shrink-0 place-items-center bg-soft ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={t.src} alt="" width={32} height={32} className="h-8 w-10 object-contain" />
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{t.name}</p>
        <p className="text-xs text-muted">{t.note}</p>
      </div>
    </div>
  );
}

const mid = (i: number, n: number) => ((i + 0.5) / n) * 100;

/** Beams from each tool into the hub; dashes travel toward it. */
function Beams({ n, flip }: { n: number; flip?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="hidden size-full lg:block">
      {Array.from({ length: n }, (_, i) => {
        const y = mid(i, n);
        const d = flip ? `M100 ${y} C 45 ${y}, 55 50, 0 50` : `M0 ${y} C 55 ${y}, 45 50, 100 50`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="var(--line)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            <path d={d} fill="none" stroke="var(--brand)" strokeWidth="2" strokeDasharray="7 25" strokeLinecap="butt" vectorEffect="non-scaling-stroke" className="animate-[flow_2.2s_linear_infinite] motion-reduce:animate-none" style={{ animationDelay: `${i * -0.45}s` }} />
          </g>
        );
      })}
    </svg>
  );
}

const MODULES = [
  { name: "People & HR", Icon: PeopleIcon, from: 55, to: 92 },
  { name: "Projects & Tasks", Icon: ProjectsIcon, from: 35, to: 78 },
  { name: "CRM & Sales", Icon: CrmIcon, from: 48, to: 86 },
  { name: "Finance & Billing", Icon: FinanceIcon, from: 62, to: 96 },
  { name: "Inventory & Purchasing", Icon: InventoryIcon, from: 40, to: 84 },
  { name: "Payroll & Payslips", Icon: PayrollIcon, from: 52, to: 90 },
];

function Hub() {
  return (
    <div className="flex h-full flex-col bg-bg p-6 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <Logo className="h-8 text-[2rem]" />
        <span className="flex items-center gap-2 bg-ok-soft px-2.5 py-1 text-xs font-semibold text-ok">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping bg-ok/60 motion-reduce:animate-none" /><span className="relative inline-flex size-2 bg-ok" /></span>Live
        </span>
      </div>
      <p className="mt-5 text-xl font-semibold tracking-tight">One system, one login</p>
      <p className="mt-1 text-sm text-muted">Every tool on this page, as one set of records.</p>
      <ul className="mt-5 flex flex-1 flex-col justify-between gap-3">
        {MODULES.map(({ name, Icon, from, to }, i) => (
          <li key={name} className="flex items-center gap-3 bg-soft px-3.5 py-3 ring-1 ring-line">
            <span className="grid size-9 shrink-0 place-items-center bg-brand-soft text-lg text-brand"><Icon /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{name}</p>
              <span className="mt-1.5 block h-1.5 bg-line">
                <motion.span className="block h-full bg-brand" initial={{ width: `${from}%` }} animate={{ width: [`${from}%`, `${to}%`, `${from}%`] }} transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }} />
              </span>
            </div>
            <span className="text-xs font-medium text-ok">Synced</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STATS = [
  ["10+", "separate tools replaced"],
  ["1", "login for the whole team"],
  ["0", "per-user fees"],
] as const;

/** "One system instead of many": the tools it replaces on both sides, each feeding into Crux. */
export function OneSystem() {
  return (
    <Reveal>
      {/* Wide screens: tools left and right, beams into the hub. */}
      <div className="mx-auto hidden max-w-6xl grid-cols-[1fr_5rem_21rem_5rem_1fr] items-stretch lg:grid">
        <ul className="grid grid-rows-5 justify-items-end">
          {LEFT.map((t) => <li key={t.name} className="flex w-full items-center justify-end py-1.5"><ToolCard t={t} /></li>)}
        </ul>
        <Beams n={LEFT.length} />
        <Hub />
        <Beams n={RIGHT.length} flip />
        <ul className="grid grid-rows-5 justify-items-start">
          {RIGHT.map((t) => <li key={t.name} className="flex w-full items-center py-1.5"><ToolCard t={t} /></li>)}
        </ul>
      </div>

      {/* Small screens: the pile of tools, folding down into the one system. */}
      <div className="mx-auto max-w-md lg:hidden">
        <p className="mb-3 text-center text-xs font-semibold tracking-widest text-muted uppercase">Instead of</p>
        <ul className="grid grid-cols-3 gap-px bg-line ring-1 ring-line sm:grid-cols-5">
          {[...LEFT, ...RIGHT].map((t) => (
            <li key={t.name} className="flex flex-col items-center gap-2 bg-bg px-2 py-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" width={28} height={28} className="h-7 w-9 object-contain" />
              <span className="text-xs leading-tight font-medium">{t.name}</span>
            </li>
          ))}
          {/* Fills the last row of three; five across (wider phones) needs no filler. */}
          <li className="col-span-2 flex items-center justify-center bg-soft px-3 py-4 text-center text-xs leading-snug text-muted sm:hidden">
            …and the email threads and spreadsheets between them
          </li>
        </ul>
        <div aria-hidden="true" className="relative mx-auto flex h-16 w-px flex-col items-center bg-gradient-to-b from-line to-brand">
          <span className="absolute -bottom-1 size-2.5 rotate-45 border-r-2 border-b-2 border-brand" />
        </div>
        <div className="mt-2">
          <Hub />
        </div>
      </div>

      <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-3 divide-x divide-line ring-1 ring-line sm:mt-14">
        {STATS.map(([n, t]) => (
          <div key={t} className="bg-bg px-2 py-4 text-center sm:px-6 sm:py-5">
            <dt className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl">{n}</dt>
            <dd className="mt-1 text-xs text-muted sm:text-sm">{t}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
