"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { buttonClass } from "@/components/buttons";
import { CheckIcon } from "@/components/icons";
import { FOCUS, TEAM_SIZE_LABELS, TRY_FIRST } from "@/content/lead";
import { track } from "@/lib/analytics";
import { postJson, readAttribution } from "@/lib/client";
import { FOCUSES, TEAM_SIZES, type FieldErrors } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { ChoiceCards, Field, Honeypot, Pills, TextInput } from "./field";
import { captchaEnabled, Turnstile } from "./turnstile";

interface Ready {
  url: string;
  login_email: string;
  login_password: string;
  expires_at: string;
}

const TOTAL_MS = 60 * 60 * 1000;

function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Copy({ text, label, className }: { text: string; label: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={cn("shrink-0 rounded-full border border-line bg-bg px-3 py-1 text-xs font-medium hover:bg-soft", className)}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        });
      }}
      aria-label={`Copy ${label}`}
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

const STEPS = ["Creating your private copy", "Loading the sample company", "Opening your sign-in"];

/** Shown while the demo is being built, which takes about ten seconds. */
function Building() {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(v + 1, STEPS.length - 1)), 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="bg-bg p-6 ring-1 ring-line sm:p-8" role="status" aria-live="polite">
      <p className="text-sm font-semibold tracking-wide text-brand uppercase">Starting your demo</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">Building your private copy</h2>
      <p className="mt-1 text-muted">This takes about ten seconds. Please keep this page open.</p>
      <ul className="mt-6 space-y-4">
        {STEPS.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-3 text-sm transition-opacity", i > n && "opacity-35")}>
            <span className="grid size-6 place-items-center">
              {i < n ? <span className="grid size-5 place-items-center bg-ok text-white"><CheckIcon className="size-3" /></span> : i === n ? <span aria-hidden="true" className="size-4 animate-spin border-2 border-brand/25 border-t-brand motion-reduce:animate-none" /> : <span className="size-1.5 bg-line" />}
            </span>
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-8 h-1.5 bg-soft">
        <motion.div className="h-full bg-brand" initial={{ width: "4%" }} animate={{ width: "92%" }} transition={{ duration: 14, ease: "easeOut" }} />
      </div>
    </div>
  );
}

function Result({ ready, focus }: { ready: Ready; focus: string }) {
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState(focus && TRY_FIRST[focus] ? focus : "mei");
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const left = new Date(ready.expires_at).getTime() - now;
  const minutes = Math.max(0, Math.ceil(left / 60000));
  const guide = TRY_FIRST[tab];
  return (
    <div className="bg-bg ring-1 ring-line" role="status">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-ok-soft px-6 py-5 sm:px-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-ok"><span className="grid size-5 place-items-center bg-ok text-white"><CheckIcon className="size-3" /></span>Your demo is ready</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Northwind Traders, just for you</h2>
        </div>
        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{left > 0 ? clock(left) : "00:00"}</p>
          <p className="text-xs text-muted">{left > 0 ? <>It ends in about <strong>{minutes} minutes</strong></> : "It has ended"}</p>
        </div>
      </div>
      <div className="h-1 bg-line"><div className="h-full bg-ok transition-[width] duration-1000" style={{ width: `${Math.max(0, Math.min(100, (left / TOTAL_MS) * 100))}%` }} /></div>

      <div className="space-y-6 p-6 sm:p-8">
        <a href={ready.url} target="_blank" rel="noopener noreferrer" data-track="demo_open" className={buttonClass("brand", "lg", "w-full")}>
          Open your demo
        </a>

        <dl className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2">
          {[["Email", ready.login_email, "email"], ["Password", ready.login_password, "password"]].map(([k, v, l]) => (
            <div key={k} className="flex items-center justify-between gap-3 bg-bg px-4 py-3">
              <div className="min-w-0">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="truncate font-mono text-sm">{v}</dd>
              </div>
              <Copy text={v} label={l} />
            </div>
          ))}
        </dl>

        <div>
          <p className="text-sm font-semibold">Try these first</p>
          <div role="tablist" aria-label="What to try" className="mt-3 flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <button key={f.value} role="tab" aria-selected={tab === f.value} onClick={() => setTab(f.value)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors", tab === f.value ? "bg-accent text-white" : "bg-soft text-muted ring-1 ring-line hover:text-fg")}>
                {f.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="mt-4 grid gap-5 sm:grid-cols-2">
              <ol className="space-y-2.5 text-sm">
                {guide.steps.map((s, i) => (
                  <li key={s} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center bg-brand-soft text-xs font-semibold text-brand">{i + 1}</span><span className="pt-0.5">{s}</span></li>
                ))}
              </ol>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted uppercase">Ask Mei (15 free questions)</p>
                <ul className="mt-2 space-y-2">
                  {guide.mei.map((q) => (
                    <li key={q} className="flex items-start justify-between gap-2 bg-soft px-3 py-2 text-sm ring-1 ring-line"><span>{q}</span><Copy text={q} label="question" /></li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="border-t border-line pt-5 text-sm text-muted">
          Do not enter real customer or employee data. Everything is deleted when the time ends.{" "}
          <Link className="font-medium text-accent underline" href="/contact">
            Talk to us
          </Link>{" "}
          when you are ready, and we will move you to the real thing.
        </p>
      </div>
    </div>
  );
}

export function DemoForm() {
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "", team_size: "", focus: "", website: "" });
  const [token, setToken] = useState("");
  const [reset, setReset] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState<Ready | null>(null);
  const [started, setStarted] = useState(false);
  // Which choices were made, never what was typed.
  const choices = { form_name: "demo", team_size: values.team_size, focus: values.focus };

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setErrors({});
    setFormError("");
    if (captchaEnabled && !token) {
      track("form_error", { ...choices, error_fields: "captcha", error: "captcha" });
      setFormError("Please complete the check below first.");
      return;
    }
    setBusy(true);
    track("form_submit", choices);
    const out = await postJson<Ready>("/api/demo", { ...values, captcha_token: token, attribution: readAttribution() });
    setBusy(false);
    if (out.ok) {
      track("generate_lead", { ...choices, lead_type: "demo" });
      track("demo_ready", choices);
      setReady(out.data);
      return;
    }
    track("form_error", { ...choices, error_fields: Object.keys(out.fields).join(",") || "none", error: Object.keys(out.fields).length ? "invalid" : "server" });
    setErrors(out.fields);
    setFormError(Object.keys(out.fields).length ? "" : out.message);
    setToken("");
    setReset((n) => n + 1);
  }

  if (ready) return <Result ready={ready} focus={values.focus} />;
  if (busy) return <Building />;

  return (
    <form
      onSubmit={(e) => void submit(e)}
      onInput={() => {
        if (!started) {
          setStarted(true);
          track("form_start", { form_name: "demo" });
        }
      }}
      noValidate
      className="relative bg-bg ring-1 ring-line"
    >
      <div className="flex items-center justify-between gap-3 bg-brand px-6 py-3 text-sm font-semibold text-white sm:px-8">
        <span>Start your free demo</span>
        <span className="text-xs font-medium text-white/80">No card · 1 hour · Mei included</span>
      </div>
      <div className="space-y-5 p-6 sm:p-8">
        <Honeypot value={values.website} onChange={(v) => setValues((s) => ({ ...s, website: v }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" error={errors.name}>
            <TextInput name="name" autoComplete="name" placeholder="Asha Rao" value={values.name} onChange={set("name")} invalid={!!errors.name} required />
          </Field>
          <Field label="Work email" error={errors.email} hint="We send nothing but your demo, and one follow-up.">
            <TextInput name="email" type="email" autoComplete="email" placeholder="asha@company.com" value={values.email} onChange={set("email")} invalid={!!errors.email} required />
          </Field>
          <Field label="Company (optional)" error={errors.company}>
            <TextInput name="company" autoComplete="organization" value={values.company} onChange={set("company")} invalid={!!errors.company} />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <TextInput name="phone" type="tel" autoComplete="tel" required placeholder="+91 98765 43210" value={values.phone} onChange={set("phone")} invalid={!!errors.phone} />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">How big is your team? <span className="font-normal text-muted">(optional)</span></legend>
          <Pills label="Team size" value={values.team_size as (typeof TEAM_SIZES)[number] | ""} onChange={(v) => setValues((s) => ({ ...s, team_size: v }))} options={TEAM_SIZES.map((t) => ({ value: t, label: TEAM_SIZE_LABELS[t] }))} />
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">What do you want to see first? <span className="font-normal text-muted">(optional)</span></legend>
          <ChoiceCards
            label="What to see first"
            clearable
            columns="sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2"
            value={values.focus as (typeof FOCUSES)[number] | ""}
            onChange={(v) => setValues((s) => ({ ...s, focus: v }))}
            options={FOCUS.map((f) => ({ value: f.value, label: f.label, text: f.text, icon: <f.Icon /> }))}
          />
        </fieldset>

        <Turnstile onToken={setToken} resetKey={reset} />
        {formError && (
          <p role="alert" className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">
            {formError}
          </p>
        )}
        <button type="submit" disabled={busy} className={buttonClass("brand", "lg", "w-full")}>
          Start my demo
        </button>
        <p className="text-xs text-muted">
          Ready in about ten seconds. We use your details to send the demo and to follow up once; see our{" "}
          <Link href="/legal/privacy" className="underline">
            privacy notice
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
