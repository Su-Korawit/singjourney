import { describe, it, expect } from "vitest";
import type { Place } from "./types";

const sample: Place = {
  id: "x",
  district: "เมืองสิงห์บุรี",
  name: "วัดพระนอนจักรสีห์",
  lat: 14.86,
  lng: 100.37,
  category: "temple",
  description: "",
  image_url: null,
  avg_price: 0,
  google_place_id: null,
  opening_hours: { 1: { open: "08:00", close: "17:00" } },
  business_status: "OPERATIONAL",
  hours_last_synced: null,
};

describe("Place type", () => {
  it("compiles ด้วยฟิลด์ครบ", () => {
    expect(sample.business_status).toBe("OPERATIONAL");
  });
});
