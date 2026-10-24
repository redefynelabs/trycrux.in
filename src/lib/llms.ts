/**
 * /llms.txt and /llms-full.txt: Crux described in plain Markdown for AI assistants and answer engines
 * (https://llmstxt.org). Built from the same content files as the pages, so an assistant quotes what the site says.
 */
import { ENTRIES, longDay, sortedEntries } from "@/content/changelog";
import { FAQ_GROUPS, PRICING_FAQ } from "@/content/faq";
import { INDUSTRIES } from "@/content/industries";
import { PRODUCT_PAGES } from "@/content/product";
import { HIGHLIGHTS, MODULES } from "@/content/features";
import { CAPABILITIES, TRUST } from "@/content/mei";
import { AMC_TEXT, APP_GROUPS, CLOUD, EDITIONS, OWN_SERVER, LICENCE_INCLUDED, TERMS, amcPrice, licencePrice, money } from "@/content/pricing";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/currency";
import { COMPANY, DESCRIPTION } from "@/lib/seo";
import { SITE } from "@/lib/site";

/** One price in every currency: "₹2,999 / $29 / £23 / €26 / AED 109". */
function allCurrencies(price: (c: CurrencyCode) => number): string {
  return CURRENCY_CODES.map((c) => money(price(c), c)).join(" / ");
}

const u = (path: string) => SITE.url + path;

function pricing(): string {
  const plans = CLOUD.tiers.filter((t) => t.perMonth);
  const own = plans.flatMap((t) => [`- ${t.name} licence:`, ...TERMS.map((l) => `  - ${l.name}: ${allCurrencies((c) => licencePrice(t.id, l.id, c))} ${l.per}. ${l.note}`), `  - Support and updates after a lifetime licence: ${allCurrencies((c) => amcPrice(t.id, c))} a year`]);
  return [
    "## Pricing",
    "",
    `Crux comes in two editions: ${EDITIONS.map((e) => `${e.name} (${e.for}): ${e.text}`).join(" ")} A company has one edition. Plans are chosen by how many of the five app groups of its edition a company picks, never per user: ${APP_GROUPS.map((g) => `${g.name}${g.edition ? ` (${g.edition} edition only)` : ""}`).join("; ")}. Start takes any two, Grow any four and Complete all five, so a team that needs only CRM, accounting and HR pays for just those. Every plan has unlimited users and Mei the AI assistant, which is not one of the groups. Crux is sold as a licence for one year, two years or for good, installed on the customer's own server. Prices are set in Indian rupees, US dollars, British pounds, euros and UAE dirhams (the site shows the one for the visitor's country) and exclude taxes such as GST or VAT. AI usage is billed by the AI provider whose key the customer connects.`,
    "",
    "",
    `Own server (installed on the customer's server; the customer owns the database). Every licence: ${LICENCE_INCLUDED.join("; ").toLowerCase()}.`,
    ...own,
    `- ${AMC_TEXT}`,
    `- Server for a licence: ${OWN_SERVER.sizes.map((r) => `${r.users}: ${r.vcpu} vCPU, ${r.ramGb} GB memory, ${r.diskGb} GB SSD`).join("; ")}. ${OWN_SERVER.requirements} Users are never counted; ${OWN_SERVER.private.join("; ").toLowerCase()}.`,
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
    `${SITE.name} is made by ${COMPANY}. Website: ${SITE.url}. It is installed on the customer's own server, and is built for growing companies, with GST invoicing for India and billing in other currencies.`,
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

function industries(): string {
  const renamed = (i: (typeof INDUSTRIES)[number]) => (i.words ?? []).filter((w) => w.used.toLowerCase() !== `${w.generic.toLowerCase()}s`);
  const edition = (id: string) => EDITIONS.find((e) => e.id === id)?.name ?? id;
  return [
    "## Industries",
    "",
    ...INDUSTRIES.flatMap((i) => [
      `### [${i.name}](${u(`/industries/${i.slug}`)})`,
      "",
      `${i.short} Runs on the ${edition(i.edition)}. Apps: ${i.apps.join(", ")}.${renamed(i).length ? ` Words: ${renamed(i).map((w) => `${w.used} for ${w.generic.toLowerCase()}s`).join(", ")}.` : ""}`,
      "",
      ...i.flow.map((f, n) => `${n + 1}. ${f}`),
      "",
    ]),
  ].join("\n");
}

function pages(): string {
  return [
    "## Pages",
    "",
    `- [Home](${u("/")}): what Crux is, the modules, Mei, how it works and the FAQ`,
    `- [Apps](${u("/product")}): ${PRODUCT_PAGES.map((p) => p.name).join(", ")}`,
    `- [Industries](${u("/industries")}): ${INDUSTRIES.map((i) => i.name).join(", ")}`,
    `- [Pricing](${u("/pricing")}): licences for your own server and pricing questions`,
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
  return [intro(), modules(true), mei(), pricing(), ["## Questions and answers", "", ...faq].join("\n"), industries(), ["## Recent changes", "", ...changes].join("\n"), pages()].join("\n\n") + "\n";
}
