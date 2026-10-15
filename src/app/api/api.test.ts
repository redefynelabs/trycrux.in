import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST as contact } from "./contact/route";
import { POST as demo } from "./demo/route";

const post = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://site.test/api/x", { method: "POST", headers: { "content-type": "application/json", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });

beforeEach(() => {
  process.env.CONTROL_PLANE_URL = "http://cp.test";
});
afterEach(() => vi.restoreAllMocks());

describe("the demo route", () => {
  it("forwards a valid request with the visitor's address, and returns the control plane's answer", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { url: "https://x.demo" } }), { status: 201 }));
    const res = await demo(post({ name: "Asha", email: "asha@rao.example", phone: "+91 98765 43210" }, { "x-forwarded-for": "198.51.100.9, 10.0.0.1" }));
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ data: { url: "https://x.demo" } });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("http://cp.test/v1/demo-requests");
    expect((init?.headers as Record<string, string>)["X-Forwarded-For"]).toBe("198.51.100.9");
  });

  it("answers an invalid request itself, without calling the control plane", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const res = await demo(post({ name: "", email: "bad" }));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error.fields).toMatchObject({ name: expect.any(String), email: expect.any(String) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a body that is not JSON", async () => {
    expect((await demo(post("{nope"))).status).toBe(400);
  });

  it("gives a friendly error when the control plane is down", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("connect ECONNREFUSED"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await demo(post({ name: "Asha", email: "asha@rao.example", phone: "+91 98765 43210" }));
    expect(res.status).toBe(502);
    expect((await res.json()).error.message).toMatch(/try again/i);
  });

  it("passes the control plane's limits through", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: { code: "rate_limited", message: "slow down" } }), { status: 429 }));
    const res = await demo(post({ name: "Asha", email: "asha@rao.example", phone: "+91 98765 43210" }));
    expect(res.status).toBe(429);
  });
});

describe("the contact route", () => {
  it("forwards the message", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ data: { status: "received" } }), { status: 201 }));
    const res = await contact(post({ name: "Ravi", email: "ravi@kumar.example", phone: "+91 98765 43210", message: "Price?", interest: "on_prem" }));
    expect(res.status).toBe(201);
    expect(fetchMock.mock.calls[0][0]).toBe("http://cp.test/v1/contact-requests");
  });

  it("needs a message", async () => {
    expect((await contact(post({ name: "Ravi", email: "ravi@kumar.example", message: "" }))).status).toBe(422);
  });
});
