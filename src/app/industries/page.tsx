import type { Metadata } from "next";
import Link from "next/link";
import { Cta } from "@/components/cta";
import { ArrowRightIcon } from "@/components/icons";
import { IndustryArt } from "@/components/industry-art";
import { Reveal } from "@/components/reveal";
import { INDUSTRIES } from "@/content/industries";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/industries", "Crux for your industry", "Crux for software and IT companies, agencies, clinics, trades and field service, distributors and retailers, and consultancies. One system, started with the words and defaults of your trade.");

export default function IndustriesPage() {
  return (
    <>
      <section className="relative mx-auto max-w-[84rem] px-4 pt-20 text-center sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">Industries</p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-semibold tracking-tighter sm:text-6xl">One system, started the way your trade works</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">Crux is not made for one kind of company. We switch on the apps you need and set the words your trade uses, so a clinic sees Patients and a field team sees Jobs. Pick the closest fit; everything can be changed.</p>
      </section>
      <section className="mx-auto mt-14 max-w-[84rem] px-4 sm:px-6" aria-label="Industries">
        <Reveal>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="group flex h-full flex-col overflow-hidden bg-bg ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-brand/30">
                  <IndustryArt slug={i.slug} words={i.nav} className="h-56 rounded-none ring-0" />
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-xl font-semibold tracking-tight">{i.name}</h2>
                    <p className="mt-2 flex-1 text-muted">{i.short}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">See how it fits <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="mt-8 text-center text-muted">Do not see your trade? Tell us how you work and we will recommend a plan and set it up. <Link href="/contact" className="font-medium text-brand underline">Talk to us</Link></p>
      </section>
      <Cta title="See it set up for your trade" text="Start a demo, or tell us your industry and we will prepare your system within 24 hours." />
    </>
  );
}
