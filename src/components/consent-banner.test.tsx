import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, REGION_COOKIE } from "@/lib/consent";
import { ConsentBanner, CookieSettingsLink } from "./consent-banner";

const gtag = vi.fn();

function region(value: string) {
  document.cookie = `${REGION_COOKIE}=${value}; path=/`;
}

beforeEach(() => {
  localStorage.clear();
  gtag.mockClear();
  window.gtag = gtag;
  window.dataLayer = [];
});

afterEach(() => {
  document.cookie = `${REGION_COOKIE}=; path=/; max-age=0`;
  delete window.gtag;
});

const saved = () => JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");
const lastUpdate = () => gtag.mock.calls.filter((c) => c[0] === "consent" && c[1] === "update").at(-1)?.[2];

describe("consent banner", () => {
  it("asks visitors where consent comes first, and Reject all keeps analytics off", async () => {
    region("strict");
    const user = userEvent.setup();
    render(<ConsentBanner />);
    expect(screen.getByRole("dialog", { name: /cookies on crux/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reject all" }));
    expect(saved()).toMatchObject({ analytics: false, recordings: false, v: 1 });
    expect(lastUpdate()).toMatchObject({ analytics_storage: "denied", ad_storage: "denied" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Accept all grants analytics and records the choice", async () => {
    region("strict");
    const user = userEvent.setup();
    render(<ConsentBanner />);
    await user.click(screen.getByRole("button", { name: "Accept all" }));
    expect(saved()).toMatchObject({ analytics: true, recordings: true });
    expect(lastUpdate()).toMatchObject({ analytics_storage: "granted", ad_storage: "denied" });
    expect(window.dataLayer).toContainEqual(expect.objectContaining({ event: "consent_update", consent_method: "accept_all" }));
  });

  it("does not interrupt visitors elsewhere, and Cookie settings lets them choose each kind", async () => {
    region("open");
    const user = userEvent.setup();
    render(
      <>
        <ConsentBanner />
        <CookieSettingsLink />
      </>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cookie settings" }));
    const recordings = screen.getByRole("checkbox", { name: /session recordings/i });
    expect(recordings).toBeChecked();
    await user.click(recordings);
    await user.click(screen.getByRole("button", { name: "Save my choices" }));
    expect(saved()).toMatchObject({ analytics: true, recordings: false });
  });

  it("does not ask again once a choice is saved", () => {
    region("strict");
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: false, recordings: false, at: new Date().toISOString(), v: 1 }));
    act(() => {
      render(<ConsentBanner />);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
