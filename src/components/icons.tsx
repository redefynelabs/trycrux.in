import type { SVGProps } from "react";

// 24px outline icons, drawn here so the site loads no icon library.
function Icon({ d, ...rest }: Omit<SVGProps<SVGSVGElement>, "d"> & { d: string[] }) {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement>;
export const CheckIcon = (p: P) => <Icon {...p} strokeWidth="2.2" d={["M5 12.5l4.5 4.5L19 7.5"]} />;
export const PeopleIcon = (p: P) => <Icon {...p} d={["M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1", "M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z", "M21 20v-1a4 4 0 0 0-3-3.9", "M15.5 4.2a3.5 3.5 0 0 1 0 6.6"]} />;
export const ProjectsIcon = (p: P) => <Icon {...p} d={["M4 5h16v14H4z", "M9 5v14", "M14 5v14", "M4 10h16"]} />;
export const CrmIcon = (p: P) => <Icon {...p} d={["M3 17l6-6 4 4 8-8", "M15 7h6v6"]} />;
export const FinanceIcon = (p: P) => <Icon {...p} d={["M6 3h12v18l-3-2-3 2-3-2-3 2z", "M9 8h6", "M9 12h6"]} />;
export const CalendarIcon = (p: P) => <Icon {...p} d={["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4", "M8 14h3"]} />;
export const ClockIcon = (p: P) => <Icon {...p} d={["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"]} />;
export const DatabaseIcon = (p: P) => <Icon {...p} d={["M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z", "M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", "M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"]} />;
export const DownloadIcon = (p: P) => <Icon {...p} d={["M12 4v11", "M7 10l5 5 5-5", "M5 20h14"]} />;
export const LockIcon = (p: P) => <Icon {...p} d={["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"]} />;
export const ControlIcon = (p: P) => <Icon {...p} d={["M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z", "M9 12l2 2 4-4"]} />;
export const CloudIcon = (p: P) => <Icon {...p} d={["M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.75 4.75 0 0 1 .5 9.5z"]} />;
export const ServerIcon = (p: P) => <Icon {...p} d={["M4 4h16v6H4z", "M4 14h16v6H4z", "M8 7h.01", "M8 17h.01"]} />;
export const KeyIcon = (p: P) => <Icon {...p} d={["M15 9a4 4 0 1 1-8 0 4 4 0 0 1 8 0z", "M12 12l8 8", "M17 17l2-2", "M15 15l2-2"]} />;
export const SparkIcon = (p: P) => <Icon {...p} d={["M12 3v4", "M12 17v4", "M3 12h4", "M17 12h4", "M6 6l2.5 2.5", "M15.5 15.5L18 18", "M18 6l-2.5 2.5", "M8.5 15.5L6 18"]} />;
export const ArrowRightIcon = (p: P) => <Icon {...p} d={["M5 12h14", "M13 6l6 6-6 6"]} />;
export const LayersIcon = (p: P) => <Icon {...p} d={["M12 3l9 5-9 5-9-5z", "M3 13l9 5 9-5", "M3 17.5l9 5 9-5"]} />;
