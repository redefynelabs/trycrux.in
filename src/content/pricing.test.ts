import { describe, expect, it } from "vitest";
import { CURRENCY_CODES, currencyForCountry, localize, type CurrencyCode } from "@/lib/currency";
import { AMC, CLOUD, ON_PREM, PRICES, RUNNING_COST, money, runningCost } from "./pricing";

describe("cloud pricing", () => {
  it("leaves at least the target margin over what each plan costs us to run", () => {
    for (const t of CLOUD.tiers.filter((x) => x.perMonth)) {
      const cost = runningCost(t.id as keyof typeof RUNNING_COST.perPlan);
      const margin = (t.perMonth! - cost) / t.perMonth!;
      expect(margin, `${t.name}: price ${t.perMonth!}, cost ${cost}`).toBeGreaterThanOrEqual(RUNNING_COST.assumptions.targetMargin);
    }
  });

  it("still leaves a margin on the yearly price", () => {
    for (const t of CLOUD.tiers.filter((x) => x.perMonth)) {
      const yearly = t.perMonth! * (1 - CLOUD.annualDiscountPct / 100);
      expect((yearly - runningCost(t.id as keyof typeof RUNNING_COST.perPlan)) / yearly).toBeGreaterThanOrEqual(0.6);
    }
  });

  it("prices bigger plans higher", () => {
    const p = CLOUD.tiers.flatMap((t) => (t.perMonth ? [t.perMonth] : []));
    expect([...p].sort((a, b) => a - b)).toEqual(p);
  });
});

describe("prices in other currencies", () => {
  // INR per unit, as in the PRICES comment.
  const rate: Record<CurrencyCode, number> = { INR: 1, USD: 98, GBP: 98 * 1.33, EUR: 98 * 1.16, AED: 98 / 3.67 };
  const inrPrices = (c: CurrencyCode) => [...Object.values(PRICES[c].cloud), ...Object.values(PRICES[c].own), PRICES[c].amc];

  it("keeps the INR table equal to the plans", () => {
    for (const t of CLOUD.tiers) expect(PRICES.INR.cloud[t.id as "small"]).toBe(t.perMonth);
    for (const l of ON_PREM) expect(PRICES.INR.own[l.id as "term1"]).toBe(l.price);
    expect(PRICES.INR.amc).toBe(AMC.perYear);
  });

  it("stays within 15% of the INR price at the assumed rates", () => {
    const base = inrPrices("INR");
    for (const c of CURRENCY_CODES) {
      inrPrices(c).forEach((p, i) => {
        const diff = Math.abs(p * rate[c] - base[i]) / base[i];
        expect(diff, `${c} price ${p} against ₹${base[i]}`).toBeLessThanOrEqual(0.15);
      });
    }
  });

  it("formats each currency", () => {
    expect(money(2999, "INR")).toBe("₹2,999");
    expect(money(299999, "INR")).toBe("₹2,99,999");
    expect(money(2999, "USD")).toBe("$2,999");
    expect(money(109, "AED")).toBe("AED 109");
  });
});

describe("currency for a country", () => {
  it("maps the regions we price for and falls back to dollars", () => {
    expect(currencyForCountry("IN")).toBe("INR");
    expect(currencyForCountry("gb")).toBe("GBP");
    expect(currencyForCountry("DE")).toBe("EUR");
    expect(currencyForCountry("AE")).toBe("AED");
    expect(currencyForCountry("US")).toBe("USD");
    expect(currencyForCountry("SG")).toBe("USD");
  });
});

describe("sample text for a region", () => {
  it("keeps rupees in India and converts elsewhere", () => {
    expect(localize("owes ₹84,200.00", "INR")).toBe("owes ₹84,200.00");
    expect(localize("owes ₹84,200.00", "USD")).toBe("owes $859.00");
    expect(localize("Office chairs · ₹38,500", "GBP")).toBe("Office chairs · £295");
    expect(localize("₹18.4 lakh, up 12%", "INR")).toBe("₹18.4 lakh, up 12%");
    expect(localize("₹18.4 lakh, up 12%", "USD")).toBe("$18.8K, up 12%");
  });

  it("names the region's tax and works out the sample invoice", () => {
    expect(localize("{Tax} at {rate}%: {tax:87000}, total {total:87000}", "INR")).toBe("GST at 18%: ₹15,660.00, total ₹1,02,660.00");
    expect(localize("{Tax} at {rate}%: {tax:87000}, total {total:87000}", "AED")).toBe("VAT at 5%: AED 162.90, total AED 3,420.90");
    expect(localize("with {tax}", "USD")).toBe("with sales tax");
  });
});
