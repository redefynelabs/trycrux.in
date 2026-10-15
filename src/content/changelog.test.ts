import { describe, expect, it } from "vitest";
import { dayLabel, longDay, monthLabel, sortedEntries, type Entry } from "./changelog";

const e = (date: string): Entry => ({ date, area: "App", title: date, text: "", points: [] });

describe("changelog", () => {
  it("lists entries newest first and drops malformed dates", () => {
    expect(sortedEntries([e("2026-06-10"), e("2026-10-09"), e("nonsense"), e("2026-13-01"), e("2026-08-28")]).map((x) => x.date)).toEqual(["2026-10-09", "2026-08-28", "2026-06-10"]);
  });

  it("writes dates for people", () => {
    expect(dayLabel("2026-06-10")).toBe("Jun 10");
    expect(longDay("2026-06-03")).toBe("June 3, 2026");
    expect(monthLabel("2026-10-09")).toBe("October 2026");
  });
});
