"use client";

import { useEffect } from "react";
import { rememberAttribution } from "@/lib/client";

/** Renders nothing. Remembers the first page and campaign of the visit. */
export function AttributionCapture() {
  useEffect(() => {
    rememberAttribution();
  }, []);
  return null;
}
