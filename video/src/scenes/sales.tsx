import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, inr, pop, ramp } from "../theme";
import { Card, Headline, Kicker, Pill, Scene } from "../ui";

function Doc({ kind, number, status, tone, delay, children }: { kind: string; number: string; status: ReactNode; tone: "brand" | "ok" | "warn" | "muted"; delay: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const t = pop(frame, delay);
  return (
    <Card style={{ width: 470, padding: 30, opacity: t, transform: `translateY(${(1 - t) * 40}px) scale(${0.95 + 0.05 * t})` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 20, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{kind}</span>
        <Pill tone={tone}>{status}</Pill>
      </div>
      <div style={{ fontSize: 40, fontWeight: 600, marginTop: 12 }}>{number}</div>
      <div style={{ fontSize: 21, color: C.muted, marginTop: 4 }}>Acme Builders</div>
      <div style={{ marginTop: 22, borderTop: `1px solid ${C.line}`, paddingTop: 18, fontSize: 21 }}>{children}</div>
    </Card>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontWeight: strong ? 600 : 400, color: strong ? C.fg : C.muted, fontSize: strong ? 24 : 21 }}>
      <span>{k}</span>
      <span style={{ color: C.fg }}>{v}</span>
    </div>
  );
}

function Arrow({ at }: { at: number }) {
  const frame = useCurrentFrame();
  const t = ramp(frame, at, 14);
  return (
    <svg width="90" height="40" viewBox="0 0 90 40" style={{ flexShrink: 0 }}>
      <line x1="6" y1="20" x2={6 + 70 * t} y2="20" stroke={C.brand} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 10" />
      <path d="M68 10l14 10-14 10" fill="none" stroke={C.brand} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity={t} />
    </svg>
  );
}

/** 19–25 s: an accepted quote becomes an order, and the delivered order writes its own invoice. */
export function Sales() {
  const frame = useCurrentFrame();
  return (
    <Scene>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 90, gap: 22 }}>
        <Kicker>CRM & Sales</Kicker>
        <Headline text="From quote to invoice, without retyping a line." size={70} delay={4} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 56 }}>
          <Doc kind="Quote" number="QT-0007" tone={frame > 52 ? "ok" : "brand"} status={frame > 52 ? "Accepted" : "Sent"} delay={14}>
            <Row k="Site survey & design" v={inr(40000)} />
            <Row k="Installation" v={inr(60000)} />
            <Row k="Total" v={inr(118000)} strong />
          </Doc>
          <Arrow at={56} />
          <Doc kind="Order" number="SO-0004" tone={frame > 100 ? "ok" : "brand"} status={frame > 100 ? "Fulfilled" : "Confirmed"} delay={62}>
            <Row k="From quote" v="QT-0007" />
            <Row k="Delivery" v="22 Oct" />
            <Row k="Total" v={inr(118000)} strong />
          </Doc>
          <Arrow at={104} />
          <Doc kind="Invoice" number="INV-0042" tone="warn" status="Draft, ready to send" delay={110}>
            <Row k="Taxable" v={inr(100000)} />
            <Row k="CGST 9% + SGST 9%" v={inr(18000)} />
            <Row k="Total" v={inr(118000)} strong />
          </Doc>
        </div>
      </AbsoluteFill>
    </Scene>
  );
}
