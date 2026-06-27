"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { placeById } from "@/lib/data/places";
import type { PlanStop } from "@/lib/types";

const SINGBURI: [number, number] = [100.4, 14.89];
const CLAY = "#9C3B2E";
const CLAY_DEEP = "#5C2A1E";

type MapViewProps = {
  stops: PlanStop[];
  onCheckIn?: (placeId: string) => void;
  checkingInPlaceId?: string | null;
  rewardPlaceIds?: string[];
};

function createMarkerElement(index: number, hasCheckIn: boolean) {
  const element = document.createElement("div");
  element.className = hasCheckIn
    ? "roadmap-marker roadmap-marker--checkin"
    : "roadmap-marker";
  element.setAttribute("aria-label", `Roadmap stop ${index + 1}`);

  const label = document.createElement("span");
  label.textContent = String(index + 1);
  element.appendChild(label);

  return element;
}

function createPopupContent({
  stop,
  index,
  onCheckIn,
  checkingIn,
}: {
  stop: PlanStop;
  index: number;
  onCheckIn?: (placeId: string) => void;
  checkingIn: boolean;
}) {
  const content = document.createElement("div");
  content.className = "roadmap-popup";
  const place = placeById(stop.place_id);

  if (place?.image_url) {
    const image = document.createElement("img");
    image.src = place.image_url;
    image.alt = stop.name;
    image.loading = "lazy";
    image.className = "roadmap-popup__image";
    image.addEventListener("error", () => image.remove());
    content.appendChild(image);
  }

  const title = document.createElement("p");
  title.className = "roadmap-popup__title";
  title.textContent = `${index + 1}. ${stop.name}`;
  content.appendChild(title);

  const time = document.createElement("p");
  time.className = "roadmap-popup__time";
  time.textContent = stop.suggested_time;
  content.appendChild(time);

  if (onCheckIn) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "roadmap-popup__button";
    button.textContent = checkingIn ? "กำลังเช็คอิน..." : "เช็คอิน";
    button.disabled = checkingIn;
    button.addEventListener("click", () => onCheckIn(stop.place_id));
    content.appendChild(button);
  }

  return content;
}

export function MapView({
  stops,
  onCheckIn,
  checkingInPlaceId = null,
  rewardPlaceIds,
}: MapViewProps) {
  const rewardPlaceIdSet = new Set(rewardPlaceIds ?? []);
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
        const marker = new maplibregl.Marker({
          anchor: "bottom",
          element: createMarkerElement(i, rewardPlaceIdSet.has(s.place_id)),
        })
          .setLngLat([s.lng, s.lat])
          .setPopup(
            new maplibregl.Popup({ offset: 28 }).setDOMContent(
              createPopupContent({
                stop: s,
                index: i,
                onCheckIn,
                checkingIn: checkingInPlaceId === s.place_id,
              }),
            ),
          )
          .addTo(map);
        markersRef.current.push(marker);
      });

      const line = {
        type: "FeatureCollection" as const,
        features:
          stops.length > 1
            ? [
                {
                  type: "Feature" as const,
                  geometry: {
                    type: "LineString" as const,
                    coordinates: stops.map((s) => [s.lng, s.lat]),
                  },
                  properties: {},
                },
              ]
            : [],
      };

      if (map.getSource("route")) {
        (map.getSource("route") as maplibregl.GeoJSONSource).setData(
          line as never,
        );
      } else {
        map.addSource("route", { type: "geojson", data: line as never });
        map.addLayer({
          id: "route-shadow",
          type: "line",
          source: "route",
          paint: {
            "line-color": CLAY_DEEP,
            "line-opacity": 0.22,
            "line-width": 9,
            "line-blur": 3,
          },
        });
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          paint: { "line-color": CLAY, "line-width": 5 },
        });
      }
    };

    if (map.isStyleLoaded()) draw();
    else map.once("load", draw);
  }, [checkingInPlaceId, onCheckIn, rewardPlaceIds, stops]);

  return (
    <div
      ref={ref}
      className="roadmap-warm h-[58vh] min-h-[340px] w-full overflow-hidden rounded-card border border-clay/15 shadow-[0_24px_60px_rgba(92,42,30,0.18)] md:h-[calc(100vh-9rem)]"
    />
  );
}
