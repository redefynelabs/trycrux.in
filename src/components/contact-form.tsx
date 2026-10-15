"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/buttons";
import { CheckIcon, CloudIcon, ServerIcon, SparkIcon } from "@/components/icons";
import { TEAM_SIZE_LABELS, TIMELINE_LABELS } from "@/content/lead";
import { postJson, readAttribution } from "@/lib/client";
import { INTERESTS, TEAM_SIZES, TIMELINES, type FieldErrors } from "@/lib/schemas";
import { ChoiceCards, Field, Honeypot, Pills, TextArea, TextInput } from "./field";
import { captchaEnabled, Turnstile } from "./turnstile";

type Interest = "cloud" | "on_prem" | "other";

const ICON = { cloud: <CloudIcon />, on_prem: <ServerIcon />, other: <SparkIcon /> } as const;

/** One-tap starters for the message, so a visitor does not face an empty box. */
const STARTERS = [
  "I would like a price for my team size.",
  "We want to run it on our own server.",
  "We need to move data from another tool.",
  "We are a larger team and need a quote.",
  "I would like a walk-through on a call.",
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-3 text-base font-semibold">
        <span aria-hidden="true" className="grid size-7 place-items-center bg-accent text-sm text-white">{n}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Sent({ summary }: { summary: string[] }) {
  return (
    <div className="bg-bg ring-1 ring-line" role="status">
      <div className="bg-ok-soft px-6 py-5 sm:px-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-ok"><span className="grid size-5 place-items-center bg-ok text-white"><CheckIcon className="size-3" /></span>Message sent</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">Thank you, we have your message</h2>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <p className="text-muted">We reply within one working day, with a recommendation for your team and the next step.</p>
        {summary.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {summary.map((s) => <li key={s} className="bg-soft px-3 py-1.5 text-xs font-medium ring-1 ring-line">{s}</li>)}
          </ul>
        )}
        <div className="bg-soft p-5 ring-1 ring-line">
          <p className="font-semibold">Want to see the product while you wait?</p>
          <p className="mt-1 text-sm text-muted">Start a private demo with sample data. It is ready in about ten seconds, with 15 free questions for Mei.</p>
          <Link href="/demo" className={buttonClass("brand", "md", "mt-4")}>Start a demo</Link>
        </div>
      </div>
    </div>
  );
}

const PLAN_NAMES: Record<string, string> = { small: "Small", business: "Business", larger: "Larger teams" };

export function ContactForm({ defaultInterest = "cloud", defaultPlan = "" }: { defaultInterest?: Interest; defaultPlan?: string }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "", interest: defaultInterest as string, plan: defaultPlan, team_size: "", timeline: "", message: "", website: "" });
  const [token, setToken] = useState("");
  const [reset, setReset] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const addStarter = (t: string) => setValues((v) => (v.message.includes(t) ? v : { ...v, message: v.message ? `${v.message.trimEnd()} ${t}` : t }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setErrors({});
    setFormError("");
    if (captchaEnabled && !token) {
      setFormError("Please complete the check below first.");
      return;
    }
    setBusy(true);
    const out = await postJson<{ status: string }>("/api/contact", { ...values, captcha_token: token, attribution: readAttribution() });
    setBusy(false);
    if (out.ok) {
      setSent(true);
      return;
    }
    setErrors(out.fields);
    setFormError(Object.keys(out.fields).length ? "" : out.message);
    setToken("");
    setReset((n) => n + 1);
  }

  if (sent) {
    return <Sent summary={[INTERESTS.find((i) => i.value === values.interest)?.short ?? "", TEAM_SIZE_LABELS[values.team_size] ? `${TEAM_SIZE_LABELS[values.team_size]} people` : "", TIMELINE_LABELS[values.timeline] ?? ""].filter(Boolean)} />;
  }

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="relative bg-bg ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 bg-brand px-6 py-3 text-sm font-semibold text-white sm:px-8">
        <span>Tell us about your team</span>
        <span className="text-xs font-medium text-white/80">We reply within one working day</span>
      </div>
      <div className="space-y-8 p-6 sm:p-8">
        <Honeypot value={values.website} onChange={(v) => setValues((s) => ({ ...s, website: v }))} />

        <Step n={1} title="About you">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" error={errors.name}>
              <TextInput name="name" autoComplete="name" placeholder="Ravi Kumar" value={values.name} onChange={set("name")} invalid={!!errors.name} required />
            </Field>
            <Field label="Work email" error={errors.email}>
              <TextInput name="email" type="email" autoComplete="email" placeholder="ravi@company.com" value={values.email} onChange={set("email")} invalid={!!errors.email} required />
            </Field>
            <Field label="Company (optional)" error={errors.company}>
              <TextInput name="company" autoComplete="organization" value={values.company} onChange={set("company")} invalid={!!errors.company} />
            </Field>
            <Field label="Phone number" error={errors.phone} hint="A person from our team may call to help you get started.">
              <TextInput name="phone" type="tel" autoComplete="tel" required placeholder="+91 98765 43210" value={values.phone} onChange={set("phone")} invalid={!!errors.phone} />
            </Field>
          </div>
        </Step>

        <Step n={2} title="What you need">
          <div>
            <p className="mb-2 text-sm font-medium">What are you looking for?</p>
            <ChoiceCards label="What are you looking for?" value={values.interest as Interest} onChange={(v) => setValues((s) => ({ ...s, interest: v || "other" }))} options={INTERESTS.map((i) => ({ value: i.value, label: i.short, text: i.text, icon: ICON[i.value] }))} />
            {errors.interest && <span role="alert" className="mt-1 block text-sm text-bad">{errors.interest}</span>}
            {values.interest === "cloud" && values.plan && PLAN_NAMES[values.plan] && (
              <p className="mt-3 inline-flex items-center gap-2 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
                You were looking at the {PLAN_NAMES[values.plan]} plan
                <button type="button" onClick={() => setValues((s) => ({ ...s, plan: "" }))} className="text-xs underline">clear</button>
              </p>
            )}
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">How big is your team? <span className="font-normal text-muted">(optional)</span></p>
            <Pills label="Team size" value={values.team_size as (typeof TEAM_SIZES)[number] | ""} onChange={(v) => setValues((s) => ({ ...s, team_size: v }))} options={TEAM_SIZES.map((t) => ({ value: t, label: TEAM_SIZE_LABELS[t] }))} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">When do you want to start? <span className="font-normal text-muted">(optional)</span></p>
            <Pills label="When" value={values.timeline as (typeof TIMELINES)[number] | ""} onChange={(v) => setValues((s) => ({ ...s, timeline: v }))} options={TIMELINES.map((t) => ({ value: t, label: TIMELINE_LABELS[t] }))} />
          </div>
        </Step>

        <Step n={3} title="Your message">
          <div className="flex flex-wrap gap-2" aria-label="Quick starters">
            {STARTERS.map((t) => (
              <button key={t} type="button" onClick={() => addStarter(t)} className="rounded-full bg-soft px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-line transition-colors hover:text-fg">
                + {t.replace(/\.$/, "")}
              </button>
            ))}
          </div>
          <Field label="Your message" error={errors.message} hint="Tell us about your team and what you want to run in the system.">
            <TextArea name="message" rows={5} value={values.message} onChange={set("message")} invalid={!!errors.message} required />
          </Field>
        </Step>

        <Turnstile onToken={setToken} resetKey={reset} />
        {formError && (
          <p role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">
            {formError}
          </p>
        )}
        <button type="submit" disabled={busy} className={buttonClass("brand", "lg", "w-full")}>
          {busy ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-muted">
          We use your details only to reply to you; see our{" "}
          <Link href="/legal/privacy" className="underline">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
