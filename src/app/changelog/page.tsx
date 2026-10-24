import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { buttonClass } from "@/components/buttons";
import { ChangelogNav } from "@/components/changelog-nav";
import { Cta } from "@/components/cta";
import { CheckIcon } from "@/components/icons";
import { ENTRIES, dayLabel, longDay, sortedEntries } from "@/content/changelog";

export const metadata: Metadata = pageMeta("/changelog", "Changelog", "What shipped in Crux and when: two editions, estimates and invoices, orders and a product catalog, modules you can pick, people, projects, CRM, finance, integrations and the Mei AI assistant.");

const LIST = sortedEntries(ENTRIES);

export default function ChangelogPage() {
  const latest = LIST[0];
  return (
    <>
      <section className="relative mx-auto max-w-[84rem] px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">Changelog</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">What is new in Crux</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Every update since June, newest first.</p>
        {latest && (
          <ul className="mt-8 flex flex-wrap justify-center gap-2 text-sm" aria-label="At a glance">
            <li className="rounded-full bg-soft px-4 py-1.5 font-medium ring-1 ring-line">{LIST.length} updates</li>
            <li className="rounded-full bg-brand-soft px-4 py-1.5 font-medium text-brand ring-1 ring-line">Latest: {longDay(latest.date)}</li>
          </ul>
        )}
      </section>

      <div className="mx-auto mt-16 grid max-w-[84rem] gap-12 px-4 sm:px-6 lg:grid-cols-[17rem_1fr] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="mb-4 pl-1 text-sm font-semibold">Timeline</p>
            <ChangelogNav entries={LIST} />
          </div>
        </aside>

        <ol className="min-w-0 max-w-3xl divide-y divide-line">
          {LIST.map((e, i) => (
            <li key={`${e.date}-${i}`} id={`u-${i}`} className="scroll-mt-32 py-10 first:pt-0">
              <div className="flex flex-wrap items-center gap-3">
                <time dateTime={e.date} className="rounded-full bg-soft px-3 py-1 text-sm font-semibold tabular-nums ring-1 ring-line">{dayLabel(e.date)}</time>
                <span className="text-xs font-semibold tracking-wide text-brand uppercase">{e.area}</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">{e.title}</h2>
              <p className="mt-2 text-lg text-muted">{e.text}</p>
              <ul className="mt-5 space-y-2.5">
                {e.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <p className="mx-auto mt-20 max-w-2xl px-4 text-center text-sm text-muted">
        Want something that is not here? <Link href="/contact" className="font-medium text-brand underline">Tell us</Link>, or <Link href="/demo" className={buttonClass("outline", "sm", "ml-1")}>try the demo</Link>
      </p>
      <Cta title="See what is new for yourself" text="Try the demo, or talk to us and run your business on Crux within 24 hours." />
    </>
  );
}
