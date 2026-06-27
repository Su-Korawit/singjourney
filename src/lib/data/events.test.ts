import { describe, it, expect } from "vitest";
import { EVENTS, eventById } from "./events";
import { placeById } from "./places";

describe("EVENTS data", () => {
  it("มี 6 งาน id ไม่ซ้ำ", () => {
    expect(EVENTS).toHaveLength(6);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(6);
  });
  it("ทุก anchor_place_ids ชี้ไป place จริง", () => {
    for (const e of EVENTS) {
      expect(e.anchor_place_ids.length).toBeGreaterThan(0);
      for (const pid of e.anchor_place_ids) expect(placeById(pid)).toBeDefined();
    }
  });
  it("เดือนอยู่ในช่วง 1-12 และมี tagline", () => {
    for (const e of EVENTS) {
      expect(e.month).toBeGreaterThanOrEqual(1);
      expect(e.month).toBeLessThanOrEqual(12);
      expect(e.tagline.length).toBeGreaterThan(0);
    }
  });
  it("eventById คืนถูกตัว", () => {
    expect(eventById("e1")?.name).toContain("บางระจัน");
    expect(eventById("zzz")).toBeUndefined();
  });
});
