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

  it("sends the team size and what to see first", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { url: "https://a.b", login_email: "e", login_password: "p", expires_at: new Date(Date.now() + 3600_000).toISOString() } });
    render(<DemoForm />);
    await user.type(screen.getByLabelText("Your name"), "Asha");
    await user.type(screen.getByLabelText("Work email"), "asha@rao.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("radio", { name: "11 to 25" }));
    await user.click(screen.getByRole("radio", { name: /Finance/ }));
    await user.click(screen.getByRole("button", { name: "Start my demo" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(JSON.parse(spy.mock.calls[0][1]?.body as string)).toMatchObject({ team_size: "11-25", focus: "finance" });
    expect(await screen.findByText("Try these first")).toBeInTheDocument();
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
    // What happens next, and a way to book the call straight away.
    expect(screen.getByText(/we reply to ravi@kumar\.example/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book a time now/i })).toHaveAttribute("href", expect.stringContaining("cal.com"));
  });

  it("sends the team size and timeline the visitor chose, and fills the message from a starter", async () => {
    const user = userEvent.setup();
    const spy = reply(201, { data: { status: "received" } });
    render(<ContactForm />);
    await user.type(screen.getByLabelText("Your name"), "Ravi");
    await user.type(screen.getByLabelText("Work email"), "ravi@kumar.example");
    await user.type(screen.getByLabelText("Phone number"), "+91 98765 43210");
    await user.click(screen.getByRole("radio", { name: "26 to 100" }));
    await user.click(screen.getByRole("radio", { name: "Within a month" }));
    await user.click(screen.getByRole("button", { name: /price for my team size/ }));
    expect(screen.getByLabelText("Your message")).toHaveValue("I would like a price for my team size.");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    await waitFor(() => expect(spy).toHaveBeenCalled());
    const sent = JSON.parse(spy.mock.calls[0][1]?.body as string);
    expect(sent).toMatchObject({ team_size: "26-100", timeline: "month", interest: "cloud" });
  });

  it("starts on the interest the pricing page linked with", () => {
    render(<ContactForm defaultInterest="on_prem" />);
    expect(screen.getByRole("radio", { name: /Own server/ })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: /Cloud/ })).toHaveAttribute("aria-checked", "false");
  });
});
