/**
 * Cookie consent. Two optional kinds of cookies: analytics (Google Analytics) and session recordings (Microsoft Clarity).
 * What is strictly necessary (the bot check on forms, remembering this choice) needs no consent.
 *
 * Where the law requires consent first (the EU and EEA, the UK and Switzerland) both start off and the banner asks;
 * elsewhere both start on, and anyone can change it from "Cookie settings" in the footer. The visitor's region comes from
 * the crux_region cookie set by src/proxy.ts; Google's Consent Mode also denies analytics by default in those regions on
 * its own, so a missing cookie never means tracking without consent there.
 *
 * The defaults are applied before Google Analytics loads by CONSENT_BOOT (inline in the root layout).
 */

export interface Consent {
  analytics: boolean;
  recordings: boolean;
  /** When it was chosen, ISO date. */
  at: string;
  v: 1;
}

export const CONSENT_KEY = "crux-consent";
export const REGION_COOKIE = "crux_region";
/** A choice is asked again after this long. */
export const CONSENT_MAX_AGE_DAYS = 180;
/** Fired on window to open the settings (the footer link). */
export const OPEN_EVENT = "crux:consent-open";
/** Fired on window after a choice is saved. */
export const CHANGE_EVENT = "crux:consent-change";

/** EU and EEA countries, the UK and Switzerland, as ISO 3166 codes (Vercel's x-vercel-ip-country). */
export const CONSENT_FIRST = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
];

/** Whether this visitor is in a region where optional cookies need consent first. */
export function consentFirst(): boolean {
  return typeof document !== "undefined" && new RegExp(`(^|; )${REGION_COOKIE}=strict`).test(document.cookie);
}

export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null") as Consent | null;
    if (!c || c.v !== 1) return null;
    if (Date.now() - new Date(c.at).getTime() > CONSENT_MAX_AGE_DAYS * 864e5) return null;
    return c;
  } catch {
    return null;
  }
}

/** The choice in force: the saved one, or the region's default. */
export function currentConsent(): Pick<Consent, "analytics" | "recordings"> {
  const saved = readConsent();
  if (saved) return saved;
  const open = !consentFirst();
  return { analytics: open, recordings: open };
}

export function saveConsent(choice: Pick<Consent, "analytics" | "recordings">): void {
  const c: Consent = { ...choice, at: new Date().toISOString(), v: 1 };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    // Storage blocked: the choice still applies to this page view.
  }
  applyConsent(c);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: c }));
}

/** Tells Google Consent Mode and Clarity what is allowed now. */
export function applyConsent(c: Pick<Consent, "analytics" | "recordings">): void {
  window.gtag?.("consent", "update", { analytics_storage: c.analytics ? "granted" : "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.clarity?.("consentv2", { ad_Storage: "denied", analytics_Storage: c.recordings ? "granted" : "denied" });
}

/**
 * Runs before Google Analytics and GTM: sets Consent Mode defaults (denied in consent-first regions, by our cookie and by
 * Google's own region list) and then applies a saved choice. Kept as a string because it is inlined into the page head.
 */
export const CONSENT_BOOT = `(function(){
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var strict=/(^|; )${REGION_COOKIE}=strict/.test(document.cookie);
var off={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
gtag('consent','default',Object.assign({analytics_storage:strict?'denied':'granted',wait_for_update:500},off));
gtag('consent','default',Object.assign({analytics_storage:'denied',region:${JSON.stringify(CONSENT_FIRST)}},off));
var c=null;try{c=JSON.parse(localStorage.getItem('${CONSENT_KEY}'));}catch(e){}
if(c&&c.v===1&&Date.now()-new Date(c.at).getTime()<=${CONSENT_MAX_AGE_DAYS}*864e5){gtag('consent','update',Object.assign({analytics_storage:c.analytics?'granted':'denied'},off));}
})();`;
