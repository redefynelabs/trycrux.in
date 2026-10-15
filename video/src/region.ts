import { createContext, useContext } from "react";
import { CURRENCIES, formatMoney, fromInr, type CurrencyCode } from "../../src/lib/currency";

/**
 * The region a render is made for (the website's regions, keyed by currency). Sample amounts in the scenes are written
 * in rupees and shown in the region's money at the website's rates; the tax is the region's own.
 */
export const RegionContext = createContext<CurrencyCode>("INR");
export const REGIONS = Object.keys(CURRENCIES) as CurrencyCode[];

export function useRegion() {
  const c = useContext(RegionContext);
  const cur = CURRENCIES[c];
  const taxName = cur.tax[0].toUpperCase() + cur.tax.slice(1);
  return {
    code: c,
    /** A rupee sample amount in the region's money, whole units: "₹1,18,000", "$1,204". */
    money: (inr: number) => formatMoney(fromInr(inr, c), c),
    /** A large rupee amount, short: "₹18.4L", "$18.8K". */
    short: (inr: number) => {
      if (c === "INR") return `₹${Math.round(inr / 10000) / 10}L`;
      const n = new Intl.NumberFormat(cur.locale, { notation: "compact", maximumFractionDigits: 1 }).format(inr / cur.inrPer);
      return `${cur.symbol}${cur.symbol.length > 1 ? " " : ""}${n}`;
    },
    /** The tax on a rupee amount before tax, and the total, worked out on the converted amount so the figures add up. */
    taxOn: (inr: number) => {
      const base = fromInr(inr, c);
      const tax = Math.round((base * cur.taxRate) / 100);
      return { base: formatMoney(base, c), tax: formatMoney(tax, c), total: formatMoney(base + tax, c) };
    },
    /** How the tax line reads: India splits GST into CGST and SGST. */
    taxLine: c === "INR" ? "CGST 9% + SGST 9%" : `${taxName} ${cur.taxRate}%`,
    taxName: c === "INR" ? "GST" : taxName,
    rate: cur.taxRate,
  };
}
