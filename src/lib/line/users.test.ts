import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { upsertUserFromProfile } from "@/lib/line/users";

function mockSupabase(returned: unknown) {
  const single = vi.fn().mockResolvedValue({ data: returned, error: null });
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ upsert }));
  return { client: { from } as unknown as SupabaseClient, upsert };
}

describe("upsertUserFromProfile", () => {
  it("upsert ตาม line_user_id แล้วคืน AppUser", async () => {
    const row = { id: "u1", line_user_id: "U1", display_name: "ปอนด์", avatar_url: null };
    const { client, upsert } = mockSupabase(row);
    const user = await upsertUserFromProfile(client, {
      userId: "U1",
      displayName: "ปอนด์",
    });
    expect(user).toEqual(row);
    expect(upsert).toHaveBeenCalledWith(
      { line_user_id: "U1", display_name: "ปอนด์", avatar_url: null },
      { onConflict: "line_user_id" },
    );
  });

  it("error → throw", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "x" } });
    const client = {
      from: () => ({ upsert: () => ({ select: () => ({ single }) }) }),
    } as unknown as SupabaseClient;
    await expect(
      upsertUserFromProfile(client, { userId: "U1", displayName: "ปอนด์" }),
    ).rejects.toThrow(/upsert/i);
  });
});
