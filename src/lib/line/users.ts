import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppUser } from "@/lib/types";
import type { LineProfile } from "@/lib/line/auth";

export async function upsertUserFromProfile(
  supabase: SupabaseClient,
  profile: LineProfile,
): Promise<AppUser> {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        line_user_id: profile.userId,
        display_name: profile.displayName,
        avatar_url: profile.pictureUrl ?? null,
      },
      { onConflict: "line_user_id" },
    )
    .select()
    .single();
  if (error || !data) throw new Error("upsert user failed");
  return data as AppUser;
}
