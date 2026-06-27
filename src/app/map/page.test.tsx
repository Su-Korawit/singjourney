/** @vitest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MapPage from "./page";
import { PLACES } from "@/lib/data/places";
import type { PlanStop } from "@/lib/types";

vi.mock("@/components/map/MapView", () => ({
  MapView: ({ stops }: { stops: PlanStop[] }) => (
    <div data-testid="map-view">{stops.map((stop) => stop.name).join(", ")}</div>
  ),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [] }),
    }),
  }),
}));

describe("MapPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("seeds the roadmap from the first five real places with thumbnails", () => {
    render(<MapPage />);

    for (const place of PLACES.slice(0, 5)) {
      expect(screen.getAllByText(place.name).length).toBeGreaterThan(0);
      expect(screen.getByRole("img", { name: place.name })).toHaveAttribute(
        "src",
        place.image_url,
      );
    }
  });

  it("keeps using saved sj_stops when a plan has been selected", async () => {
    const savedStop = {
      place_id: "p6",
      name: "เส้นทางที่บันทึกไว้",
      reason: "จากแผนที่ผู้ใช้เลือก",
      suggested_time: "10:45",
      lat: 14.9355,
      lng: 100.262,
    };
    localStorage.setItem("sj_stops", JSON.stringify([savedStop]));

    render(<MapPage />);

    await waitFor(() => {
      expect(screen.getAllByText(savedStop.name).length).toBeGreaterThan(0);
    });
    expect(screen.getByRole("img", { name: savedStop.name })).toHaveAttribute(
      "src",
      "/images/places/p6.jpg",
    );
  });
});
