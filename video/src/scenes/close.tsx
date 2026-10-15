import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, UI, pop, ramp } from "../theme";
import { Headline, Logo, Scene } from "../ui";

const POINTS = ["Every feature, every plan", "No per-user price", "Live within 24 hours"];

/** 38–43 s: the promise, the three reasons and the address. Holds still at the end so the loop has a resting frame. */
export function Close() {
  const frame = useCurrentFrame();
  const logo = pop(frame, 0, 18);
  const url = ramp(frame, 60, 14);
  return (
    <Scene fadeOut={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 46 }}>
        <div style={{ opacity: logo, transform: `scale(${0.9 + 0.1 * logo})` }}>
          <Logo size={96} />
        </div>
        <Headline text="The only software your business needs." size={90} delay={10} />
        <div style={{ display: "flex", gap: 18 }}>
          {POINTS.map((p, i) => {
            const t = pop(frame, 34 + i * 6);
            return (
              <div key={p} style={{ padding: "16px 30px", borderRadius: 999, background: C.card, border: `1px solid #c9d6fd`, color: C.brand, fontFamily: UI, fontSize: 28, fontWeight: 600, opacity: t, transform: `translateY(${(1 - t) * 18}px)` }}>{p}</div>
            );
          })}
        </div>
        <div style={{ fontFamily: UI, fontSize: 34, fontWeight: 600, color: C.fg, opacity: url, letterSpacing: 0.5 }}>trycrux.in</div>
      </AbsoluteFill>
    </Scene>
  );
}
