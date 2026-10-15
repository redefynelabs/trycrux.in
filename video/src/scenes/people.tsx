import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, pop, ramp } from "../theme";
import { Avatar, Card, Headline, Kicker, Pill, Scene } from "../ui";

const ROSTER = [
  { name: "Ananya Rao", role: "Design", colour: "#0ea5e9", time: "09:02" },
  { name: "Rohan Verma", role: "Engineering", colour: "#8b5cf6", time: "09:11" },
  { name: "Sameer Khan", role: "Sales", colour: "#f97316", time: "09:41", late: true },
  { name: "Meera Iyer", role: "Finance", colour: "#16a34a", leave: true },
  { name: "Arjun Nair", role: "Support", colour: "#ef4444", time: "08:56" },
];

/** 14–19 s: who is in, who is late, and a leave request approved in one click. */
export function People() {
  const frame = useCurrentFrame();
  const leave = pop(frame, 60);
  const click = frame >= 100;
  const press = interpolate(frame, [96, 100, 106], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cursor = ramp(frame, 74, 22);
  const toast = pop(frame, 106);
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 80, gap: 22 }}>
        <Kicker>People & HR</Kicker>
        <Headline text="Everyone's day, in one place." size={72} delay={4} />
        <div style={{ display: "flex", gap: 32, marginTop: 34, alignItems: "flex-start" }}>
          <Card style={{ width: 860, padding: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 26, fontWeight: 600 }}>Today&rsquo;s roster</span>
              <Pill tone="ok">{`${ROSTER.filter((r, i) => r.time && frame > 24 + i * 9).length} checked in`}</Pill>
            </div>
            <div style={{ marginTop: 18 }}>
              {ROSTER.map((r, i) => {
                const t = pop(frame, 10 + i * 5);
                const on = frame > 24 + i * 9;
                return (
                  <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 4px", borderTop: i ? `1px solid ${C.line}` : "none", opacity: t, transform: `translateX(${(1 - t) * -24}px)` }}>
                    <Avatar name={r.name} colour={r.colour} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 23, fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: 19, color: C.muted }}>{r.role}</div>
                    </div>
                    {r.leave ? (
                      <Pill tone="muted">{click ? "On leave" : "Requested leave"}</Pill>
                    ) : on ? (
                      <Pill tone={r.late ? "warn" : "ok"}>{r.late ? `Late · ${r.time}` : `In · ${r.time}`}</Pill>
                    ) : (
                      <Pill tone="muted">Not in yet</Pill>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 520 }}>
            <Card style={{ padding: 30, opacity: leave, transform: `translateY(${(1 - leave) * 30}px)`, position: "relative" }}>
              <div style={{ fontSize: 19, color: C.muted }}>Leave request</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
                <Avatar name="Meera Iyer" colour="#16a34a" />
                <div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>Meera Iyer</div>
                  <div style={{ fontSize: 19, color: C.muted }}>Casual leave · 16–17 Oct · 2 days</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "14px 0", borderRadius: 999, border: `1px solid ${C.line}`, fontSize: 21, fontWeight: 600, color: C.muted }}>Decline</div>
                <div style={{ flex: 1, textAlign: "center", padding: "14px 0", borderRadius: 999, fontSize: 21, fontWeight: 600, color: "#fff", background: click ? C.ok : C.brand, transform: `scale(${press})` }}>{click ? "Approved ✓" : "Approve"}</div>
              </div>
              {/* The pointer travels to Approve and clicks it. */}
              <svg width="34" height="34" viewBox="0 0 24 24" style={{ position: "absolute", left: interpolate(cursor, [0, 1], [120, 370]), top: interpolate(cursor, [0, 1], [-60, 186]), opacity: frame > 72 && frame < 128 ? 1 : 0, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.25))" }}>
                <path d="M4 2l16 10-7 1.5L9.5 21z" fill="#0b0d12" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </Card>
            <Card style={{ padding: "20px 26px", display: "flex", alignItems: "center", gap: 14, opacity: toast, transform: `translateY(${(1 - toast) * 20}px)` }}>
              <span style={{ width: 34, height: 34, borderRadius: 99, background: C.okSoft, color: C.ok, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 20 }}>✓</span>
              <span style={{ fontSize: 21 }}>Leave approved. Meera&rsquo;s balance and the roster are updated.</span>
            </Card>
          </div>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}
