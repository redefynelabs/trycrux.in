import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { ANNOUNCEMENT } from "@/content/announcement";
import { AnnouncementBar } from "./announcement-bar";

beforeEach(() => localStorage.clear());

describe("announcement bar", () => {
  it("shows the message with its link", () => {
    render(<AnnouncementBar />);
    // Twice on phones (it scrolls in a loop); the second copy is hidden from assistive tech.
    expect(screen.getAllByText(new RegExp(ANNOUNCEMENT!.text.slice(0, 20)))[0]).toBeInTheDocument();
    expect(screen.getByRole("link", { name: ANNOUNCEMENT!.cta })).toHaveAttribute("href", ANNOUNCEMENT!.href);
  });

  it("closes and stays closed for that message", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<AnnouncementBar />);
    await user.click(screen.getByRole("button", { name: "Close the announcement" }));
    expect(screen.queryByRole("region", { name: "Announcement" })).not.toBeInTheDocument();
    unmount();
    render(<AnnouncementBar />);
    expect(await screen.findByRole("region", { name: "Announcement" }).catch(() => null)).toBeNull();
  });
});
