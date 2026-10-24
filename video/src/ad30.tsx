import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, DISPLAY, UI, pop, ramp } from "./theme";
import { Backdrop, Card, Headline, Kicker, Logo, Pill, Scene } from "./ui";

/**
 * The 30 second vertical ad (1080x1920, for Reels, Stories and the feed). Content stays inside the platforms' safe
 * zones: about 200 px clear at the top and 300 px at the bottom. All names and figures are invented sample data.
 */

const PAD = 80;

/** 0-3 s: the question. */
function Hook() {
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56, padding: `0 ${PAD}px` }}>
        <Kicker>For UAE business owners</Kicker>
        <Headline text="Still running your business on chats and spreadsheets?" size={104} delay={6} />
      </AbsoluteFill>
    </Scene>
  );
}

const MESSAGES = [
  { who: "Meera", text: "Sick today, can't come in", colour: "#16a34a" },
  { who: "Arjun", text: "Can I leave early on Friday?", colour: "#0ea5e9" },
  { who: "Accounts", text: "Which invoices are overdue?", colour: "#ef4444" },
  { who: "Sameer", text: "Is the 24th a holiday??", colour: "#8b5cf6" },
  { who: "Priya", text: "Where do I send my timesheet?", colour: "#f97316" },
];

/** 3-9 s: the messages pile up. */
function Pain() {
  const frame = useCurrentFrame();
  const count = Math.round(2 + ramp(frame, 20, 120) * 16);
  return (
    <Scene>
      <AbsoluteFill style={{ padding: `210px ${PAD}px 0`, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 56 }}>
          <Headline text="Monday, 8:41 am." size={92} />
          <Pill tone="bad" style={{ fontFamily: UI, fontSize: 34, padding: "10px 24px", opacity: ramp(frame, 20, 10) }}>{count} new</Pill>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 44, width: "100%" }}>
          {MESSAGES.map((m, i) => {
            const t = pop(frame, 18 + i * 22);
            return (
              <Card key={m.who} style={{ display: "flex", alignItems: "center", gap: 28, padding: "40px 40px", opacity: t, transform: `translateY(${(1 - t) * 60}px) scale(${0.94 + 0.06 * t})` }}>
                <div style={{ width: 76, height: 76, borderRadius: 99, background: m.colour, color: "#fff", display: "grid", placeItems: "center", fontSize: 32, fontWeight: 600 }}>{m.who[0]}</div>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 600, color: C.muted }}>{m.who}</div>
                  <div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1.2 }}>{m.text}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

const TOOLS = [
  { label: "HR sheet", colour: "#16a34a", x: -300, y: -420 },
  { label: "Chat group", colour: "#0ea5e9", x: 280, y: -330 },
  { label: "Task list", colour: "#8b5cf6", x: -330, y: -120 },
  { label: "Quotes file", colour: "#f97316", x: 300, y: -40 },
  { label: "Invoice tool", colour: "#ef4444", x: -260, y: 200 },
  { label: "Expense sheet", colour: "#eab308", x: 280, y: 260 },
];

/** 9-14 s: the tools are pulled into one mark, then the promise. */
function Reveal() {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) });
  const mark = pop(frame, 62, 16);
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", top: -120 }}>
        {TOOLS.map((t, i) => {
          const s = pop(frame, 2 + i * 4);
          const bob = Math.sin((frame + i * 20) / 16) * 10;
          return (
            <div key={t.label} style={{ position: "absolute", transform: `translate(${t.x * (1 - pull)}px, ${(t.y + bob) * (1 - pull)}px) scale(${s * (1 - pull * 0.7)}) rotate(${(i % 2 ? 4 : -4) * (1 - pull)}deg)`, opacity: s * (1 - pull) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 32px", borderRadius: 24, background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 18px 44px -22px rgba(30,50,120,0.45)", fontFamily: UI, fontSize: 38, fontWeight: 600 }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: t.colour }} />
                {t.label}
              </div>
            </div>
          );
        })}
        <Img src={staticFile("crux-mark.png")} style={{ position: "absolute", width: 240, height: 240, transform: `scale(${mark})`, opacity: mark }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 380, padding: `0 ${PAD}px 380px` }}>
        <div style={{ opacity: ramp(frame, 84, 12) }}>
          <Headline text="One system for the whole business." size={96} delay={84} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

const MODULES = [
  { dot: "#0ea5e9", name: "People & HR", big: "48 people", pill: "41 in today", tone: "ok" as const },
  { dot: "#8b5cf6", name: "Projects & Tasks", big: "12 projects", pill: "86 open tasks", tone: "brand" as const },
  { dot: "#f97316", name: "CRM & Sales", big: "AED 68.9K pipeline", pill: "6 quotes sent", tone: "warn" as const },
  { dot: "#16a34a", name: "Finance", big: "AED 46.4K revenue", pill: "this quarter", tone: "ok" as const },
];

/** 14-22 s: the four modules stack up. */
function Modules() {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <AbsoluteFill style={{ padding: `200px ${PAD}px 0`, alignItems: "center", gap: 40 }}>
        <Headline text="People. Projects. Sales. Finance." size={80} />
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
          {MODULES.map((m, i) => {
            const t = pop(frame, 14 + i * 26);
            return (
              <Card key={m.name} style={{ padding: "34px 44px", opacity: t, transform: `translateX(${(1 - t) * 120}px)` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 600 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 99, background: m.dot }} />
                  {m.name}
                </div>
                <div style={{ fontFamily: UI, fontSize: 70, fontWeight: 600, margin: "14px 0 18px", letterSpacing: -1 }}>{m.big}</div>
                <Pill tone={m.tone} style={{ fontFamily: UI, fontSize: 28, padding: "8px 20px" }}>{m.pill}</Pill>
              </Card>
            );
          })}
        </div>
        <div style={{ fontFamily: UI, fontSize: 24, color: C.muted, opacity: ramp(frame, 120, 12) }}>Sample data</div>
      </AbsoluteFill>
    </Scene>
  );
}

const OVERDUE = [
  { name: "Granite Builders", amount: "AED 5,700", late: "18 days late", tone: "bad" as const },
  { name: "Nova Interiors", amount: "AED 2,750", late: "6 days late", tone: "warn" as const },
  { name: "Al Noor Trading", amount: "AED 1,640", late: "3 days late", tone: "warn" as const },
];

/** 22-26 s: Mei answers a question. */
function Mei() {
  const frame = useCurrentFrame();
  const ask = pop(frame, 4);
  const answer = pop(frame, 30);
  return (
    <Scene>
      <AbsoluteFill style={{ padding: `210px ${PAD}px 0`, alignItems: "center", gap: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, alignSelf: "flex-start" }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: C.brand, display: "grid", placeItems: "center", color: "#fff", fontSize: 40 }}>✦</div>
          <div style={{ fontFamily: UI }}>
            <div style={{ fontSize: 44, fontWeight: 600 }}>Mei</div>
            <div style={{ fontSize: 26, color: C.muted }}>Your AI assistant in Crux</div>
          </div>
        </div>
        <div style={{ alignSelf: "flex-end", padding: "28px 40px", borderRadius: 32, background: C.brand, color: "#fff", fontFamily: UI, fontSize: 42, fontWeight: 500, opacity: ask, transform: `translateY(${(1 - ask) * 30}px)` }}>Which invoices are overdue?</div>
        <Card style={{ width: "100%", padding: 48, opacity: answer, transform: `translateY(${(1 - answer) * 40}px)` }}>
          <div style={{ fontSize: 28, fontWeight: 600, color: C.brand, letterSpacing: 2, marginBottom: 22 }}>CHASE THESE FIRST</div>
          {OVERDUE.map((o, i) => {
            const t = ramp(frame, 44 + i * 12, 12);
            return (
              <div key={o.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "34px 0", borderTop: i ? `1px solid ${C.line}` : "none", opacity: t }}>
                <div>
                  <div style={{ fontSize: 40, fontWeight: 600 }}>{o.name}</div>
                  <div style={{ fontSize: 30, color: C.muted }}>{o.amount} outstanding</div>
                </div>
                <Pill tone={o.tone} style={{ fontFamily: UI, fontSize: 28, padding: "8px 20px" }}>{o.late}</Pill>
              </div>
            );
          })}
          <div style={{ marginTop: 18, fontSize: 32, color: C.muted, opacity: ramp(frame, 84, 12) }}>
            Draft reminders for all three? <span style={{ color: C.brand, fontWeight: 600 }}>Yes →</span>
          </div>
        </Card>
        <div style={{ fontFamily: UI, fontSize: 24, color: C.muted, opacity: ramp(frame, 90, 12) }}>Sample data</div>
      </AbsoluteFill>
    </Scene>
  );
}

/** 26-30 s: the offer and the address. Holds still at the end. */
function Cta() {
  const frame = useCurrentFrame();
  const btn = pop(frame, 44, 16);
  return (
    <Scene fadeOut={false}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 50, padding: `0 ${PAD}px 80px` }}>
        <div style={{ opacity: pop(frame, 0, 18) }}>
          <Logo size={120} />
        </div>
        <Headline text="See Crux in 60 minutes." size={112} delay={8} />
        <div style={{ fontFamily: UI, fontSize: 42, color: C.muted, textAlign: "center", opacity: ramp(frame, 30, 14) }}>Your own private demo. Free, no card.</div>
        <div style={{ padding: "34px 64px", borderRadius: 999, background: C.brand, color: "#fff", fontFamily: UI, fontSize: 48, fontWeight: 600, opacity: btn, transform: `scale(${0.9 + 0.1 * btn})`, boxShadow: "0 24px 60px -24px rgba(31,91,240,0.7)" }}>Start a free demo →</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 56, color: C.fg, letterSpacing: 1, opacity: ramp(frame, 62, 14) }}>trycrux.in</div>
      </AbsoluteFill>
    </Scene>
  );
}

/** The scenes in order. Neighbours overlap by OVERLAP frames so one fades into the next; the total is 900 frames = 30 s. */
const SCENES = [
  { id: "hook", C: Hook, frames: 100 },
  { id: "pain", C: Pain, frames: 190 },
  { id: "reveal", C: Reveal, frames: 160 },
  { id: "modules", C: Modules, frames: 250 },
  { id: "mei", C: Mei, frames: 130 },
  { id: "cta", C: Cta, frames: 120 },
];
const OVERLAP = 10;
export const AD30_FRAMES = SCENES.reduce((n, s) => n + s.frames, 0) - OVERLAP * (SCENES.length - 1);

export function Ad30() {
  let at = 0;
  return (
    <AbsoluteFill>
      <Backdrop />
      {SCENES.map(({ id, C: Scn, frames }) => {
        const from = at;
        at += frames - OVERLAP;
        return (
          <Sequence key={id} name={id} from={from} durationInFrames={frames}>
            <Scn />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
