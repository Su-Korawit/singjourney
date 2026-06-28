import { NextResponse } from "next/server";
import { generatePlans } from "@/lib/ai/planner";
import { buildLocalPlans } from "@/lib/ai/localPlanner";
import { PLACES } from "@/lib/data/places";
import type { UserProfile } from "@/lib/types";

type PlanRequestBody = UserProfile & {
  eventContext?: string;
};

export async function POST(req: Request) {
  const { eventContext, ...profile } = (await req.json()) as PlanRequestBody;

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(buildLocalPlans(profile, PLACES));
  }

  const plans = await generatePlans(profile, PLACES, eventContext);
  return NextResponse.json(plans);
}
