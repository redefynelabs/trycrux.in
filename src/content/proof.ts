/**
 * Proof for the demo and contact pages. Only real, checkable things go here: a quote needs the person's permission, and
 * a logo needs the customer's. Empty lists hide their part of the section.
 */

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** A photo in public/, square. */
  photo?: string;
  /** One result in numbers, shown above the quote, e.g. "4 tools replaced". */
  result?: string;
}

/** Customer quotes. Add real ones only. */
export const TESTIMONIALS: Testimonial[] = [];

/** Customer logos (files in public/logos), with the customer's permission. */
export const LOGOS: { name: string; src: string }[] = [];

/** What we promise, in numbers anyone can check by trying it. */
export const FACTS = [
  { value: "10 s", label: "to your own private demo" },
  { value: "24 h", label: "from yes to running your business" },
  { value: "0", label: "per-user fees, ever" },
  { value: "100%", label: "of your data, exportable any time" },
] as const;

/** How the data is kept safe; each is a feature of the product or the hosting. */
export const TRUST = [
  { icon: "database", title: "Your own private database", text: "Every company runs on its own instance and database, never shared tables." },
  { icon: "lock", title: "Roles, permissions and an audit log", text: "People see only what their role allows, and every change is recorded." },
  { icon: "clock", title: "Daily backups", text: "Built in on your own server and kept 30 days, so a mistake is never final." },
  { icon: "download", title: "No lock-in", text: "Export everything any time, or move to your own server later." },
] as const;
