"use client";

import type { ReactNode } from "react";
import { BlurFade } from "./magicui/blur-fade";

/** Fades a block in as it scrolls into view (Magic UI BlurFade). */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <BlurFade delay={delay} duration={0.6} offset={14} inView inViewMargin="-60px" className={className}>
      {children}
    </BlurFade>
  );
}
