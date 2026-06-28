import { describe, it, expect } from "vitest";
import { EVENTS, eventById, MARKETS } from "./events";
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

describe("MARKET schedule structured hours", () => {
  it("ตลาดทุกแห่งมี schedule ที่ใช้คำนวณสถานะได้", () => {
    for (const m of MARKETS) {
      expect(Array.isArray(m.schedule.days)).toBe(true);
      expect(m.schedule.days.length).toBeGreaterThan(0);
      expect(m.schedule.open).toMatch(/^\d{2}:\d{2}$/);
      expect(m.schedule.close).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it("ตลาดบ้านระจันเปิดเสาร์-อาทิตย์ 06:00-12:00", () => {
    const m = MARKETS.find((x) => x.id === "market-banrachan")!;
    expect(m.schedule).toEqual({ days: [6, 0], open: "06:00", close: "12:00" });
  });
});
