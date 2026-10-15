import Link from "next/link";
import { buttonClass } from "@/components/buttons";
import { Reveal } from "@/components/reveal";

export function Cta({ title = "See it with real-looking data", text = "Try the demo, then talk to us: we set it up and you run your business on it within 24 hours." }: { title?: string; text?: string }) {
  return (
    <section className="mx-auto mt-28 max-w-[84rem] px-4 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-blue-500 to-blue-700 px-6 py-16 text-center text-white sm:px-12">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.28),transparent_70%)]" />
          <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-25 [--line:rgba(255,255,255,0.35)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">{text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/demo" className={buttonClass("onDark", "lg", "text-blue-700")}>Start a demo</Link>
              <Link href="/contact" className={buttonClass("outlineOnDark", "lg")}>Talk to sales</Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
