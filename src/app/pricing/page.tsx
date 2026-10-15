import type { Metadata } from "next";
import { faqPage, jsonLd, pageMeta } from "@/lib/seo";
import { Cta } from "@/components/cta";
import { FaqTabs } from "@/components/faq";
import { CheckIcon } from "@/components/icons";
import { PricingTabs } from "@/components/pricing-tabs";
import { Reveal } from "@/components/reveal";
import { PRICING_PAGE_FAQ } from "@/content/faq";

export const metadata: Metadata = pageMeta("/pricing", "Pricing: one flat price, never per user", "Crux pricing: one flat monthly price by company size, never per user. Every module, Mei the AI assistant and unlimited users in every plan, on our cloud or as a licence for your own server. Prices in INR, before GST.");


const COMPARE = [
  ["Who runs it", "We host and look after it", "You run it on your server"],
  ["Updates", "Automatic, included", "One command, with a data copy first"],
  ["Backups", "Daily, kept 14 or 30 days", "Yours to set up; we help"],
  ["Where the data lives", "Your own private instance", "Your server, your database"],
  ["How you pay", "One flat price, monthly or yearly", "A licence, once or by the year"],
  ["Ready to use", "Within 24 hours", "Installed with you"],
  ["Best for", "Starting fast with no IT work", "Keeping everything in house"],
];

function HostingCompare() {
  return (
    <section className="mx-auto mt-28 max-w-[84rem] px-4 sm:px-6" aria-labelledby="compare">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">Cloud or your own server</p>
        <h2 id="compare" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">The same software either way</h2>
      </div>
      <div className="mt-10 overflow-x-auto ring-1 ring-line">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="bg-soft"><th className="w-1/4 px-6 py-4 font-medium text-muted" /><th className="px-6 py-4 font-semibold">Cloud</th><th className="px-6 py-4 font-semibold">Your own server</th></tr>
          </thead>
          <tbody className="divide-y divide-line bg-bg">
            {COMPARE.map(([k, a, b]) => (
              <tr key={k}><th scope="row" className="px-6 py-4 font-medium text-muted">{k}</th><td className="px-6 py-4">{a}</td><td className="px-6 py-4">{b}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {["Every module in every plan", "Unlimited users", "Mei AI included", "Your data, exportable any time"].map((t) => (
          <li key={t} className="flex items-center gap-2.5 bg-soft px-4 py-3 ring-1 ring-line"><span className="grid size-5 place-items-center bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>{t}</li>
        ))}
      </ul>
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
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">One price for your whole team. Never per user.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Every plan is all of Crux: every module, Mei the AI assistant, and as many people as you have. You only choose the size. Prices exclude taxes such as GST, and AI usage is billed by the provider whose key you connect.</p>
      </section>

      <section className="mx-auto mt-14 max-w-[84rem] px-4 sm:px-6" aria-label="Plans">
        <Reveal><PricingTabs /></Reveal>
      </section>

      <HostingCompare />

      <section className="mx-auto mt-28 max-w-4xl px-4 sm:px-6" aria-labelledby="faq">
        <h2 id="faq" className="mb-8 text-center text-3xl font-semibold tracking-tight">Questions, answered</h2>
        <FaqTabs groups={PRICING_PAGE_FAQ} />
      </section>
      <Cta title="Not sure which fits?" text="Try the demo, then tell us about your team and we will recommend a plan." />
    </>
  );
}
