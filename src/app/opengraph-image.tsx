import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// The card shown when a link to the site is shared (and the default for every page).
export const alt = `${SITE.name}: ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [punta, mark] = await Promise.all([readFile(join(process.cwd(), "font/Punta - Light.otf")), readFile(join(process.cwd(), "public/logo/crux-mark.png"))]);
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "linear-gradient(160deg, #ffffff 0%, #eef3ff 55%, #dbe6ff 100%)", color: "#0a0a0a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={markSrc} width={72} height={72} alt="" />
          <div style={{ fontFamily: "Punta", fontSize: 64, letterSpacing: 1 }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: "Punta", fontSize: 76, lineHeight: 1.05, letterSpacing: 1, maxWidth: 980 }}>The only software your business needs.</div>
          <div style={{ fontSize: 30, color: "#4b5563", maxWidth: 1000 }}>The AI-powered business operating system: HR and payroll, projects, CRM, sales, inventory and finance in one system, with Mei, your AI assistant.</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#1d4ed8" }}>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#ffffff", border: "1px solid #c7d7fe" }}>Three plans, unlimited users</div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#ffffff", border: "1px solid #c7d7fe" }}>No per-user price</div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#ffffff", border: "1px solid #c7d7fe" }}>Live within 24 hours</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Punta", data: punta, style: "normal", weight: 400 }] },
  );
}
