import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";
import { pushStatusToInterestedUsers } from "@/lib/line/push";

const OVERRIDE_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

export async function handleStatusReport(
  supabase: SupabaseClient,
  lineUserId: string,
  parsed: { placeId: string; status: OverrideStatus },
  now: Date,
): Promise<"saved" | "unauthorized"> {
  const { data: reporter } = await supabase
    .from("place_reporters")
    .select("verified")
    .eq("place_id", parsed.placeId)
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (!reporter || !(reporter as { verified: boolean }).verified) {
    return "unauthorized";
  }

  await supabase.from("place_status_overrides").insert({
    place_id: parsed.placeId,
    status: parsed.status,
    reported_by: lineUserId,
    expires_at: new Date(now.getTime() + OVERRIDE_TTL_MS).toISOString(),
  });

  const accessToken = process.env.LINE_MESSAGING_ACCESS_TOKEN;
  if (accessToken) {
    const { data: place } = await supabase
      .from("places")
      .select("name")
      .eq("id", parsed.placeId)
      .maybeSingle();
    const placeName = (place as { name?: string } | null)?.name ?? "สถานที่";
    try {
      await pushStatusToInterestedUsers(supabase, parsed.placeId, placeName, parsed.status, {
        accessToken,
      });
    } catch {
      /* push ล้มเหลวไม่ควรทำให้การบันทึก override ล้ม */
    }
  }
  return "saved";
}
