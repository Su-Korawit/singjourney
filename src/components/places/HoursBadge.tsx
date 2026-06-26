import type { Place } from "@/lib/types";
import { isOpenNow } from "@/lib/places/hours";

const LABEL = {
  open: "เปิดอยู่",
  closed: "ปิดแล้ว",
  closing_soon: "ใกล้ปิด",
} as const;
const COLOR = {
  open: "bg-green-100 text-green-800",
  closed: "bg-red-100 text-red-700",
  closing_soon: "bg-amber-100 text-amber-800",
} as const;

export function HoursBadge({
  place,
  now = new Date(),
}: {
  place: Place;
  now?: Date;
}) {
  const status = isOpenNow(place.opening_hours, now, place.business_status);
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${COLOR[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
