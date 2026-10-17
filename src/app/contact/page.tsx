import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { APP_GROUPS } from "@/content/pricing";
import { ContactForm } from "@/components/contact-form";
import { TalkOptions } from "@/components/talk-options";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta("/contact", "Contact sales", "Talk to the Crux team: tell us about your company and we recommend the plan and licence that fit, and set up your system within 24 hours. We reply within one working day.");

type Interest = "cloud" | "on_prem" | "other";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ interest?: string; plan?: string; apps?: string; term?: string; server?: string }> }) {
  const { interest, plan, apps, term, server } = await searchParams;
  const wanted = (apps ?? "").split(",").flatMap((a) => APP_GROUPS.find((g) => g.id === a)?.name ?? []);
  const initialPlan = plan === "start" || plan === "grow" || plan === "complete" ? plan : "";
  const initial: Interest = interest === "other" ? interest : "on_prem";
  return (
    <div className="px-4 pt-16 pb-8 sm:px-6 sm:pt-20">
      <div className="mx-auto grid max-w-[84rem] grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="min-w-0 lg:col-span-5">
          <p className="text-sm font-semibold tracking-wide text-brand uppercase">Contact sales</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl sm:leading-[1.03]">Tell us what you need</h1>
          <p className="mt-5 text-lg text-muted">Send a short message and we will recommend the plan that fits. A person replies within one working day.</p>

          <p className="mt-8 mb-3 text-sm font-medium text-muted">Rather talk now?</p>
          <TalkOptions compact />

          <ul className="mt-8 space-y-2 text-sm">
            <li><Link href="/demo" className="font-medium text-brand underline">Try a private demo first</Link></li>
            <li><Link href="/pricing" className="font-medium text-brand underline">See the plans and prices</Link></li>
            <li>Or email <a href={`mailto:${SITE.email}`} className="font-medium text-brand underline">{SITE.email}</a></li>
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <ContactForm defaultInterest={initial} defaultPlan={initialPlan} defaultMessage={[wanted.length ? `I would like: ${wanted.join(", ")}.` : "", term === "term1" ? "A 1-year licence." : term === "term2" ? "A 2-year licence." : term === "lifetime" ? "A lifetime licence." : "", server === "own" ? "I already have a server." : term === "lifetime" ? "I would like the first year of the server included." : ""].filter(Boolean).join(" ")} />
        </div>
      </div>
    </div>
  );
}
