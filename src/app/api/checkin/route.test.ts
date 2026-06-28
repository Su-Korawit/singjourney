import { describe, it, expect } from "vitest";
import { POST } from "./route";

describe("POST /api/checkin", () => {
  it("คืนไอเทมของสถานที่ที่มีรางวัล", async () => {
    const req = new Request("http://x", {
      method: "POST",
      body: JSON.stringify({ place_id: "p1" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.item.id).toBe("s1");
    expect(body.item.name).toBe("พระนอนจิ๋ว");
  });

  it("คืน item เป็น null เมื่อสถานที่ไม่มีรางวัล", async () => {
    const req = new Request("http://x", {
      method: "POST",
      body: JSON.stringify({ place_id: "p2" }),
    });
    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.item).toBeNull();
  });
});
