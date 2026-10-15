import Image from "next/image";
import Link from "next/link";
import { AskAiButtons } from "@/components/ask-ai";
import { Logo } from "@/components/logo";
import { COMPANY } from "@/lib/seo";
import { SITE } from "@/lib/site";

const COLS = [
  { title: "Product", links: [["/#features", "Features"], ["/#mei", "Mei AI assistant"], ["/#how", "How it works"], ["/#control", "Security and control"], ["/pricing", "Pricing"]] },
  { title: "Get started", links: [["/demo", "Try the demo"], ["/contact", "Talk to sales"], ["/changelog", "Changelog"], ["/llms.txt", "Crux for AI assistants"]] },
  { title: "Legal", links: [["/legal/terms", "Terms of service"], ["/legal/privacy", "Privacy notice"], ["/legal/data-ownership", "Your data, your ownership"]] },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-28 overflow-hidden border-t border-line bg-soft/40">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-4 pt-16 pb-12 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{SITE.tagline}. HR, projects, CRM, sales and finance in one system, on our cloud or your own server, with every feature and no per-user price.</p>
          <div className="mt-8">
            <p className="text-xs font-semibold tracking-wide text-fg uppercase">Ask an AI about {SITE.name}</p>
            <AskAiButtons size="sm" align="start" className="mt-3" />
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
          {COLS.map((c) => (
            <div key={c.title}>
              <p className="text-xs font-semibold tracking-wide text-fg uppercase">{c.title}</p>
              <ul className="mt-4 space-y-3 text-sm text-muted">
                {c.links.map(([href, label]) => (
                  <li key={href}><Link href={href} className="transition-colors hover:text-fg">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-[84rem] px-4 sm:px-6">
        <div className="flex flex-col gap-2 border-t border-line py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {COMPANY}. All rights reserved.</p>
          <p>{SITE.name} is a product of {COMPANY}.</p>
        </div>
      </div>

      {/* The logo, as wide as the footer and fading into the page edge, as a sign-off. Sized so mark and name fill the
          content width: the pair is about 3.3 times its font size wide. */}
      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto -mb-[0.2em] flex max-w-[84rem] select-none items-center justify-center gap-[0.24em] px-4 pt-4 text-[min(28vw,25rem)] leading-none opacity-[0.22] sm:px-6"
        style={{ maskImage: "linear-gradient(to bottom, black 35%, transparent 92%)", WebkitMaskImage: "linear-gradient(to bottom, black 35%, transparent 92%)" }}
      >
        <Image src="/logo/crux-mark.png" alt="" width={256} height={256} unoptimized className="relative top-[0.05em] h-[0.8em] w-auto" />
        <span className="relative top-[0.14em] font-display font-semibold tracking-normal text-brand">{SITE.name}</span>
      </div>
    </footer>
  );
}
