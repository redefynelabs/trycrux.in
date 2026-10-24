import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";
import { DemoForm } from "./demo-form";

afterEach(() => vi.restoreAllMocks());

const reply = (status: number, body: unknown) => vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe("the demo form", () => {
  it("shows where to open the demo and the login once it is ready", async () => {
    const user = userEvent.setup();
    reply(201, { data: { url: "https://abc.demo.example.com", login_email: "admin@demo.test", login_password: "Demo-Password-2026!", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha Rao");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    expect(await screen.findByRole("link", { name: "Open your demo" })).toHaveAttribute("href", "https://abc.demo.example.com");
    expect(screen.getByText("admin@demo.test")).toBeInTheDocument();
    expect(screen.getByText(/ends in about/)).toBeInTheDocument();
  });

  it("tells a visitor they are in line, and where, when every demo room is busy", async () => {
    const user = userEvent.setup();
    reply(202, { data: { status: "queued", queued: true, position: 3 } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha Rao");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    expect(await screen.findByText("Place 3")).toBeInTheDocument();
    expect(screen.getByText("asha@rao.example")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open your demo" })).toBeNull();
  });

  it("asks for just a name, an email and a phone number", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { url: "https://a.b", login_email: "e", login_password: "p", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    expect(screen.getByRole("radio", { name: /Services edition/ })).toBeChecked();
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string)).toMatchObject({ name: "Asha", email: "asha@rao.example", modules: ["sales", "finance"], edition: "services" });
    expect(await screen.findByText("Try these first")).toBeInTheDocument();
  });

  it("sends the apps the visitor picked, with payroll bringing People & HR", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { url: "https://a.b", login_email: "e", login_password: "p", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "People and payroll" }));
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string).modules).toEqual(["people", "payroll"]);
    // Only the things to try for the picked apps, plus Mei.
    expect(await screen.findByRole("tab", { name: "Payroll" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Inventory" })).toBeNull();
    expect(screen.getByRole("tab", { name: "Mei AI" })).toBeInTheDocument();
  });

  it("sends one edition, dropping the other one's apps", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { url: "https://a.b", login_email: "e", login_password: "p", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("checkbox", { name: /^Projects/ }));
    await user.click(screen.getByRole("radio", { name: /Goods edition/ }));
    expect(screen.queryByRole("checkbox", { name: /^Projects/ })).toBeNull();
    await user.click(screen.getByRole("checkbox", { name: /^Inventory/ }));
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string)).toMatchObject({ modules: ["sales", "finance", "inventory"], edition: "goods" });
  });

  it("does not start a demo with no app picked", async () => {
    const user = userEvent.setup();
    const spy = reply(201, {});
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("checkbox", { name: /^CRM/ }));
    await user.click(screen.getByRole("checkbox", { name: /^Accounting/ }));
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose at least one app");
    expect(spy).not.toHaveBeenCalled();
  });

  it("shows field errors from the server beside the fields", async () => {
    const user = userEvent.setup();
    reply(422, { error: { code: "validation_failed", message: "Please check", fields: { email: "Enter a valid email address" } } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "x@y.z");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a valid email address");
  });

  it("explains a limit in words, and lets the visitor try again", async () => {
    const user = userEvent.setup();
    reply(429, { error: { code: "rate_limited", message: "You have asked for a demo recently." } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("asked for a demo recently");
    expect(screen.getByRole("button", { name: "Start my demo" })).toBeEnabled();
  });

  it("sends the honeypot empty and the attribution it remembered", async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("erp.attribution", JSON.stringify({ utm_source: "google", landing: "/pricing" }));
    const spy = reply(201, { data: { url: "https://a.b", login_email: "e", login_password: "p", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    const sent = JSON.parse(spy.mock.calls[0][1]?.body as string);
    expect(sent.website).toBe("");
    expect(sent.attribution).toEqual({ utm_source: "google", landing: "/pricing" });
  });
});

describe("the contact form", () => {
  it("thanks the visitor after sending", async () => {
    const user = userEvent.setup();
    reply(201, { data: { status: "received" } });
    render(<ContactForm />);
    await user.type(screen.getByLabelText("Your name"), "Ravi");
    await user.type(screen.getByLabelText("Work email"), "ravi@kumar.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.type(screen.getByLabelText("Your message"), "Price for 80 people?");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByText(/thank you, ravi\. we have your message/i)).toBeInTheDocument();
    expect(screen.getByText(/reply to ravi@kumar\.example within one working day/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a time now/i })).toHaveAttribute("href", expect.stringContaining("cal.com"));
  });

  it("sends the plan it was linked with and the message", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { status: "received" } });
    render(<ContactForm defaultPlan="grow" defaultMessage="I would like a lifetime licence." />);
    expect(screen.getByText(/looking at the Grow plan/)).toBeInTheDocument();
    await user.type(screen.getByLabelText("Your name"), "Ravi");
    await user.type(screen.getByLabelText("Work email"), "ravi@kumar.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    expect(screen.getByLabelText("Your message")).toHaveValue("I would like a lifetime licence.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string)).toMatchObject({ plan: "grow", interest: "on_prem", message: "I would like a lifetime licence." });
  });
});
