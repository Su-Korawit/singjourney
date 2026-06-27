import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";

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
  return "saved";
}
