import type { OpeningHours, BusinessStatus, Place } from "@/lib/types";

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function isOpenNow(
  hours: OpeningHours | null,
  now: Date,
  status: BusinessStatus = "OPERATIONAL",
): "open" | "closed" | "closing_soon" {
  if (status !== "OPERATIONAL" || !hours) return "closed";
  const local = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const day = local.getUTCDay();
  const today = hours[day];
  if (!today) return "closed";
  const cur = local.getUTCHours() * 60 + local.getUTCMinutes();
  const open = toMin(today.open);
  const close = toMin(today.close);
  if (cur < open || cur >= close) return "closed";
  if (close - cur <= 60) return "closing_soon";
  return "open";
}

export function mergeHours(
  place: Place,
  details: {
    opening_hours: OpeningHours | null;
    business_status: BusinessStatus;
  },
): Place {
  return {
    ...place,
    opening_hours: details.opening_hours ?? place.opening_hours,
    business_status: details.business_status,
    hours_last_synced: new Date().toISOString(),
  };
}
