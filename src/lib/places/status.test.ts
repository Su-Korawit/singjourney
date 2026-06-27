import { describe, it, expect } from "vitest";
import { effectiveStatus } from "@/lib/places/status";
import type { OpeningHours } from "@/lib/types";

// อังคาร 30 มิ.ย. 2026 เวลา ~10:00 ICT (UTC 03:00) → ในเวลาทำการ (วันอังคาร = key 2)
const NOW = new Date("2026-06-30T03:00:00Z");
const OPEN_HOURS: OpeningHours = { 2: { open: "08:00", close: "17:00" } };
const place = { opening_hours: OPEN_HOURS, business_status: "OPERATIONAL" as const };

describe("effectiveStatus", () => {
  it("ไม่มี override → ใช้ข้อมูลอัตโนมัติ (auto)", () => {
    expect(effectiveStatus(place, null, NOW)).toEqual({ status: "open", source: "auto" });
  });

  it("override ปิด ยังไม่หมดอายุ → ใช้ของชุมชน (community) แม้เวลาเปิด", () => {
    const override = { status: "closed" as const, expires_at: "2026-06-30T12:00:00Z" };
    expect(effectiveStatus(place, override, NOW)).toEqual({ status: "closed", source: "community" });
  });

  it("override หมดอายุแล้ว → fallback กลับไป auto", () => {
    const override = { status: "closed" as const, expires_at: "2026-06-30T02:00:00Z" };
    expect(effectiveStatus(place, override, NOW)).toEqual({ status: "open", source: "auto" });
  });
});
