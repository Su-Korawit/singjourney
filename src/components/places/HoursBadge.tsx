import type { Place } from "@/lib/types";
import { isOpenNow } from "@/lib/places/hours";

const LABEL = {
  open: "เปิดอยู่",
  closed: "ปิดแล้ว",
  closing_soon: "ใกล้ปิด",
} as const;
const COLOR = {
  open: "border-open/20 bg-open/10 text-open",
  closed: "border-closed/20 bg-closed/10 text-closed",
  closing_soon: "border-closing/25 bg-closing/10 text-closing",
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
      className={`rounded-full border px-2.5 py-1 font-head text-xs font-bold ${COLOR[status]}`}
    >
      {LABEL[status]}
    </span>
  );
}
