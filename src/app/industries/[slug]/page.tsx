import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/buttons";
import { Cta } from "@/components/cta";
import { FlowLine } from "@/components/flow-line";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { IndustryArt } from "@/components/industry-art";
import { WorkflowScene } from "@/components/workflow-scene";
import { Reveal } from "@/components/reveal";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { productBySlug } from "@/content/product";
import { EDITIONS } from "@/content/pricing";
import { jsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const i = industryBySlug(slug);
  if (!i) return {};
  return pageMeta(`/industries/${i.slug}`, `Crux for ${i.name.toLowerCase()}`, `${i.intro} Unlimited users in every plan, no per-user price.`);
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const i = industryBySlug(slug);
  if (!i) notFound();
  const others = INDUSTRIES.filter((x) => x.slug !== i.slug);
  const modules = i.modules.flatMap((m) => productBySlug(m) ?? []);
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: `${SITE.url}/industries/${i.slug}`,
    name: `Crux for ${i.name.toLowerCase()}`,
    description: i.intro,
    isPartOf: { "@id": `${SITE.url}/#website` },
    about: { "@id": `${SITE.url}/#software` },
    audience: { "@type": "BusinessAudience", name: i.name },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <section className="relative mx-auto grid max-w-[84rem] items-center gap-12 px-4 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_1.15fr]">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <div>
          <Link href="/industries" className="text-sm font-semibold tracking-wide text-brand uppercase">Industries</Link>
          <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl">{i.headline}</h1>
          <p className="mt-5 text-lg text-muted">{i.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/demo?edition=${i.edition}`} className={buttonClass("primary", "lg")}>Start a free demo</Link>
            <Link href="/contact" className={buttonClass("outline", "lg")}>Talk to sales</Link>
          </div>
          <p className="mt-6 text-sm text-muted">Runs on the {EDITIONS.find((e) => e.id === i.edition)?.name}. Usually the <Link href="/pricing" className="font-semibold text-brand underline">{i.plan.id}</Link> plan. {i.plan.why}</p>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Apps switched on to begin with">
            {i.apps.map((a) => <li key={a} className="rounded-full bg-brand-soft px-3.5 py-1 text-sm font-medium text-brand ring-1 ring-line">{a}</li>)}
          </ul>
        </div>
        <div className="relative">
          <WorkflowScene stages={i.scene} />
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {i.stats.map((s) => (
              <li key={s.label} className="bg-soft px-4 py-3 ring-1 ring-line">
                <p className="text-lg font-semibold tracking-tight text-brand">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="fits">
        <Reveal>
          <h2 id="fits" className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">What it does for you</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {i.fits.map((f) => (
              <li key={f.title} className="group bg-bg p-6 ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand/30">
                <span className="grid size-9 place-items-center bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white"><CheckIcon className="size-4" /></span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {i.words && (
        <section className="mx-auto mt-24 grid max-w-[84rem] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2" aria-labelledby="words">
          <IndustryArt slug={i.slug} words={i.words.map((w) => w.used)} className="h-80" />
          <div>
            <h2 id="words" className="text-3xl font-semibold tracking-tight sm:text-4xl">Speaks your language</h2>
            <p className="mt-3 text-muted">The product starts with the words your trade uses. You can rename any of them.</p>
            <dl className="mt-6 divide-y divide-line ring-1 ring-line">
              {i.words.map((w) => (
                <div key={w.generic} className="flex items-center justify-between gap-4 bg-bg px-5 py-3.5 text-sm">
                  <dt className="text-muted line-through decoration-line">{w.generic}</dt>
                  <dd className="flex items-center gap-2 font-semibold"><ArrowRightIcon className="size-3.5 text-brand" />{w.used}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="flow">
        <h2 id="flow" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">A normal week</h2>
        <div className="mt-12"><FlowLine steps={i.flow} /></div>
        {i.notes && (
          <ul className="mx-auto mt-8 max-w-2xl space-y-2 text-center text-sm text-muted">
            {i.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        )}
      </section>

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="mods">
        <h2 id="mods" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">The apps behind it</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <li key={m.slug}>
              <Link href={`/product/${m.slug}`} className="group flex h-full flex-col bg-soft p-6 ring-1 ring-line transition-all hover:-translate-y-1 hover:bg-bg hover:shadow-lg">
                <h3 className="font-semibold">{m.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{m.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">Explore <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="others">
        <h2 id="others" className="text-center text-xl font-semibold">Other industries</h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {others.map((o) => <li key={o.slug}><Link href={`/industries/${o.slug}`} className={buttonClass("outline", "md")}>{o.name}</Link></li>)}
        </ul>
      </section>

      <Cta title={`Run your ${i.name.toLowerCase()} on Crux`} text="Try the demo, then tell us how you work. We set it up and you are running within 24 hours." />
    </>
  );
}
