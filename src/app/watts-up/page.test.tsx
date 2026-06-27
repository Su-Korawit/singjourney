/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WattsUpPage from "./page";
import { TEMPLES } from "@/lib/data/temples";
import { placeById } from "@/lib/data/places";

describe("WattsUpPage", () => {
  it("renders every temple from content data with real images and collection", () => {
    render(<WattsUpPage />);

    expect(
      screen.getByText(
        /รวมวัดมงคล เรื่องเล่าพระเกจิ และของสะสมจากการเช็คอินจริงทั่วสิงห์บุรี/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "คลังของฉัน" })).toBeInTheDocument();

    for (const temple of TEMPLES) {
      const place = placeById(temple.place_id);
      expect(place).toBeDefined();
      expect(screen.getByRole("heading", { name: place!.name })).toBeInTheDocument();
      expect(screen.getByRole("img", { name: place!.name })).toHaveAttribute(
        "src",
        place!.image_url,
      );
      expect(screen.getByText(temple.history)).toBeInTheDocument();
      expect(screen.getByText(temple.famous_monk)).toBeInTheDocument();
      expect(screen.getByText(temple.merit_info)).toBeInTheDocument();
    }
  });
});
