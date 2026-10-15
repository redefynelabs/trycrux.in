import Link from "next/link";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Magic UI's ShimmerButton, as a link (a button inside a link is invalid HTML). */
export function ShimmerLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      style={{ "--spread": "90deg", "--shimmer-color": "#ffffff", "--radius": "100px", "--speed": "3s", "--cut": "0.05em", "--bg": "oklch(0.546 0.215 262.9)" } as CSSProperties}
      className={cn(
        "group relative z-0 inline-flex h-12 items-center justify-center gap-2 overflow-hidden px-7 text-base font-medium whitespace-nowrap text-white [border-radius:var(--radius)] [background:var(--bg)]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className,
      )}
      {...props}
    >
      <div className="@container-[size] absolute inset-0 -z-30 overflow-visible blur-[2px]">
        <div className="animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>
      {children}
      <div className="absolute inset-0 size-full rounded-2xl shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]" />
      <div className="absolute inset-(--cut) -z-20 [background:var(--bg)] [border-radius:var(--radius)]" />
    </Link>
  );
}
