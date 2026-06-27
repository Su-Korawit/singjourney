import type { PlanStop } from "@/lib/types";

export interface RouteFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number][];
  };
  properties?: Record<string, unknown>;
}

/**
 * Returns route polyline coordinates from a GeoJSON LineString feature when
 * available (real road geometry), otherwise falls back to straight lines between
 * stops.
 */
export function buildRouteCoordinates(
  stops: PlanStop[],
  routeFeature: RouteFeature | null,
): [number, number][] {
  if (
    routeFeature?.geometry?.type === "LineString" &&
    Array.isArray(routeFeature.geometry.coordinates) &&
    routeFeature.geometry.coordinates.length > 1
  ) {
    return routeFeature.geometry.coordinates;
  }
  return stops.map((s) => [s.lng, s.lat]);
}
