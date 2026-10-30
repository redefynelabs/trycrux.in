"use client";

import { useId, useState } from "react";
import { AsYouType, getCountries, getCountryCallingCode, isValidPhoneNumber, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";
import { cn } from "@/lib/utils";

const DEFAULT_COUNTRY: CountryCode = "IN";

const flag = (c: string) => String.fromCodePoint(...[...c].map((ch) => 127397 + ch.charCodeAt(0)));

let cached: { code: CountryCode; name: string; dial: string }[] | null = null;
function countryList() {
  if (cached) return cached;
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  cached = getCountries()
    .map((code) => ({ code, name: names.of(code) ?? code, dial: getCountryCallingCode(code) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  return cached;
}

/** The number to send: international, with the country code (`+919412370582`), or "" when nothing is typed. */
export function phoneValue(country: CountryCode, national: string): string {
  const text = national.trim();
  if (!text) return "";
  return text.startsWith("+") ? text : `+${getCountryCallingCode(country)}${text.replace(/\D/g, "")}`;
}

/**
 * A phone field with a country picker. Typing a full international number ("+44 …") switches the country by itself.
 * `onChange` gets the number with its country code; it is checked against the country's real numbering plan.
 */
export function PhoneField({ label, value, onChange, error, name = "phone", required }: { label: string; value: string; onChange: (v: string) => void; error?: string; name?: string; required?: boolean }) {
  const id = useId();
  const countries = countryList();
  const [country, setCountry] = useState<CountryCode>(() => parsePhoneNumberFromString(value)?.country ?? DEFAULT_COUNTRY);
  const [national, setNational] = useState(value);
  const [touched, setTouched] = useState(false);

  const emit = (c: CountryCode, text: string) => {
    setCountry(c);
    setNational(text);
    onChange(phoneValue(c, text));
  };

  const type = (raw: string) => {
    if (raw.trim().startsWith("+")) {
      const parsed = parsePhoneNumberFromString(raw);
      if (parsed?.country) setCountry(parsed.country);
      return emit(parsed?.country ?? country, new AsYouType().input(raw));
    }
    emit(country, new AsYouType(country).input(raw));
  };

  const full = phoneValue(country, national);
  const bad = touched && full !== "" && !isValidPhoneNumber(full);
  const message = error || (bad ? `Enter a valid ${countries.find((c) => c.code === country)?.name ?? ""} phone number`.replace("  ", " ") : "");

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <div className={cn("flex rounded-2xl border border-line bg-soft/60 transition-colors focus-within:border-brand focus-within:bg-bg focus-within:ring-4 focus-within:ring-brand/15", message && "border-bad")}>
        <div className="relative flex shrink-0 items-center border-r border-line">
          <span aria-hidden="true" className="pointer-events-none flex items-center gap-1.5 pl-4 pr-2 text-base">
            <span>{flag(country)}</span>
            <span className="text-muted">+{getCountryCallingCode(country)}</span>
            <span className="text-xs text-muted">▾</span>
          </span>
          <select aria-label="Country code" value={country} onChange={(e) => emit(e.target.value as CountryCode, national.trim().startsWith("+") ? "" : national)} className="absolute inset-0 w-full cursor-pointer opacity-0">
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{`${flag(c.code)} ${c.name} (+${c.dial})`}</option>
            ))}
          </select>
        </div>
        <input id={id} name={name} type="tel" autoComplete="tel" inputMode="tel" required={required} placeholder="Phone number" value={national} onChange={(e) => type(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={message ? true : undefined} className="min-w-0 flex-1 rounded-2xl bg-transparent px-3 py-2.5 text-base text-fg placeholder:text-muted/70 focus:outline-none" />
      </div>
      {message && <span role="alert" className="mt-1 block text-sm text-bad">{message}</span>}
    </div>
  );
}
