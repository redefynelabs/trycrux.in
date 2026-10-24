import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppWindow } from "@/components/app-window";
import { buttonClass } from "@/components/buttons";
import { Cta } from "@/components/cta";
import { FlowLine } from "@/components/flow-line";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { MeiDemo } from "@/components/mei-demo";
import { Reveal } from "@/components/reveal";
import { industryBySlug } from "@/content/industries";
import { PRODUCT_PAGES, productBySlug } from "@/content/product";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return PRODUCT_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) return {};
  return pageMeta(`/product/${p.slug}`, `${p.name}: ${p.tagline}`, `${p.intro} ${p.features.slice(0, 4).map((f) => f.title).join(", ")}. Included in every Crux plan.`);
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const others = PRODUCT_PAGES.filter((x) => x.slug !== p.slug);
  const industries = p.industries.flatMap((s) => industryBySlug(s) ?? []);
  return (
    <>
      <section className="relative mx-auto max-w-[84rem] px-4 pt-16 sm:px-6 sm:pt-24">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-96" />
        <div className={p.visual ? "grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]" : "mx-auto max-w-3xl text-center"}>
          <div>
            <Link href="/product" className="text-sm font-semibold tracking-wide text-brand uppercase">The apps</Link>
            <h1 className="mt-3 text-4xl font-semibold tracking-tighter sm:text-6xl">{p.name}</h1>
            <p className="mt-3 text-xl font-medium text-fg/80">{p.tagline}</p>
            <p className="mt-5 text-lg text-muted">{p.intro}</p>
            <div className={p.visual ? "mt-8 flex flex-wrap gap-3" : "mt-8 flex flex-wrap justify-center gap-3"}>
              <Link href="/demo" className={buttonClass("primary", "lg")}>Start a free demo</Link>
              <Link href="/pricing" className={buttonClass("outline", "lg")}>See pricing</Link>
            </div>
            <p className="mt-4 text-sm text-muted">{p.plan === "all" ? "In every plan." : "One of the app groups you can pick in any plan."}{p.edition === "services" ? " Part of the Services edition." : p.edition === "goods" ? " Part of the Goods edition." : " In both editions."} <Link href="/pricing#builder" className="font-medium text-brand underline">Build your plan</Link></p>
          </div>
          {p.visual && <AppWindow nav={p.nav} visual={p.visual} toasts={p.toasts} />}
        </div>
        {!p.visual && <div className="mt-14"><MeiDemo /></div>}
      </section>

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="feat">
        <Reveal>
          <h2 id="feat" className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight sm:text-4xl">What is in it</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {p.features.map((f) => (
              <li key={f.title} className="group bg-bg p-6 ring-1 ring-line transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-brand/30">
                <span className="grid size-9 place-items-center bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white"><CheckIcon className="size-4" /></span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="steps">
        <h2 id="steps" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">How it goes</h2>
        <div className="mt-12"><FlowLine steps={p.steps} /></div>
        <ul className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          {p.facts.map((f) => <li key={f} className="bg-soft px-4 py-3 text-sm ring-1 ring-line">{f}</li>)}
        </ul>
      </section>

      {industries.length > 0 && (
        <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="who">
          <h2 id="who" className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Who leans on it</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {industries.map((i) => (
              <li key={i.slug}>
                <Link href={`/industries/${i.slug}`} className="group flex h-full flex-col bg-soft p-6 ring-1 ring-line transition-all hover:-translate-y-1 hover:bg-bg hover:shadow-lg">
                  <h3 className="font-semibold">{i.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{i.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">See the industry <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[84rem] px-4 sm:px-6" aria-labelledby="more">
        <h2 id="more" className="text-center text-xl font-semibold">Other apps</h2>
        <ul className="mt-5 flex flex-wrap justify-center gap-2">
          {others.map((o) => <li key={o.slug}><Link href={`/product/${o.slug}`} className={buttonClass("outline", "md")}>{o.name}</Link></li>)}
        </ul>
      </section>

      <Cta title={`Try ${p.name} on a demo`} text="A private copy with a sample company, ready in seconds. Then tell us how you work and we set it up within 24 hours." />
    </>
  );
}
