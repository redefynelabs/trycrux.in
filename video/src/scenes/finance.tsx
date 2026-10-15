import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useRegion } from "../region";
import { C, pop, ramp } from "../theme";
import { Card, Headline, Kicker, Pill, Scene, useCount } from "../ui";

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const REVENUE = [2.1, 2.4, 2.2, 2.9, 3.4, 3.1, 3.6, 3.9, 3.7, 4.2, 4.5, 4.8];

function Stat({ label, value, tone, delay }: { label: string; value: string; tone: "ok" | "bad" | "brand"; delay: number }) {
  const frame = useCurrentFrame();
  const t = pop(frame, delay);
  return (
    <Card style={{ padding: 28, flex: 1, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
      <div style={{ fontSize: 21, color: C.muted }}>{label}</div>
      <div style={{ fontSize: 50, fontWeight: 600, marginTop: 8, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <Pill tone={tone} style={{ marginTop: 10 }}>{tone === "bad" ? "↓ 4% vs last quarter" : "↑ 18% vs last quarter"}</Pill>
    </Card>
  );
}

/** 25–30 s: the month closes itself: revenue, expenses and profit that already add up. */
export function Finance() {
  const frame = useCurrentFrame();
  const r = useRegion();
  const revenue = useCount(1240000, 18, 36);
  const expenses = useCount(710000, 24, 36);
  const profit = useCount(530000, 30, 36);
  const max = Math.max(...REVENUE);
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 22 }}>
        <Kicker>Finance</Kicker>
        <Headline text="Close the month with numbers that already add up." size={66} delay={4} />
        <div style={{ display: "flex", gap: 28, marginTop: 46, width: 1500 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 470 }}>
            <Stat label="Revenue this quarter" value={r.money(revenue)} tone="ok" delay={14} />
            <Stat label="Expenses" value={r.money(expenses)} tone="bad" delay={20} />
            <Stat label="Profit" value={r.money(profit)} tone="ok" delay={26} />
          </div>
          <Card style={{ flex: 1, padding: 34, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 600 }}>Revenue by month</span>
              <Pill tone="brand">{r.taxName} included in every invoice</Pill>
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 18, marginTop: 30, borderBottom: `1px solid ${C.line}` }}>
              {REVENUE.map((r, i) => {
                const h = ramp(frame, 20 + i * 3, 22);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                    <div style={{ width: "100%", height: 420 * (r / max) * h, borderRadius: "12px 12px 4px 4px", background: i === REVENUE.length - 1 ? C.brand : "rgba(31,91,240,0.28)" }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
              {MONTHS.map((m) => (
                <span key={m} style={{ flex: 1, textAlign: "center", fontSize: 18, color: C.muted }}>{m}</span>
              ))}
            </div>
          </Card>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}
