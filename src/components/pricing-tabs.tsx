"use client";

import Link from "next/link";
import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { buttonClass } from "@/components/buttons";
import { CheckIcon, CloudIcon, ServerIcon } from "@/components/icons";
import { AMC, CLOUD, inr, ON_PREM } from "@/content/pricing";
import { cn } from "@/lib/utils";

type Mode = "cloud" | "own";

/** A price that counts to its new value when the plan or billing period changes. It renders the real figure from the start. */
function Price({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("en-IN");
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);
  return <span ref={ref} className="text-5xl font-semibold tracking-tighter text-fg tabular-nums">{value.toLocaleString("en-IN")}</span>;
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

/** Cloud or your own server, monthly or yearly, with prices that count to their new value. */
export function PricingTabs({ showExtras = true }: { showExtras?: boolean }) {
  const [mode, setMode] = useState<Mode>("cloud");
  const [yearly, setYearly] = useState(false);
  const factor = yearly ? 1 - CLOUD.annualDiscountPct / 100 : 1;

  return (
    <div>
      <div className="flex flex-col items-center gap-4">
        <Segmented
          label="How to run it"
          value={mode}
          onChange={setMode}
          options={[
            { id: "cloud", label: "Cloud", icon: <CloudIcon className="size-4" /> },
            { id: "own", label: "Your own server", icon: <ServerIcon className="size-4" /> },
          ]}
        />
        {mode === "cloud" ? (
          <Segmented label="Billing period" value={yearly ? "yearly" : "monthly"} onChange={(v) => setYearly(v === "yearly")} options={[{ id: "monthly", label: "Monthly" }, { id: "yearly", label: "Yearly", badge: `Save ${CLOUD.annualDiscountPct}%` }]} />
        ) : (
          <p className="text-sm text-muted">Buy once and run it on your server. We install it with you, and it needs no connection to us.</p>
        )}
      </div>

      {mode === "cloud" ? (
        <div className="mt-12 grid gap-px bg-line ring-1 ring-line md:grid-cols-3">
          {CLOUD.tiers.map((t) => {
            if (!t.perMonth) {
              return (
                <Plan key={t.id} band={t.for}>
                  <h3 className="text-2xl font-semibold tracking-tight">{t.name}</h3>
                  <p className="mt-6 text-5xl font-semibold tracking-tighter">Let&apos;s talk</p>
                  <p className="mt-2 text-xs text-muted">{t.team}. Unlimited users.</p>
                  <dl className="mt-6 divide-y divide-line border-y border-line">
                    <SpecRow k="Capacity" v="Sized for you" />
                    <SpecRow k="File storage" v="As much as you need" />
                    <SpecRow k="Backups" v="Retention you choose" />
                    <SpecRow k="Team size" v={t.team} />
                  </dl>
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    <li className="flex gap-2.5"><Tick />Every module and Mei AI</li>
                    <li className="flex gap-2.5"><Tick />Help moving your data in</li>
                    <li className="flex gap-2.5"><Tick />A named person for support</li>
                  </ul>
                  <Link href="/contact?interest=cloud&plan=larger" className={buttonClass("primary", "lg", "mt-8 w-full")}>Talk to sales</Link>
                </Plan>
              );
            }
            const monthly = Math.round(t.perMonth * factor);
            return (
              <Plan key={t.id} popular={t.popular} band={t.popular ? `Most chosen · ${t.for}` : t.for}>
                <h3 className="text-2xl font-semibold tracking-tight">{t.name}</h3>
                <p className="mt-6 flex items-baseline gap-1.5 whitespace-nowrap">
                  <span className="text-3xl font-semibold text-muted">₹</span>
                  <Price value={monthly} />
                  <span className="text-sm text-muted">/ month</span>
                </p>
                <p className="mt-2 text-xs text-muted">{yearly ? `Billed yearly, ${inr(monthly * 12)}. ` : ""}{t.team}. Unlimited users.</p>
                <dl className="mt-6 divide-y divide-line border-y border-line">
                  <SpecRow k="Dedicated capacity" v={`${t.vcpu} vCPU, ${t.ramGb} GB`} />
                  <SpecRow k="File storage" v={`${t.filesGb} GB`} />
                  <SpecRow k="Backups" v={t.backups} />
                  <SpecRow k="Team size" v={t.team.replace("Up to about", "Up to").replace("About ", "")} />
                </dl>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  <li className="flex gap-2.5"><Tick />Every module and Mei AI</li>
                  <li className="flex gap-2.5"><Tick />Unlimited users</li>
                  <li className="flex gap-2.5"><Tick />Updates and support included</li>
                </ul>
                <Link href={`/contact?interest=cloud&plan=${t.id}`} className={buttonClass(t.popular ? "brand" : "primary", "lg", "mt-8 w-full")}>Get started</Link>
              </Plan>
            );
          })}
        </div>
      ) : (
        <div className="mt-12 grid gap-px bg-line ring-1 ring-line md:grid-cols-3">
          {ON_PREM.map((l) => (
            <Plan key={l.id} popular={l.popular} band={l.popular ? "Best value" : l.per}>
              <h3 className="text-2xl font-semibold tracking-tight">{l.name}</h3>
              <p className="mt-6 flex items-baseline gap-1.5 whitespace-nowrap">
                <span className="text-3xl font-semibold text-muted">₹</span>
                <Price value={l.price} />
              </p>
              <p className="mt-2 text-xs text-muted">{l.per}. {l.note}</p>
              <ul className="mt-6 flex-1 space-y-3 border-t border-line pt-6 text-sm">
                {l.features.map((f) => (
                  <li key={f} className="flex gap-2.5"><Tick />{f}</li>
                ))}
              </ul>
              <Link href="/contact?interest=on_prem" className={buttonClass(l.popular ? "brand" : "primary", "lg", "mt-8 w-full")}>Ask about this</Link>
            </Plan>
          ))}
        </div>
      )}

      {showExtras && (
        <div className="mt-6 grid gap-px bg-line ring-1 ring-line lg:grid-cols-3">
          <div className="bg-bg p-8 lg:col-span-2">
            <h3 className="font-semibold tracking-tight">Every plan includes</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {(mode === "cloud" ? CLOUD.included : ["Every module: HR, projects, CRM and finance", "Mei AI assistant (you bring your own AI key)", "Unlimited users", "The database and server are yours", "Export everything, any time", "Your data is never locked, and you can export it any time"]).map((i) => (
                <li key={i} className="flex gap-2.5"><Tick />{i}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between bg-blue-600 p-8 text-white">
            <div>
              <h3 className="font-semibold tracking-tight">{mode === "cloud" ? "Not sure which size?" : `Support and updates: ${inr(AMC.perYear)} / year`}</h3>
              <p className="mt-2 text-sm text-white/80">{mode === "cloud" ? "Try the demo, then tell us about your team and we will recommend a plan." : AMC.text}</p>
            </div>
            <Link href={mode === "cloud" ? "/demo" : "/contact?interest=on_prem"} className={buttonClass("onDark", "md", "mt-6 w-fit text-blue-700")}>{mode === "cloud" ? "Start a demo" : "Ask about support"}</Link>
          </div>
        </div>
      )}
    </div>
  );
}
