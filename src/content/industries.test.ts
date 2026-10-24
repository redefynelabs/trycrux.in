import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "./industries";
import { PRODUCT_PAGES } from "./product";
// Written by the ERP (`UPDATE_TEMPLATES=1 go test ./internal/app/templates -run TestExport`): the starting templates.
import TEMPLATES from "./templates.json";

// The site's app names and record words, by the ERP's names for them.
const APPS: Record<string, string> = { CRM: "crm", "Projects & Tasks": "pms", "People & HR": "hr", Payroll: "payroll", Accounting: "accounting", "Inventory & Orders": "inventory" };
const WORDS: Record<string, string> = { Client: "client", Project: "project", Lead: "lead", Task: "task", Estimate: "quote", Order: "order" };

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

  it("match the ERP's template: edition, apps and words", () => {
    for (const i of INDUSTRIES) {
      for (const a of i.apps) expect(APPS[a], `${i.slug}: unknown app ${a}`).toBeTruthy();
      if (!i.template) continue;
      const t = TEMPLATES.find((x) => x.id === i.template);
      expect(t, `${i.slug}: no template ${i.template}`).toBeTruthy();
      expect(i.edition, i.slug).toBe(t!.edition);
      for (const a of i.apps) expect(t!.apps, `${i.slug}: ${a}`).toContain(APPS[a]);
      const labels = t!.labels as Record<string, { plural: string }>;
      for (const w of i.words ?? []) expect(labels[WORDS[w.generic]]?.plural, `${i.slug}: ${w.generic}`).toBe(w.used);
    }
  });
});
