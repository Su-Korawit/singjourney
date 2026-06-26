import { describe, it, expect, vi } from "vitest";

const item = {
  id: "s1",
  name: "พระนอนจิ๋ว",
  type: "souvenir",
  model_url: "/m.glb",
  place_id: "1",
  is_consumable: false,
};

vi.mock("@/lib/supabase/server", () => ({
  createServerClient: () => ({
    from: (table: string) => {
      if (table === "items_3d") {
        return {
          select: () => ({
            eq: () => ({ data: [item], error: null }),
          }),
        };
      }
      if (table === "user_items") {
        return {
          select: () => ({
            eq: () => ({ data: [], error: null }),
          }),
          insert: () => ({ error: null }),
        };
      }
      if (table === "checkins") {
        return { insert: () => ({ error: null }) };
      }
      return { select: () => ({ eq: () => ({ data: [], error: null }) }) };
    },
  }),
}));

import { POST } from "./route";

describe("POST /api/checkin", () => {
  it("เช็คอินครั้งแรกได้ไอเทม", async () => {
    const req = new Request("http://x", {
      method: "POST",
      body: JSON.stringify({ place_id: "1" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.awarded).toBe(true);
    expect(body.item.id).toBe("s1");
  });
});
