import type { ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useRegion } from "../region";
import { C, pop, ramp } from "../theme";
import { Avatar, Card, Headline, Kicker, Pill, Scene } from "../ui";

const Q1 = "Who were our top clients this quarter?";
const Q2 = "Draft an invoice for Acme for October.";
const TOP = [
  { name: "Acme Builders", value: 480000, colour: "#f97316" },
  { name: "Granite Co", value: 310000, colour: "#8b5cf6" },
  { name: "Nova Retail", value: 220000, colour: "#0ea5e9" },
];

function typed(text: string, frame: number, from: number, cps = 1.4): string {
  return text.slice(0, Math.max(0, Math.floor((frame - from) * cps)));
}

function You({ children, at }: { children: ReactNode; at: number }) {
  const frame = useCurrentFrame();
  const t = pop(frame, at);
  return (
    <div style={{ alignSelf: "flex-end", maxWidth: 760, padding: "18px 26px", borderRadius: "26px 26px 8px 26px", background: C.brand, color: "#fff", fontSize: 26, opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>{children}</div>
  );
}

function MeiSays({ children, at }: { children: ReactNode; at: number }) {
  const frame = useCurrentFrame();
  const t = pop(frame, at);
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
      <div style={{ width: 48, height: 48, borderRadius: 99, background: `linear-gradient(135deg, ${C.brand}, #7c9cff)`, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>M</div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function Thinking({ from, to }: { from: number; to: number }) {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return (
    <div style={{ display: "flex", gap: 8, padding: "14px 4px 0 64px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 12, height: 12, borderRadius: 99, background: C.brand, opacity: 0.3 + 0.7 * Math.abs(Math.sin((frame - from) / 5 + i)) }} />
      ))}
    </div>
  );
}

/** 30–38 s: Mei answers from the company's own data, then drafts an invoice that waits for a person to confirm. */
export function Mei() {
  const frame = useCurrentFrame();
  const r = useRegion();
  const t = r.taxOn(100000);
  const max = TOP[0].value;
  // The first exchange slides up out of view to make room for the second.
  const scroll = interpolate(frame, [128, 150], [0, -300], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const confirm = frame >= 212;
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 80, gap: 22 }}>
        <Kicker>Mei, your AI assistant</Kicker>
        <Headline text="Ask your business anything." size={74} delay={4} />
        <Card style={{ width: 1180, height: 640, marginTop: 34, padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 30px", borderBottom: `1px solid ${C.line}` }}>
            <span style={{ fontSize: 23, fontWeight: 600 }}>Ask Mei</span>
            <Pill tone="muted" style={{ fontSize: 17 }}>Sees only what you can see</Pill>
          </div>
          <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, padding: "28px 30px", transform: `translateY(${scroll}px)` }}>
              <You at={12}>{typed(Q1, frame, 14)}</You>
              <Thinking from={44} to={58} />
              <MeiSays at={58}>
                <div style={{ fontSize: 24, marginTop: 10 }}>Your top three clients this quarter, by invoiced revenue:</div>
                <Card style={{ marginTop: 14, padding: "10px 24px", boxShadow: "none" }}>
                  {TOP.map((c, i) => {
                    const w = ramp(frame, 66 + i * 6, 20);
                    return (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderTop: i ? `1px solid ${C.line}` : "none" }}>
                        <Avatar name={c.name} colour={c.colour} size={36} />
                        <span style={{ width: 210, fontSize: 22, fontWeight: 600 }}>{c.name}</span>
                        <div style={{ flex: 1, height: 14, borderRadius: 99, background: C.soft }}>
                          <div style={{ width: `${(c.value / max) * 100 * w}%`, height: "100%", borderRadius: 99, background: C.brand }} />
                        </div>
                        <span style={{ width: 150, textAlign: "right", fontSize: 22, fontVariantNumeric: "tabular-nums" }}>{r.money(c.value * w)}</span>
                      </div>
                    );
                  })}
                </Card>
              </MeiSays>
              <You at={150}>{typed(Q2, frame, 152)}</You>
              <Thinking from={178} to={190} />
              <MeiSays at={190}>
                <div style={{ fontSize: 24, marginTop: 10 }}>Here is the draft. Nothing is created until you confirm.</div>
                <Card style={{ marginTop: 14, padding: 24, boxShadow: "none", display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 19, color: C.muted }}>Invoice draft</div>
                    <div style={{ fontSize: 26, fontWeight: 600, marginTop: 4 }}>Acme Builders · October services</div>
                    <div style={{ fontSize: 21, color: C.muted, marginTop: 4 }}>{`${t.base} + ${r.taxName} ${r.rate}% = ${t.total}`}</div>
                  </div>
                  <div style={{ padding: "14px 26px", borderRadius: 999, border: `1px solid ${C.line}`, fontSize: 21, fontWeight: 600, color: C.muted }}>Edit</div>
                  <div style={{ padding: "14px 30px", borderRadius: 999, fontSize: 21, fontWeight: 600, color: "#fff", background: confirm ? C.ok : C.brand, transform: `scale(${interpolate(frame, [208, 212, 218], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})` }}>{confirm ? "Draft created ✓" : "Confirm"}</div>
                </Card>
              </MeiSays>
            </div>
          </div>
        </Card>
      </AbsoluteFill>
    </Scene>
  );
}
