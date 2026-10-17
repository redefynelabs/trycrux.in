import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { INDUSTRIES } from "@/content/industries";

export function IndustryCards() {
  return (
    <>
      <ul className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((i) => (
          <li key={i.slug} className="bg-bg">
            <Link href={`/industries/${i.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-soft sm:p-8">
              <h3 className="text-lg font-semibold tracking-tight">{i.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{i.short}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">See how it fits <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-muted"><Link href="/industries" className="font-medium text-brand underline">All industries</Link></p>
    </>
  );
}
