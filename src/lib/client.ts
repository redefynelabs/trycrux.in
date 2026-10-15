"use client";

import type { FieldErrors } from "./schemas";

export type Outcome<T> =
  | { ok: true; data: T }
  | { ok: false; message: string; fields: FieldErrors; code: string };

/** Posts JSON to one of this site's own routes and turns every failure into a message a visitor can read. */
export async function postJson<T>(path: string, body: unknown): Promise<Outcome<T>> {
  try {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as { data?: T; error?: { code?: string; message?: string; fields?: FieldErrors } };
    if (res.ok) return { ok: true, data: json.data as T };
    return {
      ok: false,
      code: json.error?.code ?? "error",
      message: json.error?.message ?? "Something went wrong. Please try again.",
      fields: json.error?.fields ?? {},
    };
  } catch {
    return { ok: false, code: "network", message: "We could not reach the server. Check your connection and try again.", fields: {} };
  }
}

const KEY = "erp.attribution";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Where the visitor first came from, remembered for the tab so a lead can be traced to its campaign. */
export function rememberAttribution(): void {
  try {
    if (window.sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = { landing: window.location.pathname };
    for (const p of PARAMS) {
      const v = q.get(p);
      if (v) found[p] = v.slice(0, 200);
    }
    if (document.referrer) found.referrer = document.referrer.slice(0, 200);
    window.sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Storage can be blocked; a lead without attribution is still a lead.
  }
}

export function readAttribution(): Record<string, string> {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}
