import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({
  default: class {
    messages = { create: mockCreate };
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
  beforeEach(() => mockCreate.mockReset());
  it("ส่ง model=claude-opus-4-8, adaptive thinking, output_config.format และคืนผลตาม schema", async () => {
    mockCreate.mockResolvedValue({
      content: [
        {
          type: "text",
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
        },
      ],
    });
    const out = await generatePlans(profile, places);
    expect(out.plans).toHaveLength(1);
    const arg = mockCreate.mock.calls[0][0];
    expect(arg.model).toBe("claude-opus-4-8");
    expect(arg.thinking).toEqual({ type: "adaptive" });
    expect(arg.budget_tokens).toBeUndefined();
    expect(arg.output_config.format.type).toBe("json_schema");
  });
  it("throw ถ้าผลไม่ตรง schema", async () => {
    mockCreate.mockResolvedValue({
      content: [{ type: "text", text: JSON.stringify({ plans: [{ title: "t" }] }) }],
    });
    await expect(generatePlans(profile, places)).rejects.toThrow();
  });
});
