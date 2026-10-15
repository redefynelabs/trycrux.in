import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, DISPLAY, UI, pop, ramp } from "./theme";

/** The page behind every scene: off-white with a faint grid and a blue glow, as on the website. */
export function Backdrop() {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 60) * 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.55,
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent 80%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 45% at ${50 + drift / 20}% 18%, rgba(31,91,240,0.16), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 40% 40% at 90% 100%, rgba(31,91,240,0.08), transparent 70%)" }} />
    </AbsoluteFill>
  );
}

/** A scene that fades and lifts in at its start and fades out at its end. */
export function Scene({ children, fadeOut = true }: { children: ReactNode; fadeOut?: boolean }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inn = ramp(frame, 0, 14);
  const out = fadeOut ? interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: inn * out, transform: `translateY(${(1 - inn) * 24}px) scale(${0.985 + 0.015 * out})` }}>{children}</AbsoluteFill>;
}

/** A small blue label above a headline. */
export function Kicker({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 12);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 6px 24px -12px rgba(30,50,120,0.35)", fontFamily: UI, fontSize: 24, fontWeight: 600, color: C.brand, letterSpacing: 1, textTransform: "uppercase", opacity: t, transform: `translateY(${(1 - t) * 10}px)` }}>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: C.brand }} />
      {children}
    </div>
  );
}

/** A headline in Punta whose words rise in one after another. */
export function Headline({ text, delay = 0, size = 76, style }: { text: string; delay?: number; size?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: size, lineHeight: 1.08, letterSpacing: 1, color: C.fg, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, ...style }}>
      {words.map((w, i) => {
        const t = ramp(frame, delay + i * 3, 14);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * 26}px)`, filter: `blur(${(1 - t) * 8}px)` }}>
            {w}
          </span>
        );
      })}
    </h1>
  );
}

/** A white card with the website's border and soft shadow. */
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 24, boxShadow: "0 24px 60px -28px rgba(30,50,120,0.35)", fontFamily: UI, color: C.fg, ...style }}>{children}</div>;
}

export function Pill({ children, tone = "brand", style }: { children: ReactNode; tone?: "brand" | "ok" | "warn" | "bad" | "muted"; style?: CSSProperties }) {
  const map = { brand: [C.brandSoft, C.brand], ok: [C.okSoft, C.ok], warn: [C.warnSoft, C.warn], bad: [C.badSoft, C.bad], muted: [C.soft, C.muted] } as const;
  const [bg, fg] = map[tone];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, background: bg, color: fg, fontSize: 20, fontWeight: 600, whiteSpace: "nowrap", ...style }}>{children}</span>;
}

/** The Crux mark and name, as in the site header. */
export function Logo({ size = 40, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28, ...style }}>
      <Img src={staticFile("crux-mark.png")} style={{ height: size * 0.95, width: size * 0.95 }} />
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: size, letterSpacing: size * 0.01, color: C.fg, position: "relative", top: size * 0.14, lineHeight: 1 }}>Crux</span>
    </div>
  );
}

/** A circle with initials, for people and clients. */
export function Avatar({ name, colour, size = 44 }: { name: string; colour: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return <div style={{ width: size, height: size, borderRadius: 99, background: colour, color: "#fff", display: "grid", placeItems: "center", fontSize: size * 0.38, fontWeight: 600, flexShrink: 0 }}>{initials}</div>;
}

/** The app window: a sidebar with the modules and a main area. `active` lights up one nav item. */
export function AppWindow({ children, active, delay = 0, width = 1440, height = 760, style }: { children: ReactNode; active?: string; delay?: number; width?: number; height?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const t = pop(frame, delay);
  const nav = ["Dashboard", "Mei AI", "People", "Attendance", "Projects", "Leads", "Quotes & orders", "Invoices", "Reports"];
  return (
    <div style={{ width, height, display: "flex", overflow: "hidden", borderRadius: 28, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 40px 100px -40px rgba(30,50,120,0.45)", fontFamily: UI, color: C.fg, opacity: t, transform: `translateY(${(1 - t) * 40}px) scale(${0.96 + 0.04 * t})`, ...style }}>
      <div style={{ width: 270, borderRight: `1px solid ${C.line}`, background: "#fcfdff", padding: "26px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
        <Logo size={32} style={{ marginBottom: 22, paddingLeft: 8 }} />
        {nav.map((n) => (
          <div key={n} style={{ padding: "11px 14px", borderRadius: 12, fontSize: 19, fontWeight: n === active ? 600 : 500, color: n === active ? C.brand : C.muted, background: n === active ? C.brandSoft : "transparent" }}>
            {n}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 36, position: "relative", background: C.bg }}>{children}</div>
    </div>
  );
}

/** A number counting up to `to` between `from` and `from + len` frames. */
export function useCount(to: number, from: number, len = 30): number {
  const frame = useCurrentFrame();
  return to * ramp(frame, from, len);
}
