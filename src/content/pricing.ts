/**
 * Pricing, in one place. Review every figure, every limit and the terms before launch.
 */

import { formatMoney, type CurrencyCode } from "@/lib/currency";

export interface Plan {
  id: string;
  name: string;
  for: string;
  /** Comfortable team size; there is no user limit, this only helps a buyer pick. */
  team: string;
  vcpu: number;
  ramGb: number;
  /** File storage allowance in GB (the customer's private bucket). */
  filesGb: number;
  backups: string;
  /** List price per month in rupees, before tax. Absent for a plan quoted by sales. */
  perMonth?: number;
  popular?: boolean;
}

/**
 * Cloud: one flat price per size, every feature and unlimited users in each. A tenant is a server + web container pair
 * with its own database on a shared host (docs/Hosting.md), so the price follows the capacity reserved for it.
 */
export const CLOUD = {
  annualDiscountPct: 15,
  tiers: [
    { id: "small", name: "Small", for: "Small teams getting started", team: "Up to about 25 people", vcpu: 1, ramGb: 1, filesGb: 25, backups: "Daily, 14 days", perMonth: 2999 },
    { id: "business", name: "Business", for: "Growing companies", team: "About 25 to 100 people", vcpu: 2, ramGb: 2, filesGb: 100, backups: "Daily, 30 days", perMonth: 6999, popular: true },
    { id: "large", name: "Larger teams", for: "Bigger companies and special needs", team: "300 people or more", vcpu: 0, ramGb: 0, filesGb: 0, backups: "Set with you" },
  ] satisfies Plan[],
  included: [
    "Every module: HR, projects, CRM and finance",
    "Mei AI assistant (you bring your own AI key)",
    "Unlimited users",
    "A private file bucket just for your company",
    "Automatic updates and bug fixes",
    "HTTPS and your own address",
    "Email support",
  ],
};

/**
 * What a cloud plan costs us to run each month, in rupees, and the margin the list price leaves. Prices are set from
 * this: running cost, then a margin of about 70%. Change the assumptions when real bills arrive; pricing.test.ts fails
 * if a list price stops leaving the target margin.
 *
 * Each customer gets their own VPS (INR; USD 1 = 98):
 *  - compute: a Bluehost VPS, 392 a month for 1 vCPU / 2 GB (Small) and 782 for 2 vCPU / 4 GB (Business). Check the
 *    renewal price and any prepayment term before relying on these. Vultr would cost 980 and 1,960 for the same sizes
 *  - backups: compressed database dumps in object storage (Cloudflare R2, about 1.47 per GB-month, no download fees)
 *  - files: R2 at about 1.47 per GB-month, counted as if the whole allowance is used
 *  - support: the share of an engineer's time a customer of that size takes, including setting the server up
 *  - fixed: monitoring, domain and certificates per tenant
 *  - Mei AI: nothing, the customer's own key pays the provider
 */
export const RUNNING_COST = {
  assumptions: { usdToInr: 98, objectStoragePerGb: 1.47, targetMargin: 0.69 },
  perPlan: {
    small: { compute: 392, backups: 46, files: 37, support: 300, fixed: 115 },
    business: { compute: 782, backups: 288, files: 147, support: 800, fixed: 115 },
  },
} as const;

/** What a plan costs us a month. */
export function runningCost(id: keyof typeof RUNNING_COST.perPlan): number {
  return Object.values(RUNNING_COST.perPlan[id]).reduce((a, b) => a + b, 0);
}

export interface Licence {
  id: string;
  name: string;
  price: number;
  per: string;
  note: string;
  features: string[];
  popular?: boolean;
}

/**
 * On your own server: we install it with you and you own the database. We carry no
 * hosting cost here, only installation, updates and support, so these are priced on value: the lifetime licence is about
 * three and a half years of the Business cloud plan.
 */
export const ON_PREM: Licence[] = [
  {
    id: "term1",
    name: "1-year licence",
    price: 99999,
    per: "for one year",
    note: "Use for a year, updates included for the same year.",
    features: ["Every module and Mei AI, unlimited users", "Runs on your server", "Updates for the licence year", "Renew when it ends"],
  },
  {
    id: "term2",
    name: "2-year licence",
    price: 159999,
    per: "for two years",
    note: "Two years of use and updates at a lower yearly cost.",
    features: ["Every module and Mei AI, unlimited users", "Runs on your server", "Updates for both years", "Renew when it ends"],
  },
  {
    id: "lifetime",
    name: "Lifetime licence",
    price: 299999,
    per: "one time",
    note: "Pay once, use forever. Includes one year of updates.",
    features: ["Every module and Mei AI, unlimited users", "Runs on your server", "One year of updates included", "Keep running with no renewal"],
    popular: true,
  },
];

export const AMC = {
  perYear: 24999,
  text: "Optional yearly support and updates for a lifetime licence: new releases, bug fixes and priority email support. Without it, your system keeps working; you just stop receiving new releases.",
};

/**
 * List prices in each currency we show, before tax. INR is the source (the figures above, which the margin test checks);
 * the others are set from it at about USD 1 = INR 98, GBP 1 = USD 1.33, EUR 1 = USD 1.16 and USD 1 = AED 3.67, then
 * rounded to a clean price. They are set by hand, not converted live, so a price never changes with the exchange rate.
 * Review them before launch; pricing.test.ts fails if one drifts more than 15% from the INR price.
 */
export const PRICES: Record<CurrencyCode, { cloud: Record<"small" | "business", number>; own: Record<"term1" | "term2" | "lifetime", number>; amc: number }> = {
  INR: { cloud: { small: 2999, business: 6999 }, own: { term1: 99999, term2: 159999, lifetime: 299999 }, amc: 24999 },
  USD: { cloud: { small: 29, business: 69 }, own: { term1: 999, term2: 1599, lifetime: 2999 }, amc: 249 },
  GBP: { cloud: { small: 23, business: 52 }, own: { term1: 749, term2: 1199, lifetime: 2299 }, amc: 189 },
  EUR: { cloud: { small: 26, business: 59 }, own: { term1: 899, term2: 1399, lifetime: 2599 }, amc: 219 },
  AED: { cloud: { small: 109, business: 259 }, own: { term1: 3699, term2: 5899, lifetime: 10999 }, amc: 899 },
};

/** A cloud plan's monthly price in a currency; undefined for a plan quoted by sales. */
export function cloudPrice(id: string, c: CurrencyCode): number | undefined {
  return PRICES[c].cloud[id as keyof (typeof PRICES)[CurrencyCode]["cloud"]];
}

/** A licence's price in a currency. */
export function licencePrice(id: string, c: CurrencyCode): number {
  return PRICES[c].own[id as keyof (typeof PRICES)[CurrencyCode]["own"]];
}

/** A price with its currency, e.g. "₹2,999", "$29", "AED 109". */
export function money(n: number, c: CurrencyCode): string {
  return formatMoney(n, c);
}

export function inr(n: number): string {
  return money(n, "INR");
}
