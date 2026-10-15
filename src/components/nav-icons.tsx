import { ChartLineData01Icon, Invoice01Icon, KanbanIcon, SparklesIcon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// The same icon set as the ERP, so the menu shows what the product shows.
type Glyph = Parameters<typeof HugeiconsIcon>[0]["icon"];
const make = (icon: Glyph) =>
  function NavIcon({ className }: { className?: string }) {
    return <HugeiconsIcon icon={icon} size="1em" strokeWidth={1.7} className={className} aria-hidden="true" />;
  };

export const NavPeopleIcon = make(UserGroupIcon);
export const NavProjectsIcon = make(KanbanIcon);
export const NavCrmIcon = make(ChartLineData01Icon);
export const NavFinanceIcon = make(Invoice01Icon);
export const NavSparkIcon = make(SparklesIcon);
