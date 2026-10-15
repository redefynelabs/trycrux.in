import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function visit(headers: Record<string, string>) {
  const res = proxy(new NextRequest("https://trycrux.in/", { headers }));
  return { currency: res.cookies.get("crux_currency")?.value, region: res.cookies.get("crux_region")?.value };
}

describe("proxy", () => {
  it("trusts Cloudflare's country over Vercel's, which sees Cloudflare's US servers", () => {
    expect(visit({ "cf-ipcountry": "IN", "x-vercel-ip-country": "US" })).toEqual({ currency: "INR", region: "open" });
    expect(visit({ "cf-ipcountry": "DE", "x-vercel-ip-country": "US" })).toEqual({ currency: "EUR", region: "strict" });
  });

  it("falls back to Vercel's country, and sets nothing when the country is unknown", () => {
    expect(visit({ "x-vercel-ip-country": "GB" })).toEqual({ currency: "GBP", region: "strict" });
    expect(visit({ "cf-ipcountry": "XX" })).toEqual({ currency: undefined, region: undefined });
  });
});
