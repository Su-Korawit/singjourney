import { describe, it, expect } from "vitest";
import { placeStatus, marketStatus } from "./live";
import { placeById } from "@/lib/data/places";

function thai(dayUtc: string): Date {
  return new Date(dayUtc);
}

describe("placeStatus", () => {
  const wat = placeById("p1")!;

  it("กลางวันในเวลาทำการ = open", () => {
    expect(placeStatus(wat, thai("2026-06-01T03:00:00Z"))).toBe("open");
  });

  it("ก่อนปิดไม่เกิน 60 นาที = closing", () => {
    expect(placeStatus(wat, thai("2026-06-01T09:30:00Z"))).toBe("closing");
  });

  it("นอกเวลาทำการ = closed", () => {
    expect(placeStatus(wat, thai("2026-06-01T14:00:00Z"))).toBe("closed");
  });
});

describe("marketStatus", () => {
  const weekendMorning = { days: [6, 0], open: "06:00", close: "12:00" };

  it("เสาร์เช้าในช่วงเวลา = open", () => {
    expect(marketStatus(weekendMorning, thai("2026-06-06T02:00:00Z"))).toBe("open");
  });

  it("เสาร์ใกล้ปิด = closing", () => {
    expect(marketStatus(weekendMorning, thai("2026-06-06T04:30:00Z"))).toBe("closing");
  });

  it("วันธรรมดา = closed", () => {
    expect(marketStatus(weekendMorning, thai("2026-06-03T02:00:00Z"))).toBe("closed");
  });
});
