/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the wordmark and primary navigation links", () => {
    render(<Header />);

    expect(
      screen.getByRole("link", { name: "Sing Journey" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "หน้าแรก" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "วางแผน" })).toHaveAttribute(
      "href",
      "/plan",
    );
    expect(screen.getByRole("link", { name: "Roadmap" })).toHaveAttribute(
      "href",
      "/map",
    );
    expect(screen.getByRole("link", { name: "Watt's Up!" })).toHaveAttribute(
      "href",
      "/watts-up",
    );
  });

  it("toggles the mobile menu from the hamburger button", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const menuButton = screen.getByRole("button", { name: "เปิดเมนู" });
    const mobileMenu = screen.getByTestId("mobile-navigation");

    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(mobileMenu).toHaveAttribute("hidden");

    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileMenu).not.toHaveAttribute("hidden");
  });
});
