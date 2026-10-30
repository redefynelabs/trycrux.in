import { describe, expect, it } from "vitest";
import { fakeEmail, fakePhone } from "./fake";
import { demoSchema } from "./schemas";

describe("made-up contact details", () => {
  it("turns away placeholder and throwaway addresses", () => {
    for (const a of ["joe@company.com", "test@gmail.com", "x@mailinator.com", "aaaa@gmail.com", "a@b.test"]) expect(fakeEmail(a), a).not.toBe("");
    for (const a of ["asha@raotraders.in", "priya.nair@acme.co.uk", "ops@gmail.com"]) expect(fakeEmail(a), a).toBe("");
  });

  it("turns away numbers typed to get past the field", () => {
    for (const p of ["9876543210", "+91 98765 43210", "1234567890", "9999999999", "9898989898", "+1 (555) 555-5555"]) expect(fakePhone(p), p).toBe(true);
    for (const p of ["+91 94123 70582", "(020) 7946 0958", "+44 7700 900123"]) expect(fakePhone(p), p).toBe(false);
  });

  it("names both fields in the form's answer", () => {
    const out = demoSchema.safeParse({ name: "Joe", email: "joe@company.com", phone: "9876543210", modules: ["sales"] });
    expect(out.success).toBe(false);
    const fields = out.success ? [] : out.error.issues.map((i) => i.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["email", "phone"]));
  });
});
