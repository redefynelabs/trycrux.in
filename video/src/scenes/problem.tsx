import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, UI, pop } from "../theme";
import { Headline, Scene } from "../ui";

const TOOLS = [
  { label: "HR spreadsheet", colour: "#16a34a", x: -620, y: -160 },
  { label: "Attendance app", colour: "#0ea5e9", x: -560, y: 150 },
  { label: "Project board", colour: "#8b5cf6", x: -180, y: 270 },
  { label: "CRM", colour: "#f97316", x: 560, y: -170 },
  { label: "Invoicing tool", colour: "#ef4444", x: 600, y: 140 },
  { label: "Expense sheet", colour: "#eab308", x: 220, y: 280 },
];

/** 4–9 s: the pile of tools, then all of them pulled into one. */
export function Problem() {
  const frame = useCurrentFrame();
  // From frame 95 the tools are pulled to the centre and become the Crux mark.
  const pull = interpolate(frame, [92, 132], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const mark = pop(frame, 118, 16);
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <div style={{ opacity: 1 - pull }}>
          <Headline text="Five tools. Five logins." size={84} />
          <Headline text="And a lot of copy-and-paste." size={84} delay={14} style={{ color: C.muted }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: 120 }}>
        {TOOLS.map((t, i) => {
          const s = pop(frame, 20 + i * 6);
          const bob = Math.sin((frame + i * 20) / 18) * 8;
          const x = t.x * (1 - pull);
          const y = (t.y + bob) * (1 - pull);
          return (
            <div key={t.label} style={{ position: "absolute", transform: `translate(${x}px, ${y}px) scale(${s * (1 - pull * 0.7)}) rotate(${(i % 2 ? 4 : -4) * (1 - pull)}deg)`, opacity: s * (1 - pull) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 26px", borderRadius: 20, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 18px 44px -22px rgba(30,50,120,0.45)", fontFamily: UI, fontSize: 28, fontWeight: 600, color: C.fg }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: t.colour }} />
                {t.label}
              </div>
            </div>
          );
        })}
        <Img src={staticFile("crux-mark.png")} style={{ position: "absolute", width: 170, height: 170, transform: `scale(${mark})`, opacity: mark }} />
      </AbsoluteFill>
    </Scene>
  );
}
