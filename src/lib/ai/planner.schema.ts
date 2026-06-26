import { z } from "zod";

export const StopSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  reason: z.string(),
  suggested_time: z.string(),
  lat: z.number(),
  lng: z.number(),
});
export const PlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.array(z.object({ day: z.number(), stops: z.array(StopSchema) })),
});
export const PlanResultSchema = z.object({ plans: z.array(PlanSchema) });
export type PlanResult = z.infer<typeof PlanResultSchema>;

export const PLAN_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    plans: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          days: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                day: { type: "integer" },
                stops: {
                  type: "array",
                  items: {
                    type: "object",
                    additionalProperties: false,
                    properties: {
                      place_id: { type: "string" },
                      name: { type: "string" },
                      reason: { type: "string" },
                      suggested_time: { type: "string" },
                      lat: { type: "number" },
                      lng: { type: "number" },
                    },
                    required: [
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
            },
          },
        },
        required: ["title", "summary", "days"],
      },
    },
  },
  required: ["plans"],
} as const;
