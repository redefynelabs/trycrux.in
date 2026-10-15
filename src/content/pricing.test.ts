import { describe, expect, it } from "vitest";
import { CLOUD, RUNNING_COST, runningCost } from "./pricing";

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
