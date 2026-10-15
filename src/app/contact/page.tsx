import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { FaqTabs } from "@/components/faq";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { PRICING_PAGE_FAQ } from "@/content/faq";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta("/contact", "Contact sales", "Talk to the Crux team: tell us about your company and we recommend the cloud plan or licence that fits, and set up your system within 24 hours. We reply within one working day.");

type Interest = "cloud" | "on_prem" | "other";

const NEXT = [
  ["We read your message", "A person reads it, not a bot, and checks what you want to run."],
  ["We reply within one working day", "With the plan or licence that fits your team, the price, and the next step."],
  ["A walk-through, if you want one", "A call where we show your use case in the system and answer what is left."],
] as const;

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ interest?: string; plan?: string }> }) {
  const { interest, plan } = await searchParams;
  const initialPlan = plan === "small" || plan === "business" || plan === "larger" ? plan : "";
  const initial: Interest = interest === "on_prem" || interest === "other" ? interest : "cloud";
  return (
    <div className="px-4 pt-16 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-[84rem] items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Contact sales</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl sm:leading-[1.03]">Tell us about your team</h1>
          <p className="mt-5 text-lg text-muted">Say what you want to run and how big your team is, and we will recommend the plan that fits. No pushy follow-ups.</p>

          <p className="mt-6 inline-flex items-center gap-2 bg-ok-soft px-3.5 py-2 text-sm font-semibold text-ok">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping bg-ok/60 motion-reduce:animate-none" /><span className="relative inline-flex size-2 bg-ok" /></span>
            We reply within one working day
          </p>

          <ol className="mt-10 divide-y divide-line ring-1 ring-line">
            {NEXT.map(([t, d], i) => (
              <li key={t} className="flex gap-4 bg-bg p-5">
                <span className="grid size-9 shrink-0 place-items-center bg-accent text-sm font-semibold text-white">{i + 1}</span>
                <div>
                  <p className="font-semibold">{t}</p>
                  <p className="mt-0.5 text-sm text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid gap-px bg-line ring-1 ring-line">
            <Link href="/demo" className="group flex items-center justify-between gap-4 bg-bg p-5 transition-colors hover:bg-soft">
              <span>
                <span className="block font-semibold">Rather try it first?</span>
                <span className="block text-sm text-muted">A private demo in ten seconds, with Mei included.</span>
              </span>
              <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/pricing" className="group flex items-center justify-between gap-4 bg-bg p-5 transition-colors hover:bg-soft">
              <span>
                <span className="block font-semibold">Looking for prices?</span>
                <span className="block text-sm text-muted">Every plan, side by side, and the cost of running it yourself.</span>
              </span>
              <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
            </Link>
            <a href={`mailto:${SITE.email}`} className="group flex items-center justify-between gap-4 bg-bg p-5 transition-colors hover:bg-soft">
              <span>
                <span className="block font-semibold">Prefer email?</span>
                <span className="block text-sm text-muted">{SITE.email}</span>
              </span>
              <ArrowRightIcon className="size-5 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <ul className="mt-8 space-y-2.5 text-sm">
            {["Every feature and unlimited users in every plan", "Cloud or your own server, the same software", "Your data is yours and can be exported any time"].map((t) => (
              <li key={t} className="flex gap-2.5"><span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>{t}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <ContactForm defaultInterest={initial} defaultPlan={initialPlan} />
        </div>
      </div>

      <section className="mx-auto mt-28 max-w-4xl pb-8" aria-labelledby="faq">
        <h2 id="faq" className="mb-8 text-center text-3xl font-semibold tracking-tight">Quick answers</h2>
        <FaqTabs groups={PRICING_PAGE_FAQ} />
      </section>
    </div>
  );
}
