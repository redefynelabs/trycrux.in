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
  id: "2026-10-mei",
  text: "Meet Mei, the AI inside Crux: ask your business anything and get answers, reports and drafts from your own data.",
  href: "/#mei",
  cta: "Meet Mei",
};
