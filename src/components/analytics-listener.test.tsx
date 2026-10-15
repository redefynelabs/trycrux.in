import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { AnalyticsListener } from "./analytics-listener";

afterEach(() => {
  window.dataLayer = [];
});

const events = () => (window.dataLayer ?? []).map((e) => e as Record<string, unknown>);

function Page() {
  return (
    <>
      <AnalyticsListener />
      <header>
        <a href="/changelog">Changelog</a>
      </header>
      <section aria-labelledby="hero">
        <a href="/demo" onClick={(e) => e.preventDefault()}>Start a free demo</a>
        <a href="https://example.org/x" onClick={(e) => e.preventDefault()}>Elsewhere</a>
        <a href="mailto:hello@trycrux.in" onClick={(e) => e.preventDefault()}>Email us</a>
        <button type="button" data-track="ask_ai_click" data-track-assistant="Claude">Ask Claude</button>
        <button type="button">Untracked</button>
        <details>
          <summary>Is there a per-user price?</summary>
          No.
        </details>
      </section>
    </>
  );
}

describe("analytics listener", () => {
  it("sends cta, outbound, email and named events with where they were clicked", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByText("Start a free demo"));
    await user.click(screen.getByText("Elsewhere"));
    await user.click(screen.getByText("Email us"));
    await user.click(screen.getByText("Ask Claude"));
    await user.click(screen.getByText("Untracked"));

    expect(events()).toEqual([
      expect.objectContaining({ event: "cta_click", cta: "start_demo", cta_text: "Start a free demo", cta_location: "hero", link_url: "/demo" }),
      expect.objectContaining({ event: "outbound_click", link_domain: "example.org" }),
      expect.objectContaining({ event: "email_click", cta_text: "Email us" }),
      expect.objectContaining({ event: "ask_ai_click", assistant: "Claude", cta_location: "hero" }),
    ]);
  });

  it("sends nav clicks from the header and FAQ opens", async () => {
    const user = userEvent.setup();
    render(<Page />);
    screen.getByText("Changelog").addEventListener("click", (e) => e.preventDefault());
    await user.click(screen.getByText("Changelog"));
    await user.click(screen.getByText("Is there a per-user price?"));
    // jsdom fires toggle asynchronously.
    await new Promise((r) => setTimeout(r, 10));

    expect(events()).toEqual([
      expect.objectContaining({ event: "nav_click", cta_location: "header", link_url: "/changelog" }),
      expect.objectContaining({ event: "faq_open", faq_question: "Is there a per-user price?" }),
    ]);
  });
});
