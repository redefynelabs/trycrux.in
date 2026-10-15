import { describe, expect, it } from "vitest";
import { contactSchema, demoSchema } from "./schemas";

describe("demo form schema", () => {
  it("accepts a name and an email and fills the rest", () => {
    const r = demoSchema.parse({ name: " Asha ", email: "asha@rao.example", phone: "+91 98765 43210" });
    expect(r).toMatchObject({ name: "Asha", phone: "+91 98765 43210", company: "", team_size: "", focus: "", website: "", attribution: {} });
  });

  it("refuses a missing name and a bad email, naming each field", () => {
    const r = demoSchema.safeParse({ name: "", email: "nope" });
    expect(r.success).toBe(false);
    expect(r.error?.issues.map((i) => i.path[0])).toEqual(expect.arrayContaining(["name", "email"]));
  });

  it("accepts only the team sizes and focuses the form offers", () => {
    expect(demoSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", team_size: "26-100", focus: "mei" }).success).toBe(true);
    expect(demoSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", team_size: "lots" }).success).toBe(false);
    expect(demoSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", focus: "everything" }).success).toBe(false);
  });

  it("refuses overlong values", () => {
    expect(demoSchema.safeParse({ name: "x".repeat(121), email: "a@b.example", phone: "+91 98765 43210" }).success).toBe(false);
  });
});

describe("phone number", () => {
  const base = { name: "A", email: "a@b.example" };
  it("is required on both forms", () => {
    expect(demoSchema.safeParse(base).success).toBe(false);
    expect(demoSchema.safeParse({ ...base, phone: "" }).error?.issues[0].message).toBe("Enter a contact number");
    expect(contactSchema.safeParse({ ...base, message: "hi" }).success).toBe(false);
  });

  it("must look like a phone number", () => {
    for (const bad of ["abc", "12", "+1 2", "98765-abcde", "1".repeat(20)]) expect(demoSchema.safeParse({ ...base, phone: bad }).success, bad).toBe(false);
    for (const good of ["+91 98765 43210", "098765 43210", "(020) 7946 0958", "+44 20 7946 0958"]) expect(demoSchema.safeParse({ ...base, phone: good }).success, good).toBe(true);
  });
});

describe("contact form schema", () => {
  it("needs a message and only known interests", () => {
    expect(contactSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", message: "" }).success).toBe(false);
    expect(contactSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", message: "hi", interest: "free" }).success).toBe(false);
    expect(contactSchema.parse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", message: "hi" }).interest).toBe("other");
    expect(contactSchema.safeParse({ name: "A", email: "a@b.example", phone: "+91 98765 43210", message: "hi", timeline: "someday" }).success).toBe(false);
  });
});
