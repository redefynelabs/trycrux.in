import type { CurrencyCode } from "@/lib/currency";
import { cn } from "@/lib/utils";

/** The twelve stars of the EU flag, on a circle around the middle. */
const STARS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * Math.PI) / 6;
  return [15 + 6 * Math.sin(a), 10 - 6 * Math.cos(a)].map((n) => Math.round(n * 100) / 100);
});

/** Small flags drawn inline (emoji flags do not show on Windows). 3:2, for the currency picker. */
const FLAGS: Record<CurrencyCode, React.ReactNode> = {
  INR: (
    <>
      <path fill="#FF9933" d="M0 0h30v6.67H0z" />
      <path fill="#fff" d="M0 6.67h30v6.66H0z" />
      <path fill="#138808" d="M0 13.33h30V20H0z" />
      <circle cx="15" cy="10" r="2.6" fill="none" stroke="#000080" strokeWidth="0.7" />
      <circle cx="15" cy="10" r="0.6" fill="#000080" />
    </>
  ),
  USD: (
    <>
      <path fill="#fff" d="M0 0h30v20H0z" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <path key={i} fill="#B22234" d={`M0 ${(i * 20) / 13}h30v${20 / 13}H0z`} />
      ))}
      <path fill="#3C3B6E" d="M0 0h12v10.77H0z" />
      {[[2, 2], [5, 2], [8, 2], [3.5, 4.5], [6.5, 4.5], [2, 7], [5, 7], [8, 7]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x + 1} cy={y + 0.5} r="0.55" fill="#fff" />
      ))}
    </>
  ),
  GBP: (
    <>
      <path fill="#012169" d="M0 0h30v20H0z" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="3.4" />
    </>
  ),
  EUR: (
    <>
      <path fill="#003399" d="M0 0h30v20H0z" />
      {STARS.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.85" fill="#FFCC00" />
      ))}
    </>
  ),
  AED: (
    <>
      <path fill="#00843D" d="M0 0h30v6.67H0z" />
      <path fill="#fff" d="M0 6.67h30v6.66H0z" />
      <path fill="#000" d="M0 13.33h30V20H0z" />
      <path fill="#EF3340" d="M0 0h7.5v20H0z" />
    </>
  ),
};

export function Flag({ currency, className }: { currency: CurrencyCode; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 30 20" className={cn("h-3.5 w-[1.3125rem] shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10", className)}>
      {FLAGS[currency]}
    </svg>
  );
}
