import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { PhoneField, phoneValue } from "./phone-field";
import { contactSchema } from "@/lib/schemas";

function Harness() {
  const [v, setV] = useState("");
  return (
    <>
      <PhoneField label="Phone number" value={v} onChange={setV} />
      <output data-testid="out">{v}</output>
    </>
  );
}

describe("PhoneField", () => {
  it("adds the chosen country's code", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.selectOptions(screen.getByLabelText("Country code"), "GB");
    await user.type(screen.getByLabelText("Phone number"), "07911 123456");
    expect(screen.getByTestId("out")).toHaveTextContent("+4407911123456");
  });

  it("switches country when a full international number is typed", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByLabelText("Phone number"), "+1 415 555 2671");
    expect(screen.getByLabelText("Country code")).toHaveValue("US");
  });

  it("flags a number that does not exist in the country", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByLabelText("Phone number"), "12345");
    await user.tab();
    expect(await screen.findByRole("alert")).toHaveTextContent(/valid India phone number/);
  });

  it("builds the value", () => {
    expect(phoneValue("IN", "")).toBe("");
    expect(phoneValue("IN", "94123 70582")).toBe("+919412370582");
  });
});

describe("phone in the schema", () => {
  const base = { name: "Ravi", email: "ravi@kumar.in", message: "Price?", interest: "on_prem" };
  it("accepts real numbers and refuses impossible ones", () => {
    expect(contactSchema.safeParse({ ...base, phone: "+91 94123 70582" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, phone: "+1 415 555 2671" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...base, phone: "+91 12345" }).success).toBe(false);
  });
});
