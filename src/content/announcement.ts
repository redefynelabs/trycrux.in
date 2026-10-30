/**
 * The bar above the navigation on every page. Set ANNOUNCEMENT to null to hide it. When the message changes, change its
 * id: a visitor who closed the old one then sees the new one.
 */
export interface Announcement {
  id: string;
  text: string;
  href: string;
  cta: string;
}

export const ANNOUNCEMENT: Announcement | null = {
  id: "2026-10-30-hr",
  text: "New: HR self service, and payroll for India, the UAE, the US and the UK. See what shipped.",
  href: "/changelog",
  cta: "What is new",
};
