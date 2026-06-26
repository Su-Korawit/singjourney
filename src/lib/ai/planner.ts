import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { Place, UserProfile } from "@/lib/types";
import {
  PlanResultSchema,
  PLAN_JSON_SCHEMA,
  type PlanResult,
} from "./planner.schema";
import { isOpenNow } from "@/lib/places/hours";

const SYSTEM = `คุณคือผู้ช่วยวางแผนท่องเที่ยวจังหวัดสิงห์บุรี วิเคราะห์โปรไฟล์ผู้ใช้แล้วเลือกสถานที่จากรายการที่ให้เท่านั้น จัดลำดับเส้นทางให้สมเหตุสมผลตามระยะทาง หลีกเลี่ยงสถานที่ที่ปิดในวัน/เวลาที่ผู้ใช้จะไป (ดู open_status ของแต่ละ place) คืนผลหลายแผนตาม schema ที่กำหนด`;

export async function generatePlans(
  profile: UserProfile,
  places: Place[],
): Promise<PlanResult> {
  const client = new Anthropic();
  const now = new Date();
  const placeLines = places
    .map(
      (p) =>
        `id=${p.id} | ${p.name} (${p.district}) | หมวด=${p.category} | ราคา~${p.avg_price ?? 0} | lat=${p.lat} lng=${p.lng} | open_status=${isOpenNow(p.opening_hours, now, p.business_status)}`,
    )
    .join("\n");

  const userMsg = `โปรไฟล์: ผู้ร่วมเดินทาง=${profile.travelers}, งบ=${profile.budget}, สนใจ=${profile.interests.join(",")}, จำนวนวัน=${profile.days}\n\nรายการสถานที่:\n${placeLines}`;

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: {
      format: { type: "json_schema", schema: PLAN_JSON_SCHEMA },
    },
    messages: [{ role: "user", content: userMsg }],
  });

  const text = res.content.find((b) => b.type === "text") as
    | { text: string }
    | undefined;
  const parsed = PlanResultSchema.safeParse(JSON.parse(text!.text));
  if (!parsed.success)
    throw new Error("AI ผลไม่ตรง schema: " + parsed.error.message);
  return parsed.data;
}
