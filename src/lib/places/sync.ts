import "server-only";
import type { OpeningHours, BusinessStatus } from "@/lib/types";

export function buildFieldMask(): string {
  return "regularOpeningHours,currentOpeningHours,businessStatus";
}

const pad = (n: number) => String(n).padStart(2, "0");

export async function fetchPlaceDetails(googlePlaceId: string): Promise<{
  opening_hours: OpeningHours | null;
  business_status: BusinessStatus;
}> {
  const url = `https://places.googleapis.com/v1/${googlePlaceId}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": buildFieldMask(),
    },
  });
  if (!res.ok) throw new Error("Google Places error " + res.status);
  const j = await res.json();
  const periods =
    j.currentOpeningHours?.periods ?? j.regularOpeningHours?.periods ?? [];
  const hours: OpeningHours = {};
  for (const p of periods) {
    if (p.open && p.close)
      hours[p.open.day] = {
        open: `${pad(p.open.hour)}:${pad(p.open.minute)}`,
        close: `${pad(p.close.hour)}:${pad(p.close.minute)}`,
      };
  }
  return {
    opening_hours: Object.keys(hours).length ? hours : null,
    business_status: (j.businessStatus ?? "OPERATIONAL") as BusinessStatus,
  };
}
