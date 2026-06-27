import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGenerate = vi.fn();
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent: mockGenerate };
  },
  Type: {
    OBJECT: "object",
    ARRAY: "array",
    STRING: "string",
    NUMBER: "number",
    INTEGER: "integer",
  },
}));

import { generatePlans } from "./planner";
import type { Place, UserProfile } from "@/lib/types";

const profile: UserProfile = {
  travelers: "ครอบครัวมีลูกเล็ก",
  budget: "low",
  interests: ["temple", "kids"],
  days: 1,
};
const places: Place[] = [
  {
    id: "1",
    district: "เมือง",
    name: "วัดพระนอน",
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
  },
];

describe("generatePlans", () => {
  beforeEach(() => mockGenerate.mockReset());
  it("ส่ง model=gemini-2.5-flash, responseMimeType=application/json, responseSchema และคืนผลตาม schema", async () => {
    mockGenerate.mockResolvedValue({
      text: JSON.stringify({
        plans: [
          {
            title: "t",
            summary: "s",
            days: [
              {
                day: 1,
                stops: [
                  {
                    place_id: "1",
                    name: "วัดพระนอน",
                    reason: "เด็กชอบ",
                    suggested_time: "09:00",
                    lat: 14.86,
                    lng: 100.37,
                  },
                ],
              },
            ],
          },
        ],
      }),
    });
    const out = await generatePlans(profile, places);
    expect(out.plans).toHaveLength(1);
    const arg = mockGenerate.mock.calls[0][0];
    expect(arg.model).toBe("gemini-2.5-flash");
    expect(arg.config.responseMimeType).toBe("application/json");
    expect(arg.config.responseSchema).toBeDefined();
    expect(arg.config.systemInstruction).toContain("สิงห์บุรี");
  });
  it("throw ถ้าผลไม่ตรง schema", async () => {
    mockGenerate.mockResolvedValue({
      text: JSON.stringify({ plans: [{ title: "t" }] }),
    });
    await expect(generatePlans(profile, places)).rejects.toThrow();
  });
  it("แนบ event context เข้า prompt เมื่อมี anchor event", async () => {
    mockGenerate.mockResolvedValue({
      text: JSON.stringify({
        plans: [
          {
            title: "t",
            summary: "s",
            days: [
              {
                day: 1,
                stops: [
                  {
                    place_id: "1",
                    name: "วัดพระนอน",
                    reason: "เด็กชอบ",
                    suggested_time: "09:00",
                    lat: 14.86,
                    lng: 100.37,
                  },
                ],
              },
            ],
          },
        ],
      }),
    });

    await generatePlans(profile, places, "วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน");

    const arg = mockGenerate.mock.calls[0][0];
    expect(arg.contents).toContain("บริบทงานอีเวนต์:");
    expect(arg.contents).toContain("วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน");
  });
});
