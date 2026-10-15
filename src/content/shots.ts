import type { ShotData } from "@/components/shot";
import { MEI_SHOTS } from "@/content/mei";

/** Screenshots of the running product (the demo company). Only the main screens are kept; regenerate them when the interface changes. */
export const SHOTS = {
  dashboard: { src: "/shots/dashboard.jpg", alt: "The dashboard: revenue, expenses, profit and overdue receivables, today's attendance, tasks and the lead pipeline" },
  mei: MEI_SHOTS.attendance,
} satisfies Record<string, ShotData>;
