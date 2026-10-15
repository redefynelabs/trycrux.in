"use client";

/* eslint-disable @next/next/no-img-element -- small static brand marks; Next's optimizer adds nothing */
import { useState } from "react";
import { buttonClass } from "@/components/buttons";
import { askAiPrompt } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Buttons that open an AI assistant with a question about Crux already asked. ChatGPT, Claude and Perplexity take the
 * question in the address; Gemini cannot, so its button copies the question first and opens Gemini to paste it into.
 */
const ASSISTANTS = [
  { name: "ChatGPT", icon: "/icons/openai.svg", url: (q: string) => `https://chatgpt.com/?q=${encodeURIComponent(q)}` },
  { name: "Claude", icon: "/icons/claude.svg", url: (q: string) => `https://claude.ai/new?q=${encodeURIComponent(q)}` },
  { name: "Gemini", icon: "/icons/gemini.svg", url: () => "https://gemini.google.com/app", copies: true },
  { name: "Perplexity", icon: "/icons/perplexity.svg", url: (q: string) => `https://www.perplexity.ai/search?q=${encodeURIComponent(q)}` },
] as const;

export function AskAiButtons({ size = "md", align = "center", className }: { size?: "sm" | "md"; align?: "center" | "start"; className?: string }) {
  const [copied, setCopied] = useState(false);
  const prompt = askAiPrompt();

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard blocked: Gemini still opens, and the person can type the question.
    }
  }

  return (
    <div className={className}>
      <div className={cn("gap-2", align === "center" ? "flex flex-wrap justify-center" : "grid max-w-sm grid-cols-2")}>
        {ASSISTANTS.map((a) => (
          <a
            key={a.name}
            href={a.url(prompt)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={"copies" in a ? () => void copy() : undefined}
            className={buttonClass("outline", size, align === "start" ? "justify-start" : "")}
          >
            <img src={a.icon} alt="" width={18} height={18} className={cn("size-[18px]", size === "sm" && "size-4")} />
            Ask {a.name}
          </a>
        ))}
      </div>
      <p aria-live="polite" className={cn("mt-2 min-h-4 text-xs text-muted", align === "center" && "text-center")}>
        {copied ? "Question copied. Paste it into Gemini." : ""}
      </p>
    </div>
  );
}

/** The home page block: ask your own AI what Crux is. */
export function AskAi() {
  return (
    <div className="rounded-[2rem] border border-line bg-soft/60 px-6 py-12 text-center sm:px-12">
      <h2 id="ask-ai" className="text-2xl font-semibold sm:text-3xl">Ask your AI about Crux</h2>
      <p className="mx-auto mt-3 max-w-xl text-muted">Prefer to hear it from someone else? Ask the assistant you already use what Crux does, what it costs and whether it fits your company.</p>
      <AskAiButtons className="mt-8" />
    </div>
  );
}
