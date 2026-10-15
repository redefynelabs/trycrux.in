import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { AnnouncementBar } from "@/components/announcement-bar";
import { AttributionCapture } from "@/components/attribution-capture";
import { PageBackdrop } from "@/components/page-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { COMPANY, DESCRIPTION, KEYWORDS, jsonLd, siteGraph } from "@/lib/seo";
import { SITE } from "@/lib/site";
import "./globals.css";

// The ERP's typefaces.
const sans = Geist({ variable: "--font-sans-face", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--font-mono-face", subsets: ["latin"] });
// The brand face, Punta Light, for the wordmark and headings. It is the only weight there is: semibold headings and the
// wordmark get a bolder rendering of it from the browser until a heavier cut is added here.
const display = localFont({
  src: [{ path: "../../font/Punta - Light.otf", weight: "300", style: "normal" }],
  variable: "--font-display-face",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: COMPANY, url: SITE.url }],
  creator: COMPANY,
  publisher: COMPANY,
  category: "Business software",
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", title: `${SITE.name}: ${SITE.tagline}`, description: DESCRIPTION, url: SITE.url },
  twitter: { card: "summary_large_image", title: `${SITE.name}: ${SITE.tagline}`, description: DESCRIPTION },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(siteGraph()) }} />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-4xl focus:bg-bg focus:px-3 focus:py-2">
          Skip to content
        </a>
        <AttributionCapture />
        <AnnouncementBar />
        {/* A framed column: on wide screens the page sits between hatched gutters, as in the Magic UI templates. */}
        <div className="2xl:bg-[repeating-linear-gradient(135deg,var(--line)_0_1px,transparent_1px_9px)]">
          <div className="relative mx-auto max-w-[100rem] bg-bg 2xl:border-x 2xl:border-line">
            <SiteHeader />
            <PageBackdrop />
            <main id="main" className="relative z-10 overflow-x-clip">{children}</main>
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
