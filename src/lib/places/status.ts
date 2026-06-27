import { isOpenNow } from "@/lib/places/hours";
import type { OpeningHours, BusinessStatus, LiveStatus, OverrideStatus } from "@/lib/types";

export type StatusResult = { status: LiveStatus; source: "community" | "auto" };

export function effectiveStatus(
  place: { opening_hours: OpeningHours | null; business_status: BusinessStatus },
  override: { status: OverrideStatus; expires_at: string } | null,
  now: Date,
): StatusResult {
  if (override && new Date(override.expires_at).getTime() > now.getTime()) {
    return { status: override.status, source: "community" };
  }
  return {
    status: isOpenNow(place.opening_hours, now, place.business_status),
    source: "auto",
  };
}
