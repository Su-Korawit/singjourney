import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { generatePlans } from "@/lib/ai/planner";
import type { UserProfile, Place } from "@/lib/types";

export async function POST(req: Request) {
  const profile = (await req.json()) as UserProfile;
  const supabase = createServerClient();
  const { data, error } = await supabase.from("places").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  const plans = await generatePlans(profile, (data ?? []) as Place[]);
  return NextResponse.json(plans);
}
