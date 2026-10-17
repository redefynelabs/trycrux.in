import type { Metadata } from "next";
import { faqPage, jsonLd, pageMeta } from "@/lib/seo";
import { Cta } from "@/components/cta";
import { FaqTabs } from "@/components/faq";
import { TaxNote } from "@/components/currency-picker";
import { PricingTabs } from "@/components/pricing-tabs";
import { Reveal } from "@/components/reveal";
import { PRICING_PAGE_FAQ } from "@/content/faq";
import { PlanBuilder } from "@/components/plan-builder";
import { APP_GROUPS, HOW_PRICING_WORKS, PLAN_MATRIX } from "@/content/pricing";

export const metadata: Metadata = pageMeta("/pricing", "Pricing: three plans, never per user", "Crux pricing: Start, Grow and Complete, chosen by the apps you need, never per user. Unlimited users and the Mei AI assistant in every plan, as a licence for one year, two years or for good on your own server. Prices in INR, USD, GBP, EUR and AED, before tax.");


function HowPricingWorks() {
  return (
    <section className="mx-auto mt-28 max-w-[84rem] px-4 sm:px-6" aria-labelledby="how-pricing">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">How pricing works</p>
        <h2 id="how-pricing" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Choose the apps, not the headcount</h2>
      </div>
      <ol className="mt-10 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
        {HOW_PRICING_WORKS.map((s, i) => (
          <li key={s.title} className="bg-bg p-6">
            <span className="grid size-8 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{i + 1}</span>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        ))}
      </ol>
      <h3 className="mt-14 text-center text-xl font-semibold">The six app groups, and Mei with all of them</h3>
      <ul className="mt-6 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
        {APP_GROUPS.map((g) => (
          <li key={g.id} className="bg-bg p-5">
            <p className="font-semibold">{g.name}</p>
            <p className="mt-1 text-sm text-muted">{g.text}{g.needs ? " Comes with People & HR." : ""}</p>
          </li>
        ))}
      </ul>
      <h3 className="mt-14 text-center text-xl font-semibold">What differs between the plans</h3>
      <div className="mt-6 overflow-x-auto ring-1 ring-line">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead>
            <tr className="bg-soft"><th className="px-6 py-4" /><th className="px-4 py-4 font-semibold">Start</th><th className="px-4 py-4 font-semibold text-brand">Grow</th><th className="px-4 py-4 font-semibold">Complete</th></tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {PLAN_MATRIX.map((r) => (
              <tr key={r.name}><th scope="row" className="px-6 py-3 font-normal text-muted">{r.name}</th><td className="px-4 py-3">{r.start}</td><td className="px-4 py-3">{r.grow}</td><td className="px-4 py-3">{r.complete}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-center text-sm text-muted">Payroll needs People & HR, so choosing Payroll adds it. Your mix can change later; going past a plan&apos;s limit moves you to the next plan.</p>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPage(PRICING_PAGE_FAQ.flatMap((g) => g.items))) }} />
      <section className="relative mx-auto max-w-[84rem] px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">Pricing</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">Pick the apps you need. Never pay per user.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Three plans, from selling and billing to payroll and stock. Mei, the AI assistant, comes with every plan, and so do as many people as you have. Buy a licence for one year, two years or for good, and run it on your own server. <TaxNote /> AI usage is billed by the provider whose key you connect.</p>
      </section>

      <section className="mx-auto mt-14 max-w-[84rem] px-4 sm:px-6" aria-label="Plans">
        <Reveal><PricingTabs /></Reveal>
      </section>

      <section className="mx-auto mt-28 max-w-[84rem] px-4 sm:px-6" aria-labelledby="builder">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Build your plan</p>
          <h2 id="builder" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Only need sales, stock and HR? Pick just those.</h2>
          <p className="mt-3 text-muted">Tick the app groups your team needs and see the plan and the licence price for one year, two years or for good.</p>
        </div>
        <div className="mt-10"><PlanBuilder /></div>
      </section>

      <HowPricingWorks />

      <section className="mx-auto mt-28 max-w-4xl px-4 sm:px-6" aria-labelledby="faq">
        <h2 id="faq" className="mb-8 text-center text-3xl font-semibold tracking-tight">Questions, answered</h2>
        <FaqTabs groups={PRICING_PAGE_FAQ} />
      </section>
      <Cta title="Not sure which fits?" text="Try the demo, then tell us about your team and we will recommend a plan." />
    </>
  );
}
