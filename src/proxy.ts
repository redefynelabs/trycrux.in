import { NextResponse, type NextRequest } from "next/server";
import { CONSENT_FIRST, REGION_COOKIE } from "@/lib/consent";
import { CURRENCY_COOKIE, currencyForCountry } from "@/lib/currency";

/**
 * Tells the page the currency to show prices in, and whether the visitor is in a region where optional cookies need consent first (the EU and EEA, the UK,
 * Switzerland), from the country Vercel detects. The cookies hold only a currency and "strict" or "open", never the country.
 */
export function proxy(request: NextRequest) {
  const res = NextResponse.next();
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();
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
