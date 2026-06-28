import { describe, it, expect } from "vitest";
import { buildLocalPlans } from "./localPlanner";
import { PLACES } from "@/lib/data/places";
import type { UserProfile } from "@/lib/types";

const profile: UserProfile = {
  travelers: "ครอบครัว",
  budget: "low",
  interests: ["temple"],
  days: 2,
};

describe("buildLocalPlans", () => {
  it("คืนแผนอย่างน้อย 2 แบบ แต่ละแบบมี title/summary/days", () => {
    const { plans } = buildLocalPlans(profile, PLACES);
    expect(plans.length).toBeGreaterThanOrEqual(2);
    for (const plan of plans) {
      expect(plan.title.length).toBeGreaterThan(0);
      expect(plan.summary.length).toBeGreaterThan(0);
      expect(plan.days.length).toBeGreaterThan(0);
    }
  });

  it("ทุก stop อ้าง place id จริงและมีพิกัด/เวลา", () => {
    const { plans } = buildLocalPlans(profile, PLACES);
    const ids = new Set(PLACES.map((p) => p.id));
    for (const plan of plans) {
      for (const day of plan.days) {
        for (const stop of day.stops) {
          expect(ids.has(stop.place_id)).toBe(true);
          expect(typeof stop.lat).toBe("number");
          expect(typeof stop.lng).toBe("number");
          expect(stop.suggested_time).toMatch(/^\d{2}:\d{2}$/);
        }
      }
    }
  });

  it("แผนเต็มแบ่งตามจำนวนวันใน profile", () => {
    const { plans } = buildLocalPlans({ ...profile, days: 2 }, PLACES);
    const full = plans.find((p) => p.title.includes("2 วัน"));
    expect(full).toBeDefined();
    expect(full!.days.length).toBeLessThanOrEqual(2);
  });

  it("deterministic — เรียกซ้ำได้ผลเท่าเดิม", () => {
    const a = JSON.stringify(buildLocalPlans(profile, PLACES));
    const b = JSON.stringify(buildLocalPlans(profile, PLACES));
    expect(a).toBe(b);
  });

  it("ไม่มี em dash หรือ en dash ในข้อความแผน", () => {
    const text = JSON.stringify(buildLocalPlans(profile, PLACES));
    expect(text).not.toMatch(/[—–]/);
  });
});
