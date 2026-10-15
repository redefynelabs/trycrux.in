"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A card of the bento grid: a visual on top, a title and a line of text below. A `half` card sits two to a row on phones,
 * with its picture at 60% so it still shows whole.
 */
export function BentoCard({ title, text, className, half, children }: { title: string; text: string; className?: string; half?: boolean; children: ReactNode }) {
  return (
    <div className={cn("group relative flex min-w-0 flex-col overflow-hidden bg-bg", half ? "col-span-1" : "col-span-2", className)}>
      <div className={cn("relative flex-1 overflow-hidden", half ? "h-44 flex-none sm:h-auto sm:min-h-64 sm:flex-1" : "min-h-64")}>
        {half ? <div className="absolute inset-0 h-[166.667%] w-[166.667%] origin-top-left scale-[0.6] sm:static sm:contents">{children}</div> : children}
        {/* The picture fades into the card instead of ending on an edge. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div className={cn("pt-3", half ? "px-4 pb-5 sm:px-7 sm:pb-7" : "px-5 pb-6 sm:px-7 sm:pb-7")}>
        <h3 className={cn("font-semibold tracking-tight", half ? "text-base leading-tight sm:text-lg" : "text-lg")}>{title}</h3>
        <p className="mt-1.5 text-sm text-muted">{text}</p>
      </div>
    </div>
  );
}

const INTEGRATIONS = [
  { name: "Gmail", src: "/icons/gmail-icon.png" },
  { name: "Google Calendar", src: "/icons/google-calendar-icon.png" },
  { name: "Google Meet", src: "/icons/google-meet-icon.png" },
  { name: "Outlook", src: "/icons/outlook-icon.svg" },
  { name: "Microsoft Teams", src: "/icons/teams-icon.svg" },
  { name: "WhatsApp", src: "/icons/whatsapp-icon.png" },
  { name: "ChatGPT", src: "/icons/openai.svg" },
  { name: "Claude", src: "/icons/claude.svg" },
  { name: "Gemini", src: "/icons/gemini.svg" },
];

/** The tools the ERP connects to, in a ruled grid like a logo wall. Marks are the services' own. */
export function IntegrationsGrid() {
  return (
    <ul className="grid grid-cols-3 gap-px bg-line ring-1 ring-line sm:grid-cols-3 lg:grid-cols-9">
      {INTEGRATIONS.map((i) => (
        <li key={i.name} className="group flex flex-col items-center justify-center gap-3 bg-bg px-3 py-8 text-center transition-colors hover:bg-soft">
          <Image src={i.src} alt="" width={40} height={40} unoptimized className="size-10 object-contain transition-transform duration-300 group-hover:scale-110" />
          <span className="text-sm font-semibold tracking-tight">{i.name}</span>
        </li>
      ))}
    </ul>
  );
}
