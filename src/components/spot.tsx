"use client";

import type { ComponentProps } from "react";
import SpotlightCard from "./react-bits/SpotlightCard";

/** React Bits' SpotlightCard in the site's light colours. */
export function Spot({ className = "", ...props }: Omit<ComponentProps<typeof SpotlightCard>, "theme">) {
  return <SpotlightCard theme="light" spotlightColor="#4f6bff" intensity={0.1} spotlightSize={280} className={`rounded-3xl! p-6! ${className}`} {...props} />;
}
