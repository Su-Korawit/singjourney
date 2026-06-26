import { describe, it, expect } from "vitest";
import { isOpenNow } from "./hours";
import type { OpeningHours } from "@/lib/types";

const h: OpeningHours = { 1: { open: "08:00", close: "17:00" } };

describe("isOpenNow", () => {
  it("เปิดอยู่ภายในช่วงเวลา", () => {
    expect(isOpenNow(h, new Date("2026-06-29T10:00:00+07:00"))).toBe("open");
  });
  it("ปิดแล้วหลังเวลาปิด", () => {
    expect(isOpenNow(h, new Date("2026-06-29T18:00:00+07:00"))).toBe("closed");
  });
  it("ใกล้ปิด ภายใน 60 นาทีก่อนปิด", () => {
    expect(isOpenNow(h, new Date("2026-06-29T16:30:00+07:00"))).toBe(
      "closing_soon",
    );
  });
  it("ปิดทั้งวันถ้าไม่มี key ของวันนั้น (อังคาร)", () => {
    expect(isOpenNow(h, new Date("2026-06-30T10:00:00+07:00"))).toBe("closed");
  });
  it("CLOSED_PERMANENTLY → closed เสมอ", () => {
    expect(
      isOpenNow(h, new Date("2026-06-29T10:00:00+07:00"), "CLOSED_PERMANENTLY"),
    ).toBe("closed");
  });
});
