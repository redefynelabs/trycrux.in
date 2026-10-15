import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, DISPLAY, UI, pop, ramp } from "../theme";
import { Scene } from "../ui";

/** 0–4 s: the mark lands, the name slides out of it, the promise appears. */
export function Intro() {
  const frame = useCurrentFrame();
  const mark = pop(frame, 4, 14);
  const name = ramp(frame, 22, 18);
  const tag = ramp(frame, 46, 16);
  const ring = interpolate(frame, [4, 40], [0.6, 1.8], { extrapolateRight: "clamp" });
  const ringO = interpolate(frame, [4, 40], [0.5, 0], { extrapolateRight: "clamp" });
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, position: "relative" }}>
          <div style={{ position: "relative", width: 190, height: 190 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 999, border: `4px solid ${C.brand}`, transform: `scale(${ring})`, opacity: ringO }} />
            <Img src={staticFile("crux-mark.png")} style={{ width: 190, height: 190, transform: `scale(${mark}) rotate(${(1 - mark) * -90}deg)` }} />
          </div>
          <div style={{ clipPath: `inset(-20% ${(1 - name) * 100}% -20% 0)` }}>
            <span style={{ display: "block", fontFamily: DISPLAY, fontWeight: 600, fontSize: 210, lineHeight: 1, letterSpacing: 2, color: C.fg, position: "relative", top: 28, transform: `translateX(${(1 - name) * -80}px)` }}>Crux</span>
          </div>
        </div>
        <div style={{ fontFamily: UI, fontSize: 40, color: C.muted, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)` }}>The AI-powered business operating system</div>
      </AbsoluteFill>
    </Scene>
  );
}
