import { SparkIcon } from "@/components/icons";
import { MeiCapabilities } from "@/components/mei-capabilities";
import { MeiDemo } from "@/components/mei-demo";
import { Reveal } from "@/components/reveal";

/** The AI-assistant block of the home page: the live example and what Mei does. */
export function MeiSection() {
  return (
    <section id="mei" className="relative mx-auto mt-32 max-w-[84rem] scroll-mt-24 px-4 sm:px-6" aria-labelledby="mei-h">
      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1 text-sm font-semibold text-brand"><SparkIcon className="size-4" /> New: Mei AI Assistant</p>
          <h2 id="mei-h" className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl sm:leading-[1.05]">Ask your business anything. <span className="gradient-text">Mei answers from your own data.</span></h2>
          <p className="mt-5 text-lg text-muted sm:text-xl">Reports, follow-ups, a draft invoice, a tax pack. Mei reads your people, projects, clients and money, as you, and does the digging so you do not have to.</p>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-14"><MeiDemo /></Reveal>

      <Reveal className="mt-24"><MeiCapabilities /></Reveal>
    </section>
  );
}
