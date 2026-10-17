import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/cta";
import { ArrowRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { PRODUCT_PAGES } from "@/content/product";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/product", "Crux apps: HR, payroll, projects, CRM, finance, inventory and AI", "Every Crux app on its own page: People & HR, Payroll, Projects & Tasks, CRM & Sales, Finance & Billing, Inventory & Purchasing and the Mei AI assistant. Three plans, chosen by the apps you need.");

export default function ProductIndex() {
  return (
    <>
      <section className="relative mx-auto max-w-[84rem] px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">The apps</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">Six apps, Mei included, one set of records</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Pick the groups your team needs: any two on Start, any four on Grow, all of them on Complete. Change the mix as you grow, with nothing retyped.</p>
      </section>
      <section className="mx-auto mt-14 max-w-[84rem] px-4 sm:px-6" aria-label="Apps">
        <Reveal>
          <ul className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_PAGES.map((p) => (
              <li key={p.slug} className="bg-bg">
                <Link href={`/product/${p.slug}`} className="group flex h-full flex-col p-8 transition-colors hover:bg-soft">
                  <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">{p.name}{p.optional && <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-medium text-muted ring-1 ring-line">Optional</span>}</h2>
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
