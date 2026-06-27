import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildStatusMessage,
  pushLineMessage,
  pushStatusToInterestedUsers,
} from "@/lib/line/push";

describe("buildStatusMessage", () => {
  it("closed → ข้อความปิด", () => {
    expect(buildStatusMessage("วัดพระนอนจักรสีห์", "closed")).toContain("วัดพระนอนจักรสีห์");
    expect(buildStatusMessage("วัดพระนอนจักรสีห์", "closed")).toContain("ปิด");
  });
});

describe("pushLineMessage", () => {
  it("POST ไป LINE push endpoint พร้อม Bearer + ข้อความ", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    await pushLineMessage({
      to: "U1",
      text: "ทดสอบ",
      accessToken: "tok",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.line.me/v2/bot/message/push",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer tok" }),
      }),
    );
  });
});

describe("pushStatusToInterestedUsers", () => {
  it("ส่งหาผู้ที่เคยเช็คอินสถานที่นี้ทุกคน", async () => {
    const client = {
      from: (table: string) => {
        if (table === "checkins") {
          return { select: () => ({ eq: () => Promise.resolve({ data: [{ user_id: "u1" }, { user_id: "u2" }] }) }) };
        }
        return { select: () => ({ in: () => Promise.resolve({ data: [{ line_user_id: "U1" }, { line_user_id: "U2" }] }) }) };
      },
    } as unknown as SupabaseClient;
    const push = vi.fn().mockResolvedValue(undefined);

    const count = await pushStatusToInterestedUsers(
      client,
      "p1",
      "วัดพระนอนจักรสีห์",
      "closed",
      { push, accessToken: "tok" },
    );
    expect(count).toBe(2);
    expect(push).toHaveBeenCalledTimes(2);
  });
});
