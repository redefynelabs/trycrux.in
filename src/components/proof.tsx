import Image from "next/image";
import { ClockIcon, DatabaseIcon, DownloadIcon, LockIcon } from "@/components/icons";
import { FACTS, LOGOS, TESTIMONIALS, TRUST } from "@/content/proof";
import { cn } from "@/lib/utils";

const TRUST_ICON = { database: DatabaseIcon, lock: LockIcon, clock: ClockIcon, download: DownloadIcon } as const;

/**
 * Proof for buyers: customer quotes and logos when there are real ones (src/content/proof.ts), and always the promises
 * anyone can check and how the data is kept safe.
 */
export function Proof({ className }: { className?: string }) {
  return (
    <section aria-labelledby="proof" className={cn("mx-auto max-w-[84rem]", className)}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-brand uppercase">Why teams trust Crux</p>
        <h2 id="proof" className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Built to hold your whole business</h2>
        <p className="mt-4 text-muted sm:text-lg">Promises you can check for yourself, and the safeguards around your data.</p>
      </div>

      {LOGOS.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-px bg-line ring-1 ring-line sm:grid-cols-3 lg:grid-cols-6">
          {LOGOS.map((l) => (
            <li key={l.name} className="grid h-24 place-items-center bg-bg px-6">
              <Image src={l.src} alt={l.name} width={140} height={40} className="max-h-9 w-auto object-contain opacity-70 grayscale" />
            </li>
          ))}
        </ul>
      )}

      {TESTIMONIALS.length > 0 && (
        <div className="mt-10 grid gap-px bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name + t.company} className="flex flex-col bg-bg p-6 sm:p-8">
              {t.result && <p className="text-2xl font-semibold tracking-tight text-brand">{t.result}</p>}
              <blockquote className="mt-3 flex-1 text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.photo ? (
                  <Image src={t.photo} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-brand-soft font-semibold text-brand">{t.name[0]}</span>
                )}
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="block text-sm text-muted">{t.role}, {t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-px bg-line ring-1 ring-line lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.label} className="bg-bg px-4 py-6 text-center sm:px-6 sm:py-8">
            <dt className="text-4xl font-semibold tracking-tighter text-brand sm:text-5xl">{f.value}</dt>
            <dd className="mt-2 text-sm text-muted">{f.label}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-px grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
        {TRUST.map((t) => {
          const Icon = TRUST_ICON[t.icon];
          return (
            <li key={t.title} className="flex gap-4 bg-soft/60 p-5 sm:p-6">
              <span className="grid size-10 shrink-0 place-items-center bg-brand-soft text-xl text-brand"><Icon /></span>
              <span>
                <span className="block font-semibold">{t.title}</span>
                <span className="mt-1 block text-sm text-muted">{t.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
