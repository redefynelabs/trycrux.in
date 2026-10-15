/**
 * Analytics events (see docs/analytics.md). Each one goes to Google Analytics 4 with gtag, marks the Microsoft Clarity
 * session, and is pushed to Google Tag Manager's dataLayer so GTM tags can use it as a trigger. Names follow GA4's style; `generate_lead` is GA4's own
 * recommended event for a lead.
 *
 * Never put what a person typed (name, email, phone, message) into an event: only which form, which choice, which button.
 */

export type EventName =
  | "cta_click" // a call to action: start a demo, talk to sales, see pricing
  | "outbound_click" // a link to another site
  | "email_click" // a mailto link
  | "ask_ai_click" // the Ask ChatGPT / Claude / Gemini / Perplexity buttons
  | "announcement_click"
  | "announcement_close"
  | "nav_click" // header and footer links
  | "tab_select" // pricing, FAQ and other tabs
  | "faq_open"
  | "form_start" // the first time someone types into a form
  | "form_submit" // they pressed send
  | "form_error" // the server or the checks refused it
  | "generate_lead" // a demo was started or a sales request was sent
  | "demo_ready" // the demo finished building and its link was shown
  | "demo_open" // they opened their demo
  | "video_start"
  | "video_progress"
  | "video_complete"
  | "video_pause"
  | "video_sound_on"
  | "video_sound_off";

export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
  window.gtag?.("event", event, clean);
  // Microsoft Clarity (loaded by GTM) marks the session, so recordings can be filtered by what people did.
  window.clarity?.("event", event);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...clean });
}

/** Where on the page an element is: header, footer, the section it is in, or the page. */
export function locationOf(el: Element): string {
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("[data-announcement]")) return "announcement";
  const section = el.closest("section[aria-labelledby], section[id], section[aria-label]");
  return section?.getAttribute("aria-labelledby") || section?.id || section?.getAttribute("aria-label") || "page";
}

/** The visible text of a link or button, short and on one line. */
export function textOf(el: Element): string {
  return (el.getAttribute("aria-label") || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
}
