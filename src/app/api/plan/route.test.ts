import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/ai/planner", () => ({
  generatePlans: vi
    .fn()
    .mockResolvedValue({ plans: [{ title: "จาก Gemini", summary: "x", days: [] }] }),
}));

import { POST } from "./route";
import { generatePlans } from "@/lib/ai/planner";

const mockGeneratePlans = vi.mocked(generatePlans);

function makeReq(extra: Record<string, unknown> = {}) {
  return new Request("http://x/api/plan", {
    method: "POST",
    body: JSON.stringify({
      travelers: "ครอบครัว",
      budget: "low",
      interests: ["temple"],
      days: 1,
      ...extra,
    }),
  });
}

describe("POST /api/plan", () => {
  beforeEach(() => {
    mockGeneratePlans.mockClear();
    delete process.env.GEMINI_API_KEY;
  });

  it("ไม่มี GEMINI_API_KEY -> ใช้ local planner คืน 200 + plans และไม่เรียก Gemini", async () => {
    const res = await POST(makeReq());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.plans.length).toBeGreaterThanOrEqual(2);
    expect(mockGeneratePlans).not.toHaveBeenCalled();
  });

  it("มี GEMINI_API_KEY -> เรียก Gemini และส่ง eventContext ต่อ", async () => {
    process.env.GEMINI_API_KEY = "test-key";
    await POST(makeReq({ eventContext: "วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน" }));
    expect(mockGeneratePlans).toHaveBeenCalledTimes(1);
    const call = mockGeneratePlans.mock.calls[0];
    expect(call[0]).toMatchObject({ travelers: "ครอบครัว", interests: ["temple"] });
    expect(call[2]).toBe("วางแผนรอบงานรำลึกวีรชนค่ายบางระจัน");
  });
});
