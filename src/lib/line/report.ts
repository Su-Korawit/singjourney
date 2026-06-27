import type { OverrideStatus } from "@/lib/types";

export type ParsedReport = { placeId: string; status: OverrideStatus } | null;

export function parseStatusReport(
  text: string,
  places: { id: string; name: string }[],
): ParsedReport {
  const t = text.trim();
  // "ปิด" ที่ไม่ได้นำหน้าด้วย "เ" (กัน "เปิด" ถูกนับเป็น "ปิด")
  const closedHit = /(^|[^เ])ปิด/.test(t);
  const openHit = /เปิด/.test(t);
  const status: OverrideStatus | null = closedHit ? "closed" : openHit ? "open" : null;
  if (!status) return null;

  const match = places.find((p) => t.includes(p.name));
  if (!match) return null;
  return { placeId: match.id, status };
}
