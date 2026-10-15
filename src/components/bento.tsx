"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A card of the bento grid: a visual on top, a title and a line of text below. */
export function BentoCard({ title, text, className, children }: { title: string; text: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("group relative flex flex-col overflow-hidden bg-bg", className)}>
      <div className="relative min-h-64 flex-1 overflow-hidden">
        {children}
        {/* The picture fades into the card instead of ending on an edge. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div className="px-7 pt-3 pb-7">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
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
