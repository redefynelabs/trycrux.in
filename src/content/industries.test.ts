import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "./industries";
import { PRODUCT_PAGES } from "./product";

describe("industry and product pages", () => {
  it("link only to pages that exist", () => {
    const products = new Set(PRODUCT_PAGES.map((p) => p.slug));
    const industries = new Set(INDUSTRIES.map((i) => i.slug));
    for (const i of INDUSTRIES) for (const m of i.modules) expect(products.has(m), `${i.slug} -> ${m}`).toBe(true);
    for (const p of PRODUCT_PAGES) for (const s of p.industries) expect(industries.has(s), `${p.slug} -> ${s}`).toBe(true);
  });

  it("have unique slugs and a picture for every page that needs one", () => {
    expect(new Set(INDUSTRIES.map((i) => i.slug)).size).toBe(INDUSTRIES.length);
    expect(new Set(PRODUCT_PAGES.map((p) => p.slug)).size).toBe(PRODUCT_PAGES.length);
    for (const p of PRODUCT_PAGES) if (p.slug !== "mei-ai") expect(p.visual, p.slug).toBeTruthy();
  });
});
