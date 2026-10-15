/**
 * /llms.txt and /llms-full.txt: Crux described in plain Markdown for AI assistants and answer engines
 * (https://llmstxt.org). Built from the same content files as the pages, so an assistant quotes what the site says.
 */
import { ENTRIES, longDay, sortedEntries } from "@/content/changelog";
import { FAQ_GROUPS, PRICING_FAQ } from "@/content/faq";
import { HIGHLIGHTS, MODULES } from "@/content/features";
import { CAPABILITIES, TRUST } from "@/content/mei";
import { AMC, CLOUD, ON_PREM, inr } from "@/content/pricing";
import { COMPANY, DESCRIPTION } from "@/lib/seo";
import { SITE } from "@/lib/site";

const u = (path: string) => SITE.url + path;

function pricing(): string {
  const cloud = CLOUD.tiers.map((t) => `- ${t.name}: ${t.perMonth ? `${inr(t.perMonth)} a month` : "priced with you"}. ${t.for}; ${t.team.toLowerCase()}. Backups: ${t.backups.toLowerCase()}.`);
  const own = ON_PREM.map((l) => `- ${l.name}: ${inr(l.price)} ${l.per}. ${l.note}`);
  return [
    "## Pricing",
    "",
    `One flat price by company size, never per user. Every plan includes every module, Mei the AI assistant and unlimited users. Prices are in Indian rupees and exclude taxes such as GST. Yearly cloud billing saves ${CLOUD.annualDiscountPct}%. AI usage is billed by the AI provider whose key the customer connects.`,
    "",
    "Cloud (we host and run it; each company gets its own instance and database):",
    ...cloud,
    "",
    "Own server (installed on the customer's server; the customer owns the database):",
    ...own,
    `- Optional yearly support for a lifetime licence: ${inr(AMC.perYear)} a year. ${AMC.text}`,
    "",
    `Details: ${u("/pricing")}`,
  ].join("\n");
}

function intro(): string {
  return [
    `# ${SITE.name}`,
    "",
    `> ${DESCRIPTION}`,
    "",
    `${SITE.name} is made by ${COMPANY}. Website: ${SITE.url}. It runs on our cloud or on the customer's own server, and is built for growing companies, with GST invoicing for India and billing in other currencies.`,
    "",
    "## Why companies choose it",
    "",
    ...HIGHLIGHTS.map((h) => `- ${h.title}: ${h.text}`),
  ].join("\n");
}

function modules(full: boolean): string {
  return [
    "## Modules",
    "",
    "Use all of them or only the ones you need; they share one set of people, clients and permissions.",
    "",
    ...MODULES.flatMap((m) => (full ? [`### ${m.name}`, "", m.tagline, "", ...m.features.map((f) => `- ${f.title}: ${f.text}`), ""] : [`- ${m.name}: ${m.tagline} (${m.features.map((f) => f.title).join(", ")})`])),
  ].join("\n");
}

function mei(): string {
  return ["## Mei, the AI assistant", "", ...CAPABILITIES.map((c) => `- ${c.title}: ${c.text}`), ...TRUST.map((c) => `- ${c.title}: ${c.text}`)].join("\n");
}

function pages(): string {
  return [
    "## Pages",
    "",
    `- [Home](${u("/")}): what Crux is, the modules, Mei, how it works and the FAQ`,
    `- [Pricing](${u("/pricing")}): cloud plans, licences for your own server and pricing questions`,
    `- [Try the demo](${u("/demo")}): a private copy with a sample company, ready in seconds, no card`,
    `- [Contact sales](${u("/contact")}): get a recommendation and a setup within 24 hours`,
    `- [Changelog](${u("/changelog")}): what shipped and when`,
    `- [Terms](${u("/legal/terms")}), [Privacy](${u("/legal/privacy")}), [Your data, your ownership](${u("/legal/data-ownership")})`,
    `- [Full details for AI assistants](${u("/llms-full.txt")})`,
  ].join("\n");
}

/** The short summary. */
export function llmsTxt(): string {
  return [intro(), modules(false), mei(), pricing(), pages()].join("\n\n") + "\n";
}

/** Everything: every feature, every question and answer, and the recent changelog. */
export function llmsFullTxt(): string {
  const seen = new Set<string>();
  const faq = [...FAQ_GROUPS, { id: "pricing-more", label: "More on pricing", items: PRICING_FAQ }].flatMap((g) => {
    const items = g.items.filter((i) => !seen.has(i.q) && seen.add(i.q));
    return items.length ? [`### ${g.label}`, "", ...items.flatMap((i) => [`**${i.q}**`, "", i.a, ""])] : [];
  });
  const changes = sortedEntries(ENTRIES).slice(0, 8).map((e) => `- ${longDay(e.date)}, ${e.area}: ${e.title}. ${e.text}`);
  return [intro(), modules(true), mei(), pricing(), ["## Questions and answers", "", ...faq].join("\n"), ["## Recent changes", "", ...changes].join("\n"), pages()].join("\n\n") + "\n";
}
