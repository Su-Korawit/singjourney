import { describe, it, expect } from "vitest";
import { haversine } from "./geo";

describe("haversine", () => {
  it("คืน 0 เมื่อจุดเดียวกัน", () => {
    expect(haversine({ lat: 14.89, lng: 100.4 }, { lat: 14.89, lng: 100.4 })).toBe(0);
  });
  it("วัดระยะเมืองสิงห์บุรี→อินทร์บุรี ~16–22 กม.", () => {
    const d = haversine({ lat: 14.891, lng: 100.397 }, { lat: 15.012, lng: 100.327 });
    expect(d).toBeGreaterThan(12);
    expect(d).toBeLessThan(25);
  });
});
