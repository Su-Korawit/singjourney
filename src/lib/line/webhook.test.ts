import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { handleStatusReport } from "@/lib/line/webhook";

function mockSupabase(reporter: { verified: boolean } | null) {
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const maybeSingle = vi.fn().mockResolvedValue({ data: reporter, error: null });
  const client = {
    from: (table: string) => {
      if (table === "place_reporters") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ maybeSingle }) }) }),
        };
      }
      return { insert };
    },
  } as unknown as SupabaseClient;
  return { client, insert };
}

const NOW = new Date("2026-06-30T03:00:00Z");

describe("handleStatusReport", () => {
  it("ผู้แจ้ง verified → insert override แล้วคืน 'saved'", async () => {
    const { client, insert } = mockSupabase({ verified: true });
    const result = await handleStatusReport(
      client,
      "U1",
      { placeId: "p1", status: "closed" },
      NOW,
    );
    expect(result).toBe("saved");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        place_id: "p1",
        status: "closed",
        reported_by: "U1",
        expires_at: "2026-06-30T15:00:00.000Z", // +12 ชม.
      }),
    );
  });

  it("ผู้แจ้งไม่ได้ verify → 'unauthorized' ไม่ insert", async () => {
    const { client, insert } = mockSupabase({ verified: false });
    const result = await handleStatusReport(
      client,
      "U1",
      { placeId: "p1", status: "closed" },
      NOW,
    );
    expect(result).toBe("unauthorized");
    expect(insert).not.toHaveBeenCalled();
  });

  it("ไม่พบผู้แจ้ง → 'unauthorized'", async () => {
    const { client, insert } = mockSupabase(null);
    expect(await handleStatusReport(client, "U1", { placeId: "p1", status: "open" }, NOW)).toBe(
      "unauthorized",
    );
    expect(insert).not.toHaveBeenCalled();
  });
});
