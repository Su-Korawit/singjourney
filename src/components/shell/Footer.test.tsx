/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the project credit", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Sing Journey",
    );
    expect(screen.getByText(/AI travel planning demo/)).toBeInTheDocument();
  });
});
