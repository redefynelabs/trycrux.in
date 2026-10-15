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
  id: "2026-10-crm-sales",
  text: "New in CRM: quotes, orders, a product catalog and invoices that write themselves. Plus, use only the modules you need.",
  href: "/changelog",
  cta: "See what's new",
};
