/**
 * Pricing, in one place. Review every figure, every limit and the terms before launch.
 */

import { formatMoney, fromInr, type CurrencyCode } from "@/lib/currency";

export type PlanId = "start" | "grow" | "complete";
export const PLAN_IDS: PlanId[] = ["start", "grow", "complete"];
export type TermId = "term1" | "term2" | "lifetime";
export const TERM_IDS: TermId[] = ["term1", "term2", "lifetime"];

export interface Plan {
  id: string;
  name: string;
  for: string;
  /** Comfortable team size; there is no user limit, this only helps a buyer pick. */
  team: string;
  /** How many app groups it lets you pick (see APP_GROUPS). */
  groups: number;
  /** What it has, as bullets. */
  apps: string[];
  /** What this plan adds to the one before it. */
  adds: string[];
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
 * Cloud hosting is not offered for now: the site sells licences for the customer's own server only. The cloud prices,
 * capacity and running costs below (CLOUD, RUNNING_COST, PRICES.*.cloud) are kept, and tested, for the day it
 * returns, but nothing on the site shows them. CLOUD.tiers also holds each plan's name, app limit and bullets, which
 * the licence cards use.
 *
 * A company picks its edition (services or goods) and the app groups it needs from the five of that edition (up to 2 on
 * Start, 4 on Grow, all 5 on Complete), and each plan carries the
 * capacity that many apps want. Users are never counted.
 * The same three plans exist on the cloud and as a licence for your own server, so a buyer compares like with like and
 * the licence key says which plan it is. A tenant is a server + web container pair with its own database on a shared
 * host (docs/Hosting.md), so the cloud price follows the capacity reserved for it.
 */
export const CLOUD = {
  annualDiscountPct: 15,
  tiers: [
    {
      id: "start", name: "Start", for: "Two app groups of your choice", team: "Up to about 15 people", groups: 2,
      apps: ["Any 2 of the 5 app groups in your edition", "Unlimited users, roles and audit log"],
      adds: [],
      vcpu: 1, ramGb: 1, filesGb: 25, backups: "Daily, 14 days", perMonth: 3999,
    },
    {
      id: "grow", name: "Grow", for: "Four app groups of your choice", team: "About 15 to 50 people", groups: 4,
      apps: ["Any 4 of the 5 app groups in your edition", "Unlimited users, roles and audit log"],
      adds: [],
      vcpu: 2, ramGb: 2, filesGb: 100, backups: "Daily, 30 days", perMonth: 7999, popular: true,
    },
    {
      id: "complete", name: "Complete", for: "Every app group, with priority support", team: "About 50 to 150 people", groups: 5,
      apps: ["All 5 app groups in your edition", "Unlimited users, roles and audit log", "Priority support"],
      adds: ["Priority support"],
      vcpu: 4, ramGb: 8, filesGb: 250, backups: "Daily, 60 days", perMonth: 12999,
    },
  ] satisfies Plan[],
  included: [
    "Mei AI assistant, included (your own AI key)",
    "Unlimited users",
    "A private file bucket just for your company",
    "Automatic updates and bug fixes",
    "HTTPS and your own address",
    "Email support",
    "Change your app groups or move up a plan any time, with nothing retyped",
  ],
};

/**
 * What a cloud plan costs us to run each month, in rupees, and the margin the list price leaves. Prices are set from
 * this: running cost, then a margin of about 70%. Change the assumptions when real bills arrive; pricing.test.ts fails
 * if a list price stops leaving the target margin.
 *
 * Each customer gets their own VPS (INR; USD 1 = 98):
 *  - compute: a Bluehost VPS, 392 a month for 1 vCPU / 2 GB (Start), 782 for 2 vCPU / 4 GB (Grow) and about 1,564 for
 *    4 vCPU / 8 GB (Complete). Check the renewal price and any prepayment term before relying on these. Vultr would cost
 *    980 and 1,960 for the first two sizes
 *  - backups: compressed database dumps in object storage (Cloudflare R2, about 1.47 per GB-month, no download fees)
 *  - files: R2 at about 1.47 per GB-month, counted as if the whole allowance is used
 *  - support: the share of an engineer's time a customer of that size takes, including setting the server up
 *  - fixed: monitoring, domain and certificates per tenant
 *  - Mei AI: nothing, the customer's own key pays the provider
 */
export const RUNNING_COST = {
  assumptions: { usdToInr: 98, objectStoragePerGb: 1.47, targetMargin: 0.69 },
  perPlan: {
    start: { compute: 392, backups: 46, files: 37, support: 300, fixed: 115 },
    grow: { compute: 782, backups: 288, files: 147, support: 800, fixed: 115 },
    complete: { compute: 1564, backups: 450, files: 368, support: 1200, fixed: 115 },
  },
} as const;

/** What a plan costs us a month. */
export function runningCost(id: keyof typeof RUNNING_COST.perPlan): number {
  return Object.values(RUNNING_COST.perPlan[id]).reduce((a, b) => a + b, 0);
}

/**
 * The two products. A company has one: a services firm runs projects, a business that sells products runs inventory.
 * The ERP and the licence key hold the same split, so one installation never shows both.
 */
export type Edition = "services" | "goods";
export const EDITIONS: { id: Edition; name: string; for: string; text: string }[] = [
  { id: "services", name: "Services edition", for: "Agencies, consultancies, clinics and trades", text: "Clients, projects and timesheets, people and payroll, estimates and invoices." },
  { id: "goods", name: "Goods edition", for: "Traders, distributors and wholesalers", text: "Customers, products and orders, stock and purchasing, people and payroll, estimates and invoices." },
];

/** The ids are the keys the control plane switches the product on with ("sales" is CRM, "finance" is Accounting). */
export type GroupId = "sales" | "finance" | "projects" | "people" | "payroll" | "inventory";

export interface AppGroup {
  id: GroupId;
  name: string;
  text: string;
  /** Groups that must come with it, so choosing it brings them. */
  needs?: GroupId[];
  /** The one edition it belongs to; the others are in both. */
  edition?: Edition;
}

/** The app groups a company picks from. These are the same groups the product is switched on with, one for one. */
export const APP_GROUPS: AppGroup[] = [
  { id: "sales", name: "CRM", text: "Contacts, leads, follow-ups and meetings, with every client in one place." },
  { id: "finance", name: "Accounting", text: "Estimates, invoices, recurring invoices, receipts, expenses, banking and reports." },
  { id: "projects", name: "Projects & tasks", text: "Projects, boards, task tracking and project money.", edition: "services" },
  { id: "inventory", name: "Inventory & orders", text: "Products, orders, stock in warehouses, counts and purchase orders.", edition: "goods" },
  { id: "people", name: "People & HR", text: "Employee records, attendance, leave, shifts and timesheets." },
  { id: "payroll", name: "Payroll", text: "Salary structures, pay runs with approval, and payslips.", needs: ["people"] },
];

/** The groups of an edition, in the order they are offered. */
export function groupsOf(edition: Edition): AppGroup[] {
  return APP_GROUPS.filter((g) => !g.edition || g.edition === edition);
}

/** The picks that belong to an edition, so switching edition never keeps the other one's group. */
export function inEdition(picked: GroupId[], edition: Edition): GroupId[] {
  return picked.filter((id) => groupsOf(edition).some((g) => g.id === id));
}

/** Starting points for the plan builder: sets of groups that real teams ask for, by edition. */
export const PRESETS: { name: string; edition: Edition; groups: GroupId[] }[] = [
  { name: "Agency or consultancy", edition: "services", groups: ["sales", "finance", "projects"] },
  { name: "Services with a team", edition: "services", groups: ["sales", "finance", "projects", "people"] },
  { name: "Sales and stock", edition: "goods", groups: ["sales", "inventory"] },
  { name: "Trading with invoices", edition: "goods", groups: ["sales", "finance", "inventory"] },
  { name: "People and payroll", edition: "services", groups: ["people", "payroll"] },
  { name: "People and payroll", edition: "goods", groups: ["people", "payroll"] },
  { name: "Everything", edition: "services", groups: ["sales", "finance", "projects", "people", "payroll"] },
  { name: "Everything", edition: "goods", groups: ["sales", "finance", "inventory", "people", "payroll"] },
];

/** A picked set with what it needs added (payroll brings People & HR). */
export function withNeeds(picked: GroupId[]): GroupId[] {
  const out = new Set<GroupId>(picked);
  for (const g of picked) for (const n of APP_GROUPS.find((x) => x.id === g)?.needs ?? []) out.add(n);
  return APP_GROUPS.map((g) => g.id).filter((id) => out.has(id));
}

/** The plan that fits this many groups, or undefined when none are picked. */
export function planForGroups(count: number): PlanId | undefined {
  if (count <= 0) return undefined;
  const t = CLOUD.tiers.find((x) => x.perMonth && x.groups >= count);
  return (t?.id as PlanId) ?? "complete";
}

export interface Term {
  id: TermId;
  name: string;
  per: string;
  note: string;
  popular?: boolean;
}

/**
 * On your own server: we install it with you and you own the database. We carry no hosting cost here, only
 * installation, updates and support. The lifetime licence includes the first year of the server it runs on (worth
 * about 9,600 to 19,200 rupees, from approxInr in OWN_SERVER, a rough monthly cost of a VPS of that size that the site
 * never shows by host name), and a buyer who already has a server takes that amount off. One and two year licences do
 * not include a server. pricing.test.ts keeps the terms in order and the server a small part of the lifetime price.
 */
export const TERMS: Term[] = [
  { id: "term1", name: "1-year licence", per: "for one year", note: "Use for a year, updates included for the same year." },
  { id: "term2", name: "2-year licence", per: "for two years", note: "Two years of use and updates at a lower yearly cost." },
  { id: "lifetime", name: "Lifetime licence", per: "one time", note: "Pay once, use forever. Includes one year of updates and one year of the server.", popular: true },
];

/**
 * What a customer's own server needs. Users are never counted on a licence, so the only limit is the hardware. The
 * 50-user row is the one we promise: the load test (docs/performance.md) ran 20 people working at once, and 50 named
 * users are rarely more than that at the same moment, so 2 vCPU and 4 GB leave headroom. Bigger rows are our sizing
 * guidance, to be confirmed with the customer.
 */
export const OWN_SERVER = {
  requirements: "Ubuntu 22.04 or 24.04 with Docker, ports 80 and 443 open, and an internet connection when we install it.",
  sizes: [
    { users: "Up to 50 people", vcpu: 2, ramGb: 4, diskGb: 40, note: "The smallest we recommend for a company", approxInr: 800 },
    { users: "50 to 150 people", vcpu: 4, ramGb: 8, diskGb: 100, note: "Busier teams, more files and reports", approxInr: 1600 },
  ],
  private: ["The database, files and backups all stay on your server", "Nothing is shared with us or with another company", "The system runs with no connection to us after setup"],
};

/** What every licence has, whatever the plan. */
export const LICENCE_INCLUDED = ["Runs on your server, you own the database", "Mei AI assistant included", "Unlimited users, limited only by your server", "Everything private on your server", "We install it with you", "Updates for the licence term", "Move up a plan by paying the difference"];

export const AMC_TEXT = "Optional yearly support and updates for a lifetime licence: new releases, bug fixes and priority email support. Without it, your system keeps working; you just stop receiving new releases.";

type OwnPrices = Record<PlanId, Record<TermId, number>>;
type Table = { cloud: Record<PlanId, number>; own: OwnPrices; amc: Record<PlanId, number> };

/**
 * List prices in each currency we show, before tax. INR is the source (the figures above, which the margin test checks);
 * the others are set from it at about USD 1 = INR 98, GBP 1 = USD 1.33, EUR 1 = USD 1.16 and USD 1 = AED 3.67, then
 * rounded to a clean price. They are set by hand, not converted live, so a price never changes with the exchange rate.
 * Review them before launch; pricing.test.ts fails if one drifts more than 15% from the INR price.
 */
export const PRICES: Record<CurrencyCode, Table> = {
  INR: {
    cloud: { start: 3999, grow: 7999, complete: 12999 },
    own: { start: { term1: 39999, term2: 69999, lifetime: 119999 }, grow: { term1: 79999, term2: 139999, lifetime: 239999 }, complete: { term1: 129999, term2: 229999, lifetime: 389999 } },
    amc: { start: 11999, grow: 23999, complete: 38999 },
  },
  USD: {
    cloud: { start: 39, grow: 79, complete: 129 },
    own: { start: { term1: 409, term2: 709, lifetime: 1199 }, grow: { term1: 819, term2: 1399, lifetime: 2399 }, complete: { term1: 1299, term2: 2299, lifetime: 3999 } },
    amc: { start: 119, grow: 239, complete: 399 },
  },
  GBP: {
    cloud: { start: 29, grow: 59, complete: 99 },
    own: { start: { term1: 309, term2: 539, lifetime: 919 }, grow: { term1: 609, term2: 1099, lifetime: 1799 }, complete: { term1: 999, term2: 1799, lifetime: 2999 } },
    amc: { start: 89, grow: 179, complete: 299 },
  },
  EUR: {
    cloud: { start: 35, grow: 69, complete: 115 },
    own: { start: { term1: 349, term2: 619, lifetime: 1099 }, grow: { term1: 699, term2: 1199, lifetime: 2099 }, complete: { term1: 1099, term2: 1999, lifetime: 3399 } },
    amc: { start: 109, grow: 209, complete: 339 },
  },
  AED: {
    cloud: { start: 149, grow: 299, complete: 479 },
    own: { start: { term1: 1499, term2: 2599, lifetime: 4499 }, grow: { term1: 2999, term2: 5199, lifetime: 8999 }, complete: { term1: 4899, term2: 8599, lifetime: 14599 } },
    amc: { start: 449, grow: 899, complete: 1499 },
  },
};

/** A cloud plan's monthly price in a currency; undefined for a plan quoted by sales. */
export function cloudPrice(id: string, c: CurrencyCode): number | undefined {
  return PRICES[c].cloud[id as PlanId];
}

/** A licence's price for a plan and term in a currency. */
export function licencePrice(plan: string, term: string, c: CurrencyCode): number {
  return PRICES[c].own[plan as PlanId][term as TermId];
}

/** The yearly support price for a lifetime licence of a plan. */
export function amcPrice(plan: string, c: CurrencyCode): number {
  return PRICES[c].amc[plan as PlanId];
}

/** The server a plan needs on your own hardware: the 50-person size for Start and Grow, the next one up for Complete. */
export function serverFor(plan: string) {
  return plan === "complete" ? OWN_SERVER.sizes[1] : OWN_SERVER.sizes[0];
}

/** What the first year of the server is worth, in a currency: twelve months of the server the plan needs. */
export function serverYearValue(plan: string, c: CurrencyCode): number {
  return fromInr(serverFor(plan).approxInr * 12, c);
}

/**
 * A licence price, with the first year of the server taken off when the buyer already has one. A lifetime licence
 * includes that year of server; a one or two year licence does not, so there is nothing to take off.
 */
export function licenceTotal(plan: string, term: string, c: CurrencyCode, ownServer: boolean): number {
  const base = licencePrice(plan, term, c);
  return term === "lifetime" && ownServer ? base - serverYearValue(plan, c) : base;
}

/** A price with its currency, e.g. "₹2,999", "$29", "AED 109". */
export function money(n: number, c: CurrencyCode): string {
  return formatMoney(n, c);
}

export function inr(n: number): string {
  return money(n, "INR");
}

/** How the price is put together, shown on the pricing page. No figure here: the prices above are the only ones. */
export const HOW_PRICING_WORKS = [
  { title: "Pick your edition", text: "The Services edition runs clients and projects; the Goods edition runs products, orders and stock. Both have CRM, Accounting, People & HR and Payroll. Your system shows only your edition, so nobody wades through screens they never use." },
  { title: "Pick your app groups", text: "Choose the groups your team needs from the five in your edition. Mei, the AI assistant, comes with every plan and is not one of them. Start takes any two, Grow any four, Complete all five. Nobody is counted, so adding a person never costs more." },
  { title: "One year, two years or for good", text: "Buy a licence for one year, two years or for good and run it on your own server. The plans and what is in them are the same for every term, and a longer term costs less a year." },
  { title: "Change your mix whenever you like", text: "Swap a group or add one, and move up a plan if you go past its limit. It is one change for us. Your records are shared, so nothing is retyped or moved, and on your own server you pay only the difference." },
  { title: "Updates and support", text: "The licence key carries its expiry and the date your updates run to. The yearly support plan keeps a lifetime licence current, and the software never stops working." },
];

/** The plan comparison: what differs between the plans, row by row. */
export const PLAN_MATRIX: { name: string; start: string; grow: string; complete: string }[] = [
  { name: "App groups you choose, from your edition", start: "Any 2", grow: "Any 4", complete: "All 5" },
  { name: "Mei AI assistant, included in every plan", start: "Yes", grow: "Yes", complete: "Yes" },
  { name: "Unlimited users", start: "Yes", grow: "Yes", complete: "Yes" },
  { name: "Roles, permissions and audit log", start: "Yes", grow: "Yes", complete: "Yes" },
  { name: "Server we suggest", start: "2 vCPU, 4 GB", grow: "2 vCPU, 4 GB", complete: "4 vCPU, 8 GB" },
  { name: "Files and database", start: "Private, on your server", grow: "Private, on your server", complete: "Private, on your server" },
  { name: "Backups", start: "Built in", grow: "Built in", complete: "Built in" },
  { name: "Support", start: "Email", grow: "Email", complete: "Priority email" },
];
