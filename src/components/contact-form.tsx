"use client";

import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/buttons";
import { CalendarIcon, CheckIcon } from "@/components/icons";
import { whatsappHref } from "@/components/talk-options";
import { track } from "@/lib/analytics";
import { postJson, readAttribution } from "@/lib/client";
import { SITE } from "@/lib/site";
import type { FieldErrors } from "@/lib/schemas";
import { Field, Honeypot, TextArea, TextInput } from "./field";
import { captchaEnabled, Turnstile } from "./turnstile";

type Interest = "cloud" | "on_prem" | "other";

/** After sending: a thank-you and ways not to wait (book a call now, WhatsApp, try the demo). */
function Sent({ name, email }: { name: string; email: string }) {
  const first = name.trim().split(/\s+/)[0];
  return (
    <div className="bg-bg ring-1 ring-line" role="status">
      <div className="bg-ok-soft px-5 py-5 sm:px-8 sm:py-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-ok"><span className="grid size-5 place-items-center bg-ok text-white"><CheckIcon className="size-3" /></span>Message sent</p>
        <h2 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">Thank you{first ? `, ${first}` : ""}. We have your message.</h2>
        <p className="mt-2 text-sm text-muted">A person on our team will reply to {email || "your email"} within one working day.</p>
      </div>
      <div className="space-y-5 p-5 sm:p-8">
        <div className="grid gap-px bg-line ring-1 ring-line">
          <a href={SITE.calUrl} target="_blank" rel="noopener noreferrer" data-track="book_call_click" data-track-cta-location="contact_sent" className="group flex items-center gap-4 bg-brand p-5 text-white transition-colors hover:bg-brand/90">
            <span className="grid size-11 shrink-0 place-items-center bg-white/15 text-2xl"><CalendarIcon /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">Skip the wait: book a time now</span>
              <span className="block text-sm text-white/80">Pick a slot that suits you for the walk-through.</span>
            </span>
          </a>
          {SITE.whatsapp && (
            <a href={whatsappHref("Hi, I just sent a message on the Crux website.")} target="_blank" rel="noopener noreferrer" data-track="whatsapp_click" data-track-cta-location="contact_sent" className="flex items-center gap-4 bg-bg p-5 transition-colors hover:bg-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/whatsapp-icon.png" alt="" width={44} height={44} className="size-11 shrink-0 object-contain" />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Questions in the meantime?</span>
                <span className="block text-sm text-muted">Chat with us on WhatsApp.</span>
              </span>
            </a>
          )}
        </div>
        <p className="text-sm text-muted">Want to see it first? <Link href="/demo" className="font-medium text-brand underline">Start a private demo</Link>, ready in about ten seconds.</p>
      </div>
    </div>
  );
}

const PLAN_NAMES: Record<string, string> = { start: "Start", grow: "Grow", complete: "Complete", small: "Start", business: "Grow" };

export function ContactForm({ defaultInterest = "on_prem", defaultPlan = "", defaultMessage = "" }: { defaultInterest?: Interest; defaultPlan?: string; defaultMessage?: string }) {
  const [values, setValues] = useState({ name: "", email: "", phone: "", company: "", interest: defaultInterest as string, plan: defaultPlan, message: defaultMessage, website: "" });
  const [token, setToken] = useState("");
  const [reset, setReset] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [started, setStarted] = useState(false);
  // Which choices were made, never what was typed.
  const choices = { form_name: "contact", interest: values.interest, plan: values.plan };

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
    const out = await postJson<{ status: string }>("/api/contact", { ...values, captcha_token: token, attribution: readAttribution() });
    setBusy(false);
    if (out.ok) {
      track("generate_lead", { ...choices, lead_type: "sales" });
      setSent(true);
      return;
    }
    track("form_error", { ...choices, error_fields: Object.keys(out.fields).join(",") || "none", error: Object.keys(out.fields).length ? "invalid" : "server" });
    setErrors(out.fields);
    setFormError(Object.keys(out.fields).length ? "" : out.message);
    setToken("");
    setReset((n) => n + 1);
  }

  if (sent) {
    return <Sent name={values.name} email={values.email} />;
  }

  return (
    <form
      onSubmit={(e) => void submit(e)}
      onInput={() => {
        if (!started) {
          setStarted(true);
          track("form_start", { form_name: "contact" });
        }
      }}
      noValidate
      className="relative bg-bg ring-1 ring-line"
    >
      <div className="flex items-center justify-between gap-3 bg-brand px-6 py-3 text-sm font-semibold text-white sm:px-8">
        <span>Send us a message</span>
        <span className="hidden text-xs font-medium text-white/80 sm:inline">We reply within one working day</span>
      </div>
      <div className="space-y-5 p-5 sm:p-8">
        <Honeypot value={values.website} onChange={(v) => setValues((s) => ({ ...s, website: v }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" error={errors.name}>
            <TextInput name="name" autoComplete="name" placeholder="Ravi Kumar" value={values.name} onChange={set("name")} invalid={!!errors.name} required />
          </Field>
          <Field label="Work email" error={errors.email}>
            <TextInput name="email" type="email" autoComplete="email" placeholder="ravi@company.com" value={values.email} onChange={set("email")} invalid={!!errors.email} required />
          </Field>
          <Field label="Phone number" error={errors.phone}>
            <TextInput name="phone" type="tel" autoComplete="tel" required placeholder="+91 98765 43210" value={values.phone} onChange={set("phone")} invalid={!!errors.phone} />
          </Field>
          <Field label="Company (optional)" error={errors.company}>
            <TextInput name="company" autoComplete="organization" value={values.company} onChange={set("company")} invalid={!!errors.company} />
          </Field>
        </div>
        {values.plan && PLAN_NAMES[values.plan] && (
          <p className="inline-flex items-center gap-2 bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand">
            You were looking at the {PLAN_NAMES[values.plan]} plan
            <button type="button" onClick={() => setValues((s) => ({ ...s, plan: "" }))} className="text-xs underline">clear</button>
          </p>
        )}
        <Field label="Your message" error={errors.message} hint="Tell us about your team and what you want to run.">
          <TextArea name="message" rows={4} value={values.message} onChange={set("message")} invalid={!!errors.message} required />
        </Field>

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
