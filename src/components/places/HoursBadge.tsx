import type { Place, OverrideStatus } from "@/lib/types";
import { effectiveStatus } from "@/lib/places/status";

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
  override = null,
}: {
  place: Place;
  now?: Date;
  override?: { status: OverrideStatus; expires_at: string } | null;
}) {
  const { status, source } = effectiveStatus(place, override, now);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`rounded-full border px-2.5 py-1 font-head text-xs font-bold ${COLOR[status]}`}
      >
        {LABEL[status]}
      </span>
      {source === "community" && (
        <span className="text-[10px] font-medium text-clay-deep/60">อัปเดตโดยชุมชน</span>
      )}
    </span>
  );
}
