import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { DemoForm } from "@/components/demo-form";
import { Faq } from "@/components/faq";
import { CheckIcon, CrmIcon, FinanceIcon, PeopleIcon, ProjectsIcon, SparkIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { GENERAL_FAQ } from "@/content/faq";

export const metadata: Metadata = pageMeta("/demo", "Try Crux free", "Your own private copy of Crux with a sample company, ready in seconds: HR, projects, CRM, sales and finance with real-looking data, and Mei the AI assistant. No card, no installation.");

const HOW = [
  ["Tell us who you are", "Your name and email, and what you want to see first. Nothing else is needed."],
  ["We build your copy", "A private copy of the system with a sample company already in it, in about ten seconds."],
  ["Sign in and explore", "You are the administrator, so you can see and do everything, and ask Mei anything."],
] as const;

const INSIDE = [
  { Icon: PeopleIcon, title: "People & HR", stat: "12 people", items: ["A month of attendance", "Shifts, holidays and leave", "Employee documents"] },
  { Icon: ProjectsIcon, title: "Projects & Tasks", stat: "4 projects", items: ["Task boards with owners", "Timesheets against tasks", "Files on each project"] },
  { Icon: CrmIcon, title: "CRM & Sales", stat: "10 leads, 8 clients", items: ["A pipeline in motion", "Follow-ups and meetings", "Leads that became clients"] },
  { Icon: FinanceIcon, title: "Finance & Billing", stat: "14 invoices", items: ["Payments and overdue invoices", "GST on every document", "Expenses and bank accounts"] },
  { Icon: SparkIcon, title: "Mei AI Assistant", stat: "15 free questions", items: ["Reports from your own data", "Drafts you confirm or edit", "Answers in seconds"] },
] as const;

const INCLUDED = ["No card and no installation", "Lasts one hour, then it is deleted", "Signed in as the administrator", "Mei answers up to 15 questions, on us", "Nothing is emailed or sent from a demo", "Your details are used for this demo and one follow-up"];

export default function DemoPage() {
  return (
    <div className="px-4 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-[84rem] items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Free demo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl sm:leading-[1.03]">Your own copy of Crux, in ten seconds</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">A private copy of the system with a company, people, clients, projects and invoices already in it. Click through everything, and ask Mei, the AI assistant, about the numbers.</p>

          <ol className="mt-10 divide-y divide-line ring-1 ring-line">
            {HOW.map(([t, d], i) => (
              <li key={t} className="flex gap-4 bg-bg p-5">
                <span className="grid size-9 shrink-0 place-items-center bg-accent text-sm font-semibold text-white">{i + 1}</span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="mt-0.5 text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
            {INCLUDED.map((t) => (
              <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>{t}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <DemoForm />
        </div>
      </div>

      <section className="mx-auto mt-28 max-w-[84rem]" aria-labelledby="inside">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold tracking-wide text-brand uppercase">What is inside</p>
            <h2 id="inside" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">A whole company to explore</h2>
            <p className="mt-4 text-lg text-muted">Northwind Traders is a made-up business with a month of history, so every screen has something real to look at.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-5">
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
