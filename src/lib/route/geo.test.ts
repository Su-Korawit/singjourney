import { describe, it, expect } from "vitest";
import { haversine, orderStopsByProximity } from "./geo";

describe("haversine", () => {
  it("คืน 0 เมื่อจุดเดียวกัน", () => {
    expect(haversine({ lat: 14.89, lng: 100.4 }, { lat: 14.89, lng: 100.4 })).toBe(0);
  });
  it("วัดระยะเมืองสิงห์บุรี->อินทร์บุรี ~16-22 กม.", () => {
    const d = haversine({ lat: 14.891, lng: 100.397 }, { lat: 15.012, lng: 100.327 });
    expect(d).toBeGreaterThan(12);
    expect(d).toBeLessThan(25);
  });
});

describe("orderStopsByProximity", () => {
  const a = { lat: 0, lng: 0, id: "a" };
  const b = { lat: 0, lng: 1, id: "b" };
  const c = { lat: 0, lng: 5, id: "c" };
  it("เริ่มจากจุดแรกแล้วไล่จุดใกล้สุดถัดไป (nearest-neighbor)", () => {
    const out = orderStopsByProximity([a, c, b]);
    expect(out.map((s) => s.id)).toEqual(["a", "b", "c"]);
  });
  it("คง element เดิมครบ ไม่เพิ่ม/หาย", () => {
    expect(orderStopsByProximity([a, c, b])).toHaveLength(3);
  });
  it("array ว่าง คืน array ว่าง", () => {
    expect(orderStopsByProximity([])).toEqual([]);
  });
});
