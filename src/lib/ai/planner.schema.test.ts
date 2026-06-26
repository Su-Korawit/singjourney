import { describe, it, expect } from "vitest";
import { PlanResultSchema } from "./planner.schema";

const valid = {
  plans: [
    {
      title: "ทริปครอบครัว 1 วัน",
      summary: "ใกล้ ราคาประหยัด",
      days: [
        {
          day: 1,
          stops: [
            {
              place_id: "1",
              name: "วัดพระนอน",
              reason: "เหมาะกับเด็ก",
              suggested_time: "09:00",
              lat: 14.86,
              lng: 100.37,
            },
          ],
        },
      ],
    },
  ],
};

describe("PlanResultSchema", () => {
  it("ผ่านเมื่อข้อมูลถูกต้อง", () => {
    expect(PlanResultSchema.safeParse(valid).success).toBe(true);
  });
  it("fail เมื่อขาด stops", () => {
    const bad = { plans: [{ title: "x", summary: "y", days: [{ day: 1 }] }] };
    expect(PlanResultSchema.safeParse(bad).success).toBe(false);
  });
});
