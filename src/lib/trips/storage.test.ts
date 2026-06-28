import { describe, it, expect } from "vitest";
import { addTrip, removeTrip, type SavedTrip } from "./storage";

const trip = (id: string): SavedTrip => ({
  id,
  title: `ทริป ${id}`,
  savedAt: "2026-06-28T00:00:00.000Z",
  stops: [],
});

describe("trips storage", () => {
  it("addTrip เพิ่มทริปใหม่ไว้บนสุด (ล่าสุดก่อน)", () => {
    const list = addTrip([trip("a")], trip("b"));
    expect(list.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("removeTrip ลบตาม id", () => {
    const list = removeTrip([trip("a"), trip("b")], "a");
    expect(list.map((t) => t.id)).toEqual(["b"]);
  });

  it("removeTrip ไม่พบ id คืนรายการเดิม", () => {
    const list = removeTrip([trip("a")], "zzz");
    expect(list.map((t) => t.id)).toEqual(["a"]);
  });
});
