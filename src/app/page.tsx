import type { Metadata } from "next";
import Link from "next/link";
import { IntegrationsGrid } from "@/components/bento";
import { buttonClass } from "@/components/buttons";
import { Cta } from "@/components/cta";
import { FaqTabs } from "@/components/faq";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { ArrowRightIcon, SparkIcon } from "@/components/icons";
import { DemoVideo } from "@/components/demo-video";
import BlurText from "@/components/react-bits/BlurText";
import { Reveal } from "@/components/reveal";
import { ShimmerLink } from "@/components/shimmer-link";
import { HowItWorks } from "@/components/how-it-works";
import { ControlBento } from "@/components/control-bento";
import { TaxNote } from "@/components/currency-picker";
import { PricingTabs } from "@/components/pricing-tabs";
import { OneSystem } from "@/components/one-system";
import { MeiSection } from "@/components/mei-section";
import { ModuleGrid } from "@/components/module-grid";
import { AskAi } from "@/components/ask-ai";
import { FAQ_GROUPS } from "@/content/faq";
import { faqPage, jsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

function SectionHead({ id, eyebrow, title, text }: { id: string; eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPage(FAQ_GROUPS.flatMap((g) => g.items))) }} />
      <section aria-label="hero" className="relative isolate px-4 pt-14 text-center sm:px-6 sm:pt-32">
        <HeroBackdrop />
        <Link href="#mei" className="group mx-auto inline-flex items-center gap-2 rounded-full bg-bg py-1 pr-3 pl-1 text-xs font-medium whitespace-nowrap text-fg sm:gap-2.5 sm:pr-3.5 sm:text-sm shadow-sm ring-1 ring-brand/20 transition-colors hover:bg-brand-soft">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-xs font-semibold text-white"><SparkIcon className="size-3.5" /> AI</span>
          The AI-powered business operating system
          <ArrowRightIcon className="size-3.5 text-brand transition-transform group-hover:translate-x-0.5" />
        </Link>
        <h1 className="mx-auto mt-6 max-w-[46rem] text-[2.6rem] leading-[1.05] font-semibold tracking-tighter sm:mt-8 sm:text-7xl sm:leading-[1.02]">
          <BlurText text="The only software your business needs." animateBy="words" delay={90} className="justify-center gradient-text" />
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted sm:mt-7 sm:text-xl sm:leading-normal">
          Crux is the system at the heart of your company. People, projects, sales and money run on one set of records, and Mei, your AI assistant, answers questions, drafts the paperwork and clears the busywork. Live within 24 hours, with every feature, unlimited users and no per-user price.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
          <ShimmerLink href="/demo">Start a free demo</ShimmerLink>
          <Link href="/contact" className={buttonClass("outline", "lg")}>Talk to sales</Link>
        </div>
        <p className="mt-5 text-xs text-muted sm:text-sm">Free private demo · no card · set up and running within 24 hours</p>
        <div className="mt-12 pb-16 sm:mt-24 sm:pb-28">
          <Reveal><DemoVideo /></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[84rem] px-4 sm:px-6 pt-10" aria-label="Connects to">
        <p className="mb-6 text-center text-sm font-medium text-muted">Works with the tools your team already uses</p>
        <IntegrationsGrid />
      </section>

      <section className="mx-auto mt-32 max-w-[84rem] px-4 sm:px-6" aria-labelledby="features">
        <Reveal><SectionHead id="features" eyebrow="Features" title="Every part of the company, in one system" text="Four modules that share one set of people, clients and permissions, so nothing is typed twice. Use all of them, or only the ones you need." /></Reveal>
        <Reveal delay={0.1} className="mt-14"><ModuleGrid /></Reveal>
      </section>

      <section className="mx-auto mt-32 max-w-[84rem] px-4 sm:px-6" aria-labelledby="one">
        <Reveal><SectionHead id="one" eyebrow="Why one system" title="Replace the pile of tools" text="Most growing companies run on five logins and a lot of copy-and-paste. Here it is one set of records." /></Reveal>
        <div className="mt-14"><OneSystem /></div>
      </section>

      <MeiSection />

      <section className="mx-auto mt-32 max-w-[84rem] px-4 sm:px-6" aria-labelledby="how">
        <Reveal><SectionHead id="how" eyebrow="How it works" title="Simple. Seamless. Smart." text="From first look to running your business, within 24 hours. Click a step to see it." /></Reveal>
        <Reveal delay={0.1} className="mt-14"><HowItWorks /></Reveal>
      </section>

      <section className="mx-auto mt-32 max-w-[84rem] px-4 sm:px-6" aria-labelledby="control">
        <Reveal><SectionHead id="control" eyebrow="Control" title="Built for secure growth" text="The things that matter once you have more than ten people: who can do what, who did what, and who holds the keys." /></Reveal>
        <Reveal delay={0.1} className="mt-14"><ControlBento /></Reveal>
      </section>

      <section className="mx-auto mt-32 max-w-[84rem] px-4 sm:px-6" aria-labelledby="ways">
        <Reveal><SectionHead id="ways" eyebrow="Pricing" title="Pay for the app, not per user" text="Every feature and unlimited users in every plan. Choose how you want to run it." /></Reveal>
        <Reveal delay={0.1} className="mt-14"><PricingTabs /></Reveal>
        <p className="mt-6 text-center text-sm text-muted"><TaxNote /> <Link href="/pricing" className="font-medium text-brand underline">Full pricing details</Link></p>
      </section>

      <section className="mx-auto mt-32 max-w-4xl px-4 sm:px-6" aria-labelledby="faq">
        <Reveal><SectionHead id="faq" eyebrow="FAQ" title="Frequently asked questions" text="The product, the price, what it connects to, and how your data is kept safe." /></Reveal>
        <Reveal className="mt-10"><FaqTabs groups={FAQ_GROUPS} /></Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-4xl px-4 sm:px-6" aria-labelledby="ask-ai">
        <Reveal><AskAi /></Reveal>
      </section>

      <Cta title="Run your whole business on one AI-powered system" text="Try the demo today, or talk to us and run your business on Crux within 24 hours." />
    </>
  );
}
