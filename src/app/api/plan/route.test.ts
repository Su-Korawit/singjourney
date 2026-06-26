import { describe, it, expect, vi } from "vitest";
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

describe("POST /api/plan", () => {
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
});
