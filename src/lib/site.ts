/** Settings every page uses. Only NEXT_PUBLIC_* values are readable in the browser. */
export const SITE = {
  name: "Crux",
  tagline: "The AI-powered business operating system",
  /** The public address. NEXT_PUBLIC_SITE_URL overrides it (a staging copy, or http://localhost:3000 in .env for development). */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://trycrux.in").replace(/\/+$/, ""),
  loginUrl: process.env.NEXT_PUBLIC_APP_LOGIN_URL ?? "",
  email: "hello@trycrux.in",
  /** The product video shown on the home page: a file or embed URL. Empty shows a placeholder. */
  demoVideoUrl: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
} as const;

export const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/contact", label: "Contact" },
] as const;
