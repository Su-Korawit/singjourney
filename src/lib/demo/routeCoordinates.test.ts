import { describe, it, expect } from "vitest";
import { buildRouteCoordinates } from "./routeCoordinates";
import type { PlanStop } from "@/lib/types";

const STOPS: PlanStop[] = [
  {
    place_id: "p1",
    name: "A",
    lat: 14.9,
    lng: 100.2,
    reason: "",
    suggested_time: "09:00",
  },
  {
    place_id: "p2",
    name: "B",
    lat: 14.95,
    lng: 100.25,
    reason: "",
    suggested_time: "10:00",
  },
];

const FILE_ROUTE = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [
      [100.2589, 14.9389],
      [100.2598, 14.942],
      [100.261, 14.9455],
      [100.2643, 14.9461],
      [100.263, 14.942],
      [100.2612, 14.935],
      [100.258, 14.929],
    ] as [number, number][],
  },
  properties: { name: "Singburi Roadmap Route" },
};

describe("buildRouteCoordinates", () => {
  it("returns file coordinates when routeFeature provided — more points than stops.length", () => {
    const coords = buildRouteCoordinates(STOPS, FILE_ROUTE);
    expect(coords.length).toBeGreaterThan(STOPS.length);
    expect(coords).toEqual(FILE_ROUTE.geometry.coordinates);
  });

  it("falls back to straight-line stop coords when routeFeature is null", () => {
    const coords = buildRouteCoordinates(STOPS, null);
    expect(coords).toEqual([
      [100.2, 14.9],
      [100.25, 14.95],
    ]);
  });

  it("falls back when routeFeature geometry has no coordinates", () => {
    const empty = {
      type: "Feature",
      geometry: { type: "LineString", coordinates: [] as [number, number][] },
      properties: {},
    };
    const coords = buildRouteCoordinates(STOPS, empty);
    expect(coords).toEqual(STOPS.map((s) => [s.lng, s.lat]));
  });
});
