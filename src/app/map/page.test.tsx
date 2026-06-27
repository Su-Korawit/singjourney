/** @vitest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import MapPage from "./page";
import { placeById } from "@/lib/data/places";
import { getShowcaseRoadmap } from "@/lib/demo/showcase";
import type { Item3D, PlanStop } from "@/lib/types";

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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("seeds the roadmap from showcase roadmap stops with thumbnails", () => {
    render(<MapPage />);

    for (const stop of getShowcaseRoadmap()) {
      expect(screen.getAllByText(stop.name).length).toBeGreaterThan(0);
      const place = placeById(stop.id);
      expect(screen.getByRole("img", { name: stop.name })).toHaveAttribute(
        "src",
        place?.image_url,
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

  it("saves newly awarded check-in items to the local collection", async () => {
    const item: Item3D = {
      id: "item-p1",
      name: "พระนอนจำลอง",
      type: "souvenir",
      model_url: "/models/p1.glb",
      place_id: "p1",
      is_consumable: false,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ awarded: true, item }),
      }),
    );

    render(<MapPage />);
    await userEvent.click(screen.getAllByRole("button", { name: "เช็คอิน" })[0]);

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("sj_items") ?? "[]")).toEqual([item]);
    });
  });
});
