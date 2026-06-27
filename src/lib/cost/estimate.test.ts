import { describe, it, expect } from "vitest";
import { estimateCost, formatBaht } from "./estimate";

describe("estimateCost", () => {
  it("รวมค่าเข้า + อาหาร + เดินทาง แล้วคูณจำนวนคน คืนช่วง low/high", () => {
    const stops = [
      { lat: 14.92, lng: 100.35, avg_price: 0 },
      { lat: 14.89, lng: 100.40, avg_price: 120 },
    ];
    const r = estimateCost(stops, 2);
    expect(r.low).toBeGreaterThan(0);
    expect(r.high).toBeGreaterThan(r.low);
    expect(r.low % 10).toBe(0); // ปัดหลักสิบ
  });

  it("formatBaht อ่านง่าย ไม่มี em dash", () => {
    const s = formatBaht({ low: 1200, high: 1500 });
    expect(s).toContain("฿1,200");
    expect(s).not.toContain("—");
  });
});
