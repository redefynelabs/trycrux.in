import { NextResponse, type NextRequest } from "next/server";
import { CONSENT_FIRST, REGION_COOKIE } from "@/lib/consent";
import { CURRENCY_COOKIE, currencyForCountry } from "@/lib/currency";

/**
 * Tells the page the currency to show prices in, and whether the visitor is in a region where optional cookies need consent first (the EU and EEA, the UK,
 * Switzerland), from the country Vercel detects. The cookies hold only a currency and "strict" or "open", never the country.
 */
/**
 * The visitor's country. The site sits behind Cloudflare, so Vercel sees Cloudflare's server (registered in the US) as
 * the visitor; Cloudflare's own header carries the real country and comes first. "XX" (unknown) and "T1" (Tor) count as
 * unknown.
 */
function visitorCountry(request: NextRequest): string | undefined {
  for (const h of ["cf-ipcountry", "x-vercel-ip-country"]) {
    const c = request.headers.get(h)?.toUpperCase();
    if (c && /^[A-Z]{2}$/.test(c) && c !== "XX" && c !== "T1") return c;
  }
  return undefined;
}

export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const country = visitorCountry(request);
  if (!country) return res;
  const region = CONSENT_FIRST.includes(country) ? "strict" : "open";
  const currency = currencyForCountry(country);
  const day = { path: "/", sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 } as const;
  if (request.cookies.get(REGION_COOKIE)?.value !== region) res.cookies.set(REGION_COOKIE, region, day);
  if (request.cookies.get(CURRENCY_COOKIE)?.value !== currency) res.cookies.set(CURRENCY_COOKIE, currency, day);
  return res;
}

export const config = {
  // Pages only: not the API, Next's files, the video or other files with an extension.
  matcher: ["/((?!api/|_next/|.*\\.[a-z0-9]+$).*)"],
};
