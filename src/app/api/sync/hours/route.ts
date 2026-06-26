import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { fetchPlaceDetails } from "@/lib/places/sync";
import { mergeHours } from "@/lib/places/hours";
import type { Place } from "@/lib/types";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("places")
    .select("*")
    .not("google_place_id", "is", null);
  let updated = 0;
  for (const place of (data ?? []) as Place[]) {
    try {
      const details = await fetchPlaceDetails(place.google_place_id!);
      const merged = mergeHours(place, details);
      await supabase
        .from("places")
        .update({
          opening_hours: merged.opening_hours,
          business_status: merged.business_status,
          hours_last_synced: merged.hours_last_synced,
        })
        .eq("id", place.id);
      updated++;
    } catch {
      /* fallback: คง seed เดิม */
    }
  }
  return NextResponse.json({ updated });
}
