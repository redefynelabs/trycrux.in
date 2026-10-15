import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useRegion } from "../region";
import { C, pop } from "../theme";

type Money = ReturnType<typeof useRegion>;
import { AppWindow, Card, Headline, Pill, Scene } from "../ui";

const MODULES = [
  { name: "People & HR", stat: "48 people", note: "41 in today", tone: "ok" as const, colour: "#0ea5e9" },
  { name: "Projects & Tasks", stat: "12 projects", note: "86 open tasks", tone: "brand" as const, colour: "#8b5cf6" },
  { name: "CRM & Sales", stat: (r: Money) => `${r.short(1840000)} pipeline`, note: "6 quotes sent", tone: "warn" as const, colour: "#f97316" },
  { name: "Finance", stat: (r: Money) => `${r.short(1240000)} revenue`, note: "this quarter", tone: "ok" as const, colour: "#16a34a" },
];

/** 9–14 s: one window, every part of the company in it. */
export function OneSystem() {
  const frame = useCurrentFrame();
  const r = useRegion();
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 70, gap: 46 }}>
        <Headline text="One system for the whole business." size={74} />
        <AppWindow active="Dashboard" delay={8} height={720}>
          <div style={{ fontSize: 22, color: C.muted }}>Thursday 15 October</div>
          <div style={{ fontSize: 40, fontWeight: 600, marginTop: 6 }}>Good morning, Priya</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 34 }}>
            {MODULES.map((m, i) => {
              const t = pop(frame, 26 + i * 8);
              return (
                <Card key={m.name} style={{ padding: 30, opacity: t, transform: `translateY(${(1 - t) * 30}px)` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ width: 16, height: 16, borderRadius: 6, background: m.colour }} />
                    <span style={{ fontSize: 24, fontWeight: 600 }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 600, marginTop: 22, letterSpacing: -0.5 }}>{typeof m.stat === "string" ? m.stat : m.stat(r)}</div>
                  <Pill tone={m.tone} style={{ marginTop: 14 }}>{m.note}</Pill>
                </Card>
              );
            })}
          </div>
        </AppWindow>
      </AbsoluteFill>
    </Scene>
  );
}
