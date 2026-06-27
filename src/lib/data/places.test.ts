import { describe, it, expect } from "vitest";
import { PLACES, placeById, placesByDistrict } from "./places";

const DISTRICTS = [
  "เมืองสิงห์บุรี", "บางระจัน", "ค่ายบางระจัน",
  "พรหมบุรี", "อินทร์บุรี", "ท่าช้าง",
];

describe("PLACES data", () => {
  it("มี 12 แห่ง และ id ไม่ซ้ำ", () => {
    expect(PLACES).toHaveLength(12);
    expect(new Set(PLACES.map((p) => p.id)).size).toBe(12);
  });
  it("ครบทั้ง 6 อำเภอ และสะกดตรง", () => {
    for (const d of DISTRICTS) {
      expect(placesByDistrict(d).length).toBeGreaterThan(0);
    }
    for (const p of PLACES) expect(DISTRICTS).toContain(p.district);
  });
  it("ทุกแห่งมี image_url ชี้ /images/places/", () => {
    for (const p of PLACES) expect(p.image_url).toMatch(/^\/images\/places\/p\d+\.jpg$/);
  });
  it("placeById คืนถูกตัว", () => {
    expect(placeById("p1")?.name).toContain("พระนอน");
    expect(placeById("zzz")).toBeUndefined();
  });
});
