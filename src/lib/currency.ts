/**
 * The visitor's region, which sets the currency of prices, the tax named next to them, and the money in the sample
 * screens. Each region has one currency, so the currency code is the region's key. The proxy (src/proxy.ts) sets
 * crux_currency from the visitor's country; a region picked in the header is kept in localStorage and wins over it.
 * Both hold only the currency, never the country.
 */

export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", locale: "en-IN", label: "Indian rupee", region: "India", short: "IN", tax: "GST", taxRate: 18, inrPer: 1 },
  USD: { code: "USD", symbol: "$", locale: "en-US", label: "US dollar", region: "United States", short: "US", tax: "sales tax", taxRate: 8, inrPer: 98 },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", label: "British pound", region: "United Kingdom", short: "UK", tax: "VAT", taxRate: 20, inrPer: 98 * 1.33 },
  EUR: { code: "EUR", symbol: "€", locale: "en-IE", label: "Euro", region: "Europe", short: "EU", tax: "VAT", taxRate: 20, inrPer: 98 * 1.16 },
  AED: { code: "AED", symbol: "AED", locale: "en-US", label: "UAE dirham", region: "United Arab Emirates", short: "AE", tax: "VAT", taxRate: 5, inrPer: 98 / 3.67 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;
export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];
/** Shown when the country is unknown (local development, or no header). */
export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export const CURRENCY_COOKIE = "crux_currency";
export const CURRENCY_KEY = "crux-currency";
const CHANGE_EVENT = "crux:currency-change";

/** Euro area countries; other EU countries also see euros, as the closest we offer. */
const EURO = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "MC", "SM", "VA", "AD", "ME", "XK",
];

/** The currency for a country (ISO 3166 code): India rupees, UK pounds, EU euros, UAE dirhams, everyone else dollars. */
export function currencyForCountry(country: string): CurrencyCode {
  const c = country.toUpperCase();
  if (c === "IN") return "INR";
  if (c === "GB" || c === "GG" || c === "JE" || c === "IM") return "GBP";
  if (c === "AE") return "AED";
  if (EURO.includes(c)) return "EUR";
  return "USD";
}

function isCode(v: unknown): v is CurrencyCode {
  return typeof v === "string" && v in CURRENCIES;
}

/** The currency in force: the one picked, else the one for the visitor's country, else the default. */
export function readCurrency(): CurrencyCode {
  try {
    const picked = localStorage.getItem(CURRENCY_KEY);
    if (isCode(picked)) return picked;
  } catch {
    // Storage blocked: fall back to the country.
  }
  const fromCountry = new RegExp(`(^|; )${CURRENCY_COOKIE}=([A-Z]{3})`).exec(document.cookie)?.[2];
  return isCode(fromCountry) ? fromCountry : DEFAULT_CURRENCY;
}

export function pickCurrency(c: CurrencyCode): void {
  try {
    localStorage.setItem(CURRENCY_KEY, c);
  } catch {
    // Storage blocked: the choice still applies until the page is left.
  }
  picked = c;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

let picked: CurrencyCode | null = null;

export function subscribeCurrency(cb: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

export function currencySnapshot(): CurrencyCode {
  return picked ?? readCurrency();
}

/** An amount with its currency sign: "₹84,200.00", "$859.18", "AED 3,154". */
export function formatMoney(n: number, c: CurrencyCode, decimals = 0): string {
  const cur = CURRENCIES[c];
  const num = n.toLocaleString(cur.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return `${cur.symbol}${cur.symbol.length > 1 ? " " : ""}${num}`;
}

/** A sample amount written in rupees, in the region's currency at the rates above (rounded to whole units). */
export function fromInr(inr: number, c: CurrencyCode): number {
  return Math.round(inr / CURRENCIES[c].inrPer);
}

/**
 * Fits sample text to the region. Sample amounts are written in rupees ("₹84,200.00", "₹18.4 lakh") and become the
 * region's money; {tax} and {Tax} name its tax, {rate} is its rate; {tax:87000} and {total:87000} are the tax on, and
 * the total with tax of, a rupee amount before tax.
 */
export function localize(text: string, c: CurrencyCode): string {
  const cur = CURRENCIES[c];
  // Converted amounts are whole units, so the sample invoice's lines still add up to its subtotal.
  const tax = (inr: number) => Math.round(fromInr(inr, c) * cur.taxRate) / 100;
  return text
    .replace(/\{tax:(\d+)\}/g, (_, n) => formatMoney(tax(+n), c, 2))
    .replace(/\{total:(\d+)\}/g, (_, n) => formatMoney(fromInr(+n, c) + tax(+n), c, 2))
    .replace(/\{tax\}/g, cur.tax)
    .replace(/\{Tax\}/g, cur.tax[0].toUpperCase() + cur.tax.slice(1))
    .replace(/\{rate\}/g, String(cur.taxRate))
    .replace(/₹([\d,]+(?:\.\d+)?) lakh/g, (_, n) => {
      if (c === "INR") return `₹${n} lakh`;
      const v = parseFloat(n.replace(/,/g, "")) * 100000;
      return `${cur.symbol}${cur.symbol.length > 1 ? " " : ""}${new Intl.NumberFormat(cur.locale, { notation: "compact", maximumFractionDigits: 1 }).format(v / cur.inrPer)}`;
    })
    .replace(/₹([\d,]+)(\.\d+)?/g, (_, n, dec) => {
      if (c === "INR") return `₹${n}${dec ?? ""}`;
      const v = parseFloat(n.replace(/,/g, "") + (dec ?? ""));
      return formatMoney(fromInr(v, c), c, dec ? 2 : 0);
    });
}
