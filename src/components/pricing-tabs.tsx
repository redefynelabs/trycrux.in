"use client";

import Link from "next/link";
import { animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/buttons";
import { CheckIcon, SparkIcon } from "@/components/icons";
import { useCurrency } from "@/components/currency-picker";
import { AMC_TEXT, CLOUD, OWN_SERVER, LICENCE_INCLUDED, TERMS, amcPrice, licenceTotal, money, serverYearValue, type TermId } from "@/content/pricing";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** The currency sign before a price, smaller than the figure. */
function CurrencySign({ currency }: { currency: CurrencyCode }) {
  const s = CURRENCIES[currency].symbol;
  return <span className={cn("font-semibold text-muted", s.length > 1 ? "text-xl" : "text-3xl")}>{s}</span>;
}

/** A price that counts to its new value when the plan or billing period changes. It renders the real figure from the start. */
function Price({ value, currency }: { value: number; currency: CurrencyCode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString(CURRENCIES[currency].locale);
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, currency]);
  return <span ref={ref} className="text-5xl font-semibold tracking-tighter text-fg tabular-nums">{value.toLocaleString(CURRENCIES[currency].locale)}</span>;
}

function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { id: T; label: string; badge?: string; icon?: React.ReactNode }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex rounded-full bg-soft p-1 ring-1 ring-line">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} onClick={() => onChange(o.id)} data-track="tab_select" data-track-tab-group={label} data-track-tab-name={o.label} className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors", o.id === value ? "bg-accent text-white" : "text-muted hover:text-fg")}>
          {o.icon}
          {o.label}
          {o.badge && <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", o.id === value ? "bg-white/20 text-white" : "bg-ok-soft text-ok")}>{o.badge}</span>}
        </button>
      ))}
    </div>
  );
}

/** One plan: a band on top (what it is for), then price, specs, what is included and the button. */
function Plan({ band, popular, children }: { band: string; popular?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col bg-bg">
      <div className={cn("flex h-10 items-center px-8 text-xs font-semibold tracking-wide uppercase", popular ? "bg-brand text-white" : "bg-soft text-muted")}>{band}</div>
      <div className="flex flex-1 flex-col p-8">{children}</div>
      {popular && <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-2 ring-brand ring-inset" />}
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-sm">
      <dt className="text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function Tick() {
  return <span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-ok-soft text-ok"><CheckIcon className="size-3" /></span>;
}

/** One plan card: its price, what it adds, capacity and the button. Used for a licence. */
function PlanCard({ plan, price, priceNote, specs, bullets, href, cta }: { plan: (typeof CLOUD.tiers)[number]; price: ReactNode; priceNote: string; specs: [string, string][]; bullets: string[]; href: string; cta: string }) {
  return (
    <Plan popular={plan.popular} band={plan.popular ? `Most chosen · ${plan.for}` : plan.for}>
      <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
      <p className="mt-6 flex items-baseline gap-1.5 whitespace-nowrap">{price}</p>
      <p className="mt-2 text-xs text-muted">{priceNote}</p>
      <p className="mt-4 flex items-center gap-2 bg-brand-soft px-3 py-2 text-sm font-medium text-brand"><SparkIcon className="size-4" /> Mei AI assistant included</p>
      <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
        {bullets.map((b) => <li key={b} className="flex gap-2.5"><Tick />{b}</li>)}
      </ul>
      <dl className="mt-6 divide-y divide-line border-y border-line">
        {specs.map(([k, v]) => <SpecRow key={k} k={k} v={v} />)}
      </dl>
      <div className="flex-1" />
      <Link href={href} className={buttonClass(plan.popular ? "brand" : "primary", "lg", "mt-8 w-full")}>{cta}</Link>
    </Plan>
  );
}

/** Licences for your own server, by plan, for one year, two years or for good, with prices that count to their new value. */
export function PricingTabs({ showExtras = true }: { showExtras?: boolean }) {
  const [term, setTerm] = useState<TermId>("lifetime");
  const [haveServer, setHaveServer] = useState(false);
  const currency = useCurrency();
  const plans = CLOUD.tiers.filter((t) => t.perMonth);
  const termInfo = TERMS.find((t) => t.id === term)!;

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <Segmented label="Licence term" value={term} onChange={setTerm} options={TERMS.map((t) => ({ id: t.id, label: t.id === "lifetime" ? "Lifetime" : t.id === "term1" ? "1 year" : "2 years", badge: t.id === "lifetime" ? "Pay once" : undefined }))} />
        <p className="text-sm text-muted">{termInfo.note} Runs on your own server, and everything stays private to you.</p>
        {term === "lifetime" && (
          <label className="flex cursor-pointer items-center gap-2.5 bg-soft px-4 py-2.5 text-sm ring-1 ring-line">
            <input type="checkbox" checked={haveServer} onChange={(e) => setHaveServer(e.target.checked)} className="size-4 accent-[var(--brand)]" />
            <span>I already have a server <span className="text-muted">(the price drops by the server year we include)</span></span>
          </label>
        )}
      </div>

      <div className="mt-12 grid gap-px bg-line ring-1 ring-line md:grid-cols-3">
        {plans.map((t) => (
          <PlanCard
            key={t.id}
            plan={t}
            price={<><CurrencySign currency={currency} /><Price key={`${currency}${term}${haveServer}`} value={licenceTotal(t.id, term, currency, haveServer)} currency={currency} /></>}
            priceNote={term === "lifetime" ? (haveServer ? `${termInfo.per}, using your own server. Unlimited users.` : `${termInfo.per}. Includes 1 year of the server, worth ${money(serverYearValue(t.id, currency), currency)}. Unlimited users.`) : `${termInfo.per}. Unlimited users.`}
            bullets={t.apps}
            specs={[["Updates", term === "lifetime" ? "1 year, then optional" : term === "term1" ? "1 year" : "2 years"], ["Support and updates after", term === "lifetime" ? `${money(amcPrice(t.id, currency), currency)} / year` : "Renew the licence"], ["Users", "Unlimited, your server sets the limit"]]}
            href={`/contact?interest=on_prem&plan=${t.id}&term=${term}${haveServer ? "&server=own" : ""}`}
            cta="Ask about this"
          />
        ))}
      </div>

      <div className="mt-6 grid gap-px bg-line ring-1 ring-line lg:grid-cols-[1.2fr_1fr]">
        <div className="bg-bg p-6 sm:p-8">
          <h3 className="font-semibold tracking-tight">What server do I need?</h3>
          <p className="mt-1 text-sm text-muted">Users are never counted on your own server. How many it handles depends on the machine, so size it for your team.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[26rem] text-left text-sm">
              <thead><tr className="border-b border-line text-muted"><th className="py-2 font-medium">Team</th><th className="py-2 font-medium">CPU</th><th className="py-2 font-medium">Memory</th><th className="py-2 font-medium">Disk</th></tr></thead>
              <tbody className="divide-y divide-line">
                {OWN_SERVER.sizes.map((r, i) => (
                  <tr key={r.users} className={i === 0 ? "bg-brand-soft/60" : ""}><th scope="row" className="py-3 pr-3 font-semibold">{r.users}<span className="block text-xs font-normal text-muted">{r.note}</span></th><td className="py-3">{r.vcpu} vCPU</td><td className="py-3">{r.ramGb} GB</td><td className="py-3">{r.diskGb} GB SSD</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">{OWN_SERVER.requirements}</p>
        </div>
        <div className="bg-soft p-6 sm:p-8">
          <h3 className="font-semibold tracking-tight">Private, on your own server</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {OWN_SERVER.private.map((t) => <li key={t} className="flex gap-2.5"><Tick />{t}</li>)}
          </ul>
        </div>
      </div>

      {showExtras && (
        <div className="mt-6 grid gap-px bg-line ring-1 ring-line lg:grid-cols-3">
          <div className="bg-bg p-8 lg:col-span-2">
            <h3 className="font-semibold tracking-tight">Every licence includes</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {LICENCE_INCLUDED.map((i) => (
                <li key={i} className="flex gap-2.5"><Tick />{i}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between bg-blue-600 p-8 text-white">
            <div>
              <h3 className="font-semibold tracking-tight">Support and updates after a lifetime licence</h3>
              <p className="mt-2 text-sm text-white/80">{AMC_TEXT}</p>
            </div>
            <Link href="/contact?interest=on_prem" className={buttonClass("onDark", "md", "mt-6 w-fit text-blue-700")}>Ask about support</Link>
          </div>
        </div>
      )}
    </div>
  );
}
