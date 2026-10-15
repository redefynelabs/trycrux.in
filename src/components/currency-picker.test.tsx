import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CURRENCY_COOKIE, CURRENCY_KEY } from "@/lib/currency";
import { CurrencyPicker } from "./currency-picker";
import { PricingTabs } from "./pricing-tabs";

beforeEach(() => localStorage.clear());
afterEach(() => {
  document.cookie = `${CURRENCY_COOKIE}=; path=/; max-age=0`;
});

describe("currency", () => {
  it("shows prices for the visitor's region", () => {
    document.cookie = `${CURRENCY_COOKIE}=GBP; path=/`;
    render(<><CurrencyPicker /><PricingTabs showExtras={false} /></>);
    expect(screen.getByRole("button", { name: /region: united kingdom/i })).toBeInTheDocument();
    expect(screen.getAllByText("£").length).toBeGreaterThan(0);
  });

  it("lets the visitor pick another region, and remembers it over the detected one", async () => {
    document.cookie = `${CURRENCY_COOKIE}=USD; path=/`;
    const user = userEvent.setup();
    render(<><CurrencyPicker /><PricingTabs showExtras={false} /></>);
    await user.click(screen.getByRole("button", { name: /region: united states/i }));
    await user.click(screen.getByRole("button", { name: /united arab emirates/i }));
    expect(localStorage.getItem(CURRENCY_KEY)).toBe("AED");
    expect(screen.getAllByText("AED").length).toBeGreaterThan(0);
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  });
});
