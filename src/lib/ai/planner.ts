import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import type { Place, UserProfile } from "@/lib/types";
import { PlanResultSchema, type PlanResult } from "./planner.schema";
import { isOpenNow } from "@/lib/places/hours";

const SYSTEM = `คุณคือผู้ช่วยวางแผนท่องเที่ยวจังหวัดสิงห์บุรี วิเคราะห์โปรไฟล์ผู้ใช้แล้วเลือกสถานที่จากรายการที่ให้เท่านั้น จัดลำดับเส้นทางให้สมเหตุสมผลตามระยะทาง หลีกเลี่ยงสถานที่ที่ปิดในวัน/เวลาที่ผู้ใช้จะไป (ดู open_status ของแต่ละ place) คืนผลหลายแผนตาม schema ที่กำหนด`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    plans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                stops: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      place_id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      suggested_time: { type: Type.STRING },
                      lat: { type: Type.NUMBER },
                      lng: { type: Type.NUMBER },
                    },
                    required: [
                      "place_id",
                      "name",
                      "reason",
                      "suggested_time",
                      "lat",
                      "lng",
                    ],
                    propertyOrdering: [
                      "place_id",
                      "name",
                      "reason",
                      "suggested_time",
                      "lat",
                      "lng",
                    ],
                  },
                },
              },
              required: ["day", "stops"],
              propertyOrdering: ["day", "stops"],
            },
          },
        },
        required: ["title", "summary", "days"],
        propertyOrdering: ["title", "summary", "days"],
      },
    },
  },
  required: ["plans"],
} as const;

export async function generatePlans(
  profile: UserProfile,
  places: Place[],
  eventContext?: string,
): Promise<PlanResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const now = new Date();
  const placeLines = places
    .map(
      (p) =>
        `id=${p.id} | ${p.name} (${p.district}) | หมวด=${p.category} | ราคา~${p.avg_price ?? 0} | lat=${p.lat} lng=${p.lng} | open_status=${isOpenNow(p.opening_hours, now, p.business_status)}`,
    )
    .join("\n");

  const eventContextBlock = eventContext
    ? `\n\nบริบทงานอีเวนต์:\n${eventContext}`
    : "";
  const userMsg = `โปรไฟล์: ผู้ร่วมเดินทาง=${profile.travelers}, งบ=${profile.budget}, สนใจ=${profile.interests.join(",")}, จำนวนวัน=${profile.days}${eventContextBlock}\n\nรายการสถานที่:\n${placeLines}`;

  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMsg,
    config: {
      systemInstruction: SYSTEM,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      thinkingConfig: { thinkingBudget: -1 },
    },
  });

  const text = res.text;
  if (!text) throw new Error("AI ไม่คืนข้อความ");
  const parsed = PlanResultSchema.safeParse(JSON.parse(text));
  if (!parsed.success)
    throw new Error("AI ผลไม่ตรง schema: " + parsed.error.message);
  return parsed.data;
}
