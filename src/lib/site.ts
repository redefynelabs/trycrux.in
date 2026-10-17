/** Settings every page uses. Only NEXT_PUBLIC_* values are readable in the browser. */
export const SITE = {
  name: "Crux",
  tagline: "The AI-powered business operating system",
  /** The public address. NEXT_PUBLIC_SITE_URL overrides it (a staging copy, or http://localhost:3000 in .env for development). */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://trycrux.in").replace(/\/+$/, ""),
  email: "hello@trycrux.in",
  /** Google Tag Manager container; NEXT_PUBLIC_GTM_ID overrides it and "off" disables it. Loaded only in production builds. */
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "GTM-WPXKWW33",
  /** Google Analytics 4 web stream; NEXT_PUBLIC_GA_ID overrides it and "off" disables it. Loaded only in production builds. */
  gaId: process.env.NEXT_PUBLIC_GA_ID || "G-4CVZYN65JJ",
  /** Microsoft Clarity project; NEXT_PUBLIC_CLARITY_ID overrides it and "off" disables it. Loaded only after consent. */
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID || "yy9kmhhvj5",
  /** Where people book a call with sales; NEXT_PUBLIC_CAL_URL overrides it. */
  calUrl: process.env.NEXT_PUBLIC_CAL_URL || "https://cal.com/manojkumar20/crux-product-demonstration",
  /** The sales WhatsApp number, digits with the country code; NEXT_PUBLIC_WHATSAPP_NUMBER overrides it and "off" hides every WhatsApp button. */
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919597028220").replace(/\D/g, ""),
  /** The product video shown on the home page: a file or embed URL. Empty shows a placeholder. */
  demoVideoUrl: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
} as const;

export const NAV = [
  { href: "/#features", label: "Features" },
  { href: "/industries", label: "Industries" },
  { href: "/pricing", label: "Pricing" },
  { href: "/changelog", label: "Changelog" },
  { href: "/contact", label: "Contact" },
] as const;
