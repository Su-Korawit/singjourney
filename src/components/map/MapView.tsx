"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { PlanStop } from "@/lib/types";

const SINGBURI: [number, number] = [100.4, 14.89];

export function MapView({ stops }: { stops: PlanStop[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: SINGBURI,
      zoom: 10,
    });
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const draw = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      stops.forEach((s, i) => {
        const marker = new maplibregl.Marker()
          .setLngLat([s.lng, s.lat])
          .setPopup(new maplibregl.Popup().setText(`${i + 1}. ${s.name}`))
          .addTo(map);
        markersRef.current.push(marker);
      });

      const line = {
        type: "FeatureCollection" as const,
        features: [
          {
            type: "Feature" as const,
            geometry: {
              type: "LineString" as const,
              coordinates: stops.map((s) => [s.lng, s.lat]),
            },
            properties: {},
          },
        ],
      };

      if (map.getSource("route")) {
        (map.getSource("route") as maplibregl.GeoJSONSource).setData(
          line as never,
        );
      } else {
        map.addSource("route", { type: "geojson", data: line as never });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: { "line-color": "#e07a2f", "line-width": 4 },
        });
      }
    };

    if (map.isStyleLoaded()) draw();
    else map.once("load", draw);
  }, [stops]);

  return <div ref={ref} className="h-[70vh] w-full rounded-lg" />;
}
