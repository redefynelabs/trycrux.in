import "server-only";

/** Why a call to the control plane did not succeed, in terms the form can show. */
export type Forwarded = { status: number; body: unknown };

/**
 * Forwards a JSON body to the control plane and returns its answer. The visitor's address is passed on so the control
 * plane can limit by address; the control plane trusts that header only from this site's network.
 */
export async function forward(path: string, body: unknown, ip: string): Promise<Forwarded> {
  const base = process.env.CONTROL_PLANE_URL;
  if (!base) {
    console.error("CONTROL_PLANE_URL is not set");
    return { status: 503, body: unavailable() };
  }
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(ip ? { "X-Forwarded-For": ip } : {}) },
      body: JSON.stringify(body),
      // A demo takes several seconds to start.
      signal: AbortSignal.timeout(150_000),
      cache: "no-store",
    });
    const text = await res.text();
    let parsed: unknown = {};
    try {
      parsed = text ? JSON.parse(text) : {};
    } catch {
      return { status: 502, body: unavailable() };
    }
    return { status: res.status, body: parsed };
  } catch (error) {
    console.error("control plane unreachable", error instanceof Error ? error.name : "error");
    return { status: 502, body: unavailable() };
  }
}

function unavailable() {
  return { error: { code: "unavailable", message: "We could not reach our systems just now. Please try again in a minute, or write to us." } };
}

/** The first address in X-Forwarded-For, else empty. */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for") ?? "";
  return xff.split(",")[0]?.trim() ?? "";
}
