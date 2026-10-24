import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { DemoForm } from "@/components/demo-form";
import { Faq } from "@/components/faq";
import { CheckIcon, CrmIcon, FinanceIcon, InventoryIcon, PayrollIcon, PeopleIcon, ProjectsIcon, SparkIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { GENERAL_FAQ } from "@/content/faq";

export const metadata: Metadata = pageMeta("/demo", "Try Crux free", "Your own private copy of Crux with a sample company, ready in seconds: the Services or Goods edition with real-looking data: HR and payroll, CRM, accounting, and projects or inventory, and Mei the AI assistant. No card, no installation.");

const INSIDE = [
  { Icon: PeopleIcon, title: "People & HR", stat: "12 people", items: ["A month of attendance", "Shifts, holidays and leave", "Payroll and payslips"] },
  { Icon: ProjectsIcon, title: "Projects & Tasks", stat: "4 projects", items: ["Task boards with owners", "Timesheets against tasks", "Files on each project"] },
  { Icon: CrmIcon, title: "CRM", stat: "10 leads, 8 clients", items: ["Leads moving through their stages", "Follow-ups and meetings", "Leads that became clients"] },
  { Icon: FinanceIcon, title: "Accounting", stat: "14 invoices", items: ["Estimates, payments, receipts and overdue invoices", "Tax on every document, including GST for India", "Expenses and bank accounts"] },
  { Icon: PayrollIcon, title: "Payroll & Payslips", stat: "12 payslips", items: ["Last month's pay run, approved and paid", "A payslip PDF for every person", "Pay components and salary structures"] },
  { Icon: InventoryIcon, title: "Inventory & Orders", stat: "3 items, 2 warehouses", items: ["Products, orders and stock levels", "A purchase order to a vendor", "Low-stock alerts"] },
  { Icon: SparkIcon, title: "Mei AI Assistant", stat: "15 free questions", items: ["Reports from your own data", "Drafts you confirm or edit", "Answers in seconds"] },
] as const;

const INCLUDED = ["No card and no installation", "Lasts one hour, then it is deleted", "Signed in as the administrator", "Mei answers up to 15 questions, on us"];

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ edition?: string }> }) {
  const { edition } = await searchParams;
  return (
    <div className="px-4 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-[84rem] items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Free demo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl sm:leading-[1.03]">Your own copy of Crux, in ten seconds</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">Pick the apps you want to see and get a private copy with only those, and a sample company already in them. Click through everything, and ask Mei, the AI assistant, about the numbers.</p>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {INCLUDED.map((t) => (
              <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>{t}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <DemoForm defaultEdition={edition === "goods" ? "goods" : "services"} />
          <p className="mt-6 text-sm text-muted">Prefer a guided tour? <Link href="/contact" className="font-medium text-brand underline">Talk to our team</Link>.</p>
        </div>
      </div>

      <section className="mx-auto mt-28 max-w-[84rem]" aria-labelledby="inside">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">What is inside</p>
            <h2 id="inside" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">A whole company to explore, apps and all</h2>
            <p className="mt-4 text-lg text-muted">Northwind Traders is a made-up business with a month of history, so every screen has something real to look at.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4 lg:[&>*:last-child]:col-span-2">
            {INSIDE.map(({ Icon, title, stat, items }) => (
              <article key={title} className="bg-bg p-6">
                <span className="grid size-10 place-items-center bg-brand-soft text-xl text-brand"><Icon /></span>
                <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-sm font-medium text-brand">{stat}</p>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {items.map((i) => <li key={i} className="flex gap-2"><span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-brand" />{i}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto mt-28 max-w-3xl pb-8" aria-labelledby="faq">
        <h2 id="faq" className="mb-6 text-center text-3xl font-semibold tracking-tight">Good to know</h2>
        <Faq items={GENERAL_FAQ} />
      </section>
    </div>
  );
}
