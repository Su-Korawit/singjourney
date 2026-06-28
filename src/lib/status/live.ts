import type { Place } from "@/lib/types";
import { isOpenNow } from "@/lib/places/hours";

export type LiveStatus = "open" | "closing" | "closed";

export function placeStatus(place: Place, now: Date): LiveStatus {
  const s = isOpenNow(place.opening_hours, now, place.business_status);
  if (s === "closing_soon") return "closing";
  return s;
}

export type MarketHours = { days: number[]; open: string; close: string };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function marketStatus(hours: MarketHours, now: Date): LiveStatus {
  const local = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const day = local.getUTCDay();
  if (!hours.days.includes(day)) return "closed";
  const cur = local.getUTCHours() * 60 + local.getUTCMinutes();
  const open = toMin(hours.open);
  const close = toMin(hours.close);
  if (cur < open || cur >= close) return "closed";
  if (close - cur <= 60) return "closing";
  return "open";
}
