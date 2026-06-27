import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("@/lib/ai/planner", () => ({
  generatePlans: vi.fn().mockResolvedValue({ plans: [] }),
}));
vi.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: () => ({
      select: () => ({ data: [], error: null }),
    }),
  }),
}));
import { POST } from "./route";
import { generatePlans } from "@/lib/ai/planner";

const mockGeneratePlans = vi.mocked(generatePlans);

describe("POST /api/plan", () => {
  beforeEach(() => {
    mockGeneratePlans.mockClear();
  });

  it("คืน 200 + plans", async () => {
    const req = new Request("http://x/api/plan", {
      method: "POST",
      body: JSON.stringify({
        travelers: "ครอบครัว",
        budget: "low",
        interests: ["temple"],
        days: 1,
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ plans: [] });
  });

  it("ส่ง eventContext ต่อให้ planner เมื่อ request แนบ anchor event", async () => {
    const req = new Request("http://x/api/plan", {
      method: "POST",
      body: JSON.stringify({
        travelers: "ครอบครัว",
        budget: "low",
        interests: ["temple"],
        days: 1,
        eventContext: "วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน",
      }),
    });

    await POST(req);

    expect(mockGeneratePlans).toHaveBeenCalledWith(
      {
        travelers: "ครอบครัว",
        budget: "low",
        interests: ["temple"],
        days: 1,
      },
      [],
      "วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน",
    );
  });
});
