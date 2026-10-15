import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ShotData {
  src: string;
  alt: string;
}

/** A real screenshot of the product, in a browser frame. The screens are the ERP itself running on the demo company. */
export function Shot({ shot, className, priority = false, fade = false }: { shot: ShotData; className?: string; priority?: boolean; fade?: boolean }) {
  return (
    <figure className={cn("relative overflow-hidden rounded-2xl bg-bg shadow-[0_30px_90px_-40px_rgba(37,99,235,0.5)] ring-1 ring-line", className)}>
      <div aria-hidden="true" className="flex items-center gap-1.5 border-b border-line bg-soft px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-fg/15" /><span className="size-2.5 rounded-full bg-fg/15" /><span className="size-2.5 rounded-full bg-fg/15" />
        <span className="mx-auto rounded-full bg-bg px-10 py-0.5 text-[11px] text-muted ring-1 ring-line">app.yourcompany.com</span>
      </div>
      <Image src={shot.src} alt={shot.alt} width={1800} height={1128} priority={priority} sizes="(min-width: 1280px) 1100px, 100vw" className="block h-auto w-full" />
      {fade && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />}
    </figure>
  );
}
