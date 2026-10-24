/**
 * What search engines and AI assistants read about Crux: structured data (schema.org JSON-LD), the shared page
 * metadata and the question the "Ask AI" buttons send. Facts come from the content files, so they never drift from
 * what the pages say.
 */
import type { Metadata } from "next";
import type { QA } from "@/content/faq";
import { CLOUD, TERMS, licencePrice } from "@/content/pricing";
import { CURRENCY_CODES } from "@/lib/currency";
import { SITE } from "@/lib/site";

/** The company behind the product, as it appears in structured data and the legal pages. */
export const COMPANY = "Redefyne";

/** The words people search for; also the description every page starts from. */
export const DESCRIPTION =
  "Crux is the AI-powered business operating system: the only software your business needs. HR, attendance, leave and payroll, projects and timesheets, CRM and sales, inventory, invoicing and receipts with GST or VAT and finance reports in one system, with Mei, an AI assistant that answers and drafts from your own data. Live within 24 hours, three plans by the apps you need, unlimited users, no per-user price.";

export const KEYWORDS = [
  "Crux",
  "business operating system",
  "AI ERP",
  "ERP software",
  "ERP for small business",
  "all-in-one business software",
  "HR software",
  "attendance and leave management",
  "project management and timesheets",
  "CRM software",
  "estimates and invoicing",
  "inventory and order management",
  "GST invoicing software",
  "finance reports",
  "AI assistant for business",
  "self-hosted ERP",
  "ERP India",
];

/** The site's share card (app/opengraph-image.tsx). A page that sets its own openGraph loses the inherited one, so it is named. */
const SHARE_IMAGE = { url: "/opengraph-image", width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` };

/** A page's metadata: its own title, description and canonical address, with the shared share card. */
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", url: SITE.url + path, title: `${title} | ${SITE.name}`, description, images: [SHARE_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE.name}`, description, images: [SHARE_IMAGE.url] },
  };
}

/** JSON-LD for a <script type="application/ld+json">, with "<" escaped so text can never close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const org = { "@type": "Organization", "@id": `${SITE.url}/#organization`, name: COMPANY, url: SITE.url, logo: `${SITE.url}/logo/crux-mark.png`, brand: { "@type": "Brand", name: SITE.name } };

/** The organization, the website and the product, on every page. */
export function siteGraph() {
  const cloud = CLOUD.tiers.filter((t) => t.perMonth);
  return {
    "@context": "https://schema.org",
    "@graph": [
      org,
      { "@type": "WebSite", "@id": `${SITE.url}/#website`, url: SITE.url, name: SITE.name, description: SITE.tagline, publisher: { "@id": org["@id"] }, inLanguage: "en" },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE.url}/#software`,
        name: SITE.name,
        description: DESCRIPTION,
        url: SITE.url,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "ERP",
        operatingSystem: "Web browser; self-hosted on Linux",
        publisher: { "@id": org["@id"] },
        featureList: ["People and HR", "Attendance, shifts and leave", "Projects, tasks and timesheets", "CRM, leads and follow-ups", "Estimates and invoices", "Products, orders, inventory and purchasing", "Payroll and payslips", "Invoicing with GST", "Payments, expenses and finance reports", "Mei AI assistant", "Roles, permissions and audit log"],
        offers: [
          ...CURRENCY_CODES.flatMap((c) => [
            ...cloud.flatMap((t) => TERMS.map((l) => ({ "@type": "Offer", name: `${t.name} ${l.name.toLowerCase()}`, price: licencePrice(t.id, l.id, c), priceCurrency: c, description: `${t.for}. ${l.note} Runs on your own server.` }))),
          ]),
        ],
      },
    ],
  };
}

/** A page of questions and answers. */
export function faqPage(items: QA[]) {
  const seen = new Set<string>();
  const unique = items.filter((i) => !seen.has(i.q) && seen.add(i.q));
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: unique.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

/** What the "Ask AI" buttons ask: the assistant reads the site and answers as a buyer would want. */
export function askAiPrompt(): string {
  return `Tell me about Crux (${SITE.url}), the AI-powered business operating system. Read the website and its ${SITE.url}/llms.txt, then explain what it does, who it is for, its modules and the Mei AI assistant, how pricing works, how my data is kept, and how I can try it.`;
}
