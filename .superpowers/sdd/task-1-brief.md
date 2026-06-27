### Task 1: Status types + `effectiveStatus()` (override ชุมชนมาก่อน Google)

**Files:**
- Modify: `src/lib/types.ts` (เพิ่ม types ท้ายไฟล์)
- Create: `src/lib/places/status.ts`
- Test: `src/lib/places/status.test.ts`

**Interfaces:**
- Consumes: `isOpenNow(hours, now, status)` จาก `@/lib/places/hours` (คืน `"open" | "closed" | "closing_soon"`)
- Produces: `effectiveStatus(place, override, now): StatusResult` ที่ Task 9 + การอ่านสถานะฝั่ง server เรียกใช้

- [ ] **Step 1: เพิ่ม types ใน `src/lib/types.ts`** (ต่อท้ายไฟล์)

```ts
export type LiveStatus = "open" | "closed" | "closing_soon";
export type OverrideStatus = "open" | "closed";

/** ผู้ใช้ที่เข้าระบบด้วย LINE Login */
export type AppUser = {
  id: string;
  line_user_id: string;
  display_name: string;
  avatar_url: string | null;
};

/** สถานะเปิด-ปิดที่คนในท้องถิ่นแจ้งผ่าน LINE OA (override ข้อมูลอัตโนมัติ) */
export type PlaceStatusOverride = {
  id: string;
  place_id: string;
  status: OverrideStatus;
  note: string | null;
  reported_by: string; // line_user_id ของผู้แจ้ง
  created_at: string;
  expires_at: string;  // ISO; หลังเวลานี้ override หมดอายุ
};

/** ผู้ดูแลสถานที่ที่ verify แล้ว มีสิทธิ์แจ้งสถานะ */
export type PlaceReporter = {
  id: string;
  place_id: string;
  line_user_id: string;
  label: string; // เช่น "เจ้าของร้าน", "ผู้ดูแลตลาด"
  verified: boolean;
};
```

- [ ] **Step 2: เขียน test ที่ fail** — `src/lib/places/status.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { effectiveStatus } from "@/lib/places/status";
import type { OpeningHours } from "@/lib/types";

// อังคาร 30 มิ.ย. 2026 เวลา ~10:00 ICT (UTC 03:00) → ในเวลาทำการ (วันอังคาร = key 2)
const NOW = new Date("2026-06-30T03:00:00Z");
const OPEN_HOURS: OpeningHours = { 2: { open: "08:00", close: "17:00" } };
const place = { opening_hours: OPEN_HOURS, business_status: "OPERATIONAL" as const };

describe("effectiveStatus", () => {
  it("ไม่มี override → ใช้ข้อมูลอัตโนมัติ (auto)", () => {
    expect(effectiveStatus(place, null, NOW)).toEqual({ status: "open", source: "auto" });
  });

  it("override ปิด ยังไม่หมดอายุ → ใช้ของชุมชน (community) แม้เวลาเปิด", () => {
    const override = { status: "closed" as const, expires_at: "2026-06-30T12:00:00Z" };
    expect(effectiveStatus(place, override, NOW)).toEqual({ status: "closed", source: "community" });
  });

  it("override หมดอายุแล้ว → fallback กลับไป auto", () => {
    const override = { status: "closed" as const, expires_at: "2026-06-30T02:00:00Z" };
    expect(effectiveStatus(place, override, NOW)).toEqual({ status: "open", source: "auto" });
  });
});
```

- [ ] **Step 3: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/places/status.test.ts`
Expected: FAIL — "Cannot find module '@/lib/places/status'"

- [ ] **Step 4: เขียน implementation** — `src/lib/places/status.ts`

```ts
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
```

- [ ] **Step 5: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/places/status.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/places/status.ts src/lib/places/status.test.ts
git commit -m "feat(line): effectiveStatus + LINE domain types (community override beats auto)"
```
