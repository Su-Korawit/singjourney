import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { awardItem } from "@/lib/checkin/items";
import type { Item3D, UserItem } from "@/lib/types";

const DEMO_USER = "00000000-0000-0000-0000-000000000001";

export async function POST(req: Request) {
  const { place_id } = (await req.json()) as { place_id: string };
  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("items_3d")
    .select("*")
    .eq("place_id", place_id);
  const item = (items?.[0] ?? null) as Item3D | null;
  if (!item) return NextResponse.json({ item: null, awarded: false });

  const { data: owned } = await supabase
    .from("user_items")
    .select("*")
    .eq("user_id", DEMO_USER);
  const { awarded } = awardItem((owned ?? []) as UserItem[], item, DEMO_USER);
  if (awarded) {
    await supabase
      .from("user_items")
      .insert({ user_id: DEMO_USER, item_id: item.id, used: false });
    await supabase
      .from("checkins")
      .insert({ user_id: DEMO_USER, place_id, item_id: item.id });
  }
  return NextResponse.json({ item, awarded });
}
