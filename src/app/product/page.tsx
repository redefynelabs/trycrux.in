import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/cta";
import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { EDITIONS } from "@/content/pricing";
import { PRODUCT_PAGES } from "@/content/product";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/product", "Crux apps: CRM, projects, HR, payroll, accounting, inventory and AI", "Crux comes as a Services edition and a Goods edition. Every app on its own page: CRM, Projects & Tasks, People & HR, Payroll, Accounting, Inventory & Orders and the Mei AI assistant. Three plans, chosen by the apps you need.");

export default function ProductIndex() {
  return (
    <>
      <section className="relative mx-auto max-w-[84rem] px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">The apps</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">Two editions, Mei included, one set of records</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Pick the edition that matches what you sell, then the apps your team needs: any two on Start, any four on Grow, all five on Complete. Change the mix as you grow, with nothing retyped.</p>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-px bg-line text-left ring-1 ring-line sm:grid-cols-2">
          {EDITIONS.map((e) => (
            <li key={e.id} className="bg-bg p-6">
              <h2 className="text-lg font-semibold tracking-tight">{e.name}</h2>
              <p className="mt-1 text-sm font-medium text-brand">{e.for}</p>
              <p className="mt-2 text-sm text-muted">{e.text}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mx-auto mt-14 max-w-[84rem] px-4 sm:px-6" aria-label="Apps">
        <Reveal>
          <ul className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_PAGES.map((p) => (
              <li key={p.slug} className="bg-bg">
                <Link href={`/product/${p.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-soft">
                  <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">{p.name}{p.edition && <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">{p.edition === "services" ? "Services edition" : "Goods edition"}</span>}</h2>
                  <p className="mt-2 flex-1 text-muted">{p.tagline}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {p.features.slice(0, 3).map((f) => <li key={f.title} className="rounded-full bg-soft px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">{f.title}</li>)}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Explore <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
      <Cta />
    </>
  );
}
