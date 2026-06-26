/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HoursBadge } from "./HoursBadge";
import type { Place } from "@/lib/types";

const base: Place = {
  id: "1",
  district: "เมือง",
  name: "x",
  lat: 0,
  lng: 0,
  category: "temple",
  description: "",
  image_url: null,
  avg_price: 0,
  google_place_id: null,
  opening_hours: { 1: { open: "08:00", close: "17:00" } },
  business_status: "OPERATIONAL",
  hours_last_synced: null,
};

describe("HoursBadge", () => {
  it("แสดง 'เปิดอยู่' เมื่อเปิด", () => {
    render(
      <HoursBadge place={base} now={new Date("2026-06-29T10:00:00+07:00")} />,
    );
    expect(screen.getByText(/เปิดอยู่/)).toBeInTheDocument();
  });
  it("แสดง 'ปิดแล้ว' เมื่อปิด", () => {
    render(
      <HoursBadge place={base} now={new Date("2026-06-29T20:00:00+07:00")} />,
    );
    expect(screen.getByText(/ปิดแล้ว/)).toBeInTheDocument();
  });
});
