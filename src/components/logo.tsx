import Image from "next/image";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/** The Crux logo: the mark (public/logo/crux-mark.png, trimmed from crux_icon.png) and the name in Punta. Size it by height (h-7, h-8).
 * The mark is a little taller than a capital. Punta draws its letters high in their line box, so the name is moved
 * down to sit on the same centre as the mark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-7 items-center gap-[0.28em] text-[1.75rem] leading-none", className)}>
      <Image src="/logo/crux-mark.png" alt="" width={256} height={256} priority unoptimized className="h-[0.95em] w-auto" />
      <span className="relative top-[0.14em] font-display font-semibold tracking-normal text-fg">{SITE.name}</span>
    </span>
  );
}
