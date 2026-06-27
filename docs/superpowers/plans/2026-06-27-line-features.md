# LINE Login + แจ้งเตือน/รับแจ้งเปิด-ปิด (LINE Features) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
> **อ้างอิง:** ต่อยอดจาก `docs/IMPLEMENTATION_PLAN.md` §5.1 (LINE) + Phase 4/5 · คำศัพท์ `UBIQUITOUS_LANGUAGE.md` · โค้ดเดิม greenfield ที่ build แล้ว (Map/AI/Check-in/Watt's Up/Hours sync)

**Goal:** เพิ่มฟีเจอร์ LINE 3 อย่างที่เคลมไว้ในแบบฟอร์ม I-New Gen ให้ใช้งานได้จริง — (A) เข้าสู่ระบบด้วย LINE Login, (B) แจ้งเตือนผู้ใช้ผ่าน LINE เมื่อสถานที่เปลี่ยนสถานะ, (C) รับแจ้งเปิด-ปิดจากคนในท้องถิ่นผ่าน LINE OA แล้ว override สถานะให้สดกว่าข้อมูลอัตโนมัติของ Google

**Architecture:** Next.js App Router เป็น backend (API routes) ทั้งหมด. LINE Login ใช้ OAuth2 (authorize → callback → upsert `users` → ตั้ง cookie). LINE OA (Messaging API) มี webhook รับข้อความจากผู้ดูแลที่ verify แล้ว → เขียน override ลง `place_status_overrides`. ชั้นคำนวณสถานะ (`effectiveStatus`) ให้ override ชุมชนมาก่อน `isOpenNow` (Google) ภายในช่วง `expires_at`. logic ทุกชิ้นแยกเป็น pure function เพื่อ TDD; การเรียก LINE API ฉีด `fetchImpl` เข้าได้เพื่อ mock.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Supabase (`@supabase/supabase-js`) · LINE Login API + LINE Messaging API · Node `crypto` (HMAC ตรวจ signature) · Vitest + React Testing Library

## Global Constraints

ทุก task อยู่ภายใต้ข้อกำหนดเหล่านี้ (คัดจาก `docs/IMPLEMENTATION_PLAN.md` + convention ของโปรเจกต์):

- **API keys/secrets ฝั่ง server เท่านั้น:** `LINE_LOGIN_CHANNEL_ID`, `LINE_LOGIN_CHANNEL_SECRET`, `LINE_LOGIN_REDIRECT_URI`, `LINE_MESSAGING_CHANNEL_SECRET`, `LINE_MESSAGING_ACCESS_TOKEN` อยู่ใน `.env.local` อ่านได้เฉพาะใน API route / server module — **ห้ามตั้งชื่อขึ้นต้น `NEXT_PUBLIC_`** และห้าม import เข้า client component
- **Supabase:** ฝั่ง server ใช้ `createServerClient()` จาก `@/lib/supabase/server` (service role key) เท่านั้น
- **Test convention:** Vitest · ไฟล์ทดสอบวางข้าง source เป็น `*.test.ts(x)` · logic ใช้ environment `node` · component ใช้ `jsdom` + React Testing Library · **mock LINE API ด้วยการฉีด `fetchImpl`** และ **mock Supabase client ด้วย object + cast `as unknown as SupabaseClient`** (ไม่ยิง network จริงใน test)
- **ห้ามทำ test เดิมพัง:** `npm test` ต้องเขียวครบหลังทุก Task · ห้ามเปลี่ยนข้อความ/role ที่ test เดิมค้นหา โดยเฉพาะป้ายสถานะ **"เปิดอยู่" / "ปิดแล้ว" / "ใกล้ปิด"** ใน `HoursBadge` (ดู `src/components/places/HoursBadge.test.tsx`)
- **ภาษา UI = ไทย** · คงคำเฉพาะ: LINE Login, LINE OA, Roadmap, Real-time Info Sync
- **Run test:** ทั้งหมด `npm test` (= `vitest run`) · ทีละไฟล์ `npx vitest run <path>`
- **Commit บ่อย:** ทุก task จบด้วย commit ที่ test ผ่าน · ลงท้าย commit ด้วย `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## File Structure

**สร้างใหม่:**
- `src/lib/places/status.ts` — `effectiveStatus()` รวม override ชุมชน + `isOpenNow`
- `src/lib/places/status.test.ts`
- `supabase/migrations/0002_line_features.sql` — schema 3 ตาราง
- `supabase/migrations/0002_line_features.test.ts` — guard เนื้อหา SQL
- `src/lib/line/auth.ts` — `buildLineAuthUrl()`, `exchangeCodeForProfile()`, type `LineProfile`
- `src/lib/line/auth.test.ts`
- `src/lib/line/users.ts` — `upsertUserFromProfile()`
- `src/lib/line/users.test.ts`
- `src/lib/line/signature.ts` — `verifyLineSignature()`
- `src/lib/line/signature.test.ts`
- `src/lib/line/report.ts` — `parseStatusReport()`
- `src/lib/line/report.test.ts`
- `src/lib/line/webhook.ts` — `handleStatusReport()`
- `src/lib/line/webhook.test.ts`
- `src/lib/line/push.ts` — `pushLineMessage()`, `buildStatusMessage()`, `pushStatusToInterestedUsers()`
- `src/lib/line/push.test.ts`
- `src/app/api/auth/line/login/route.ts` — เริ่ม OAuth (redirect ไป LINE)
- `src/app/api/auth/line/callback/route.ts` — รับ code → upsert → cookie
- `src/app/api/line/webhook/route.ts` — รับ event จาก LINE OA

**แก้ไข:**
- `src/lib/types.ts` — เพิ่ม `AppUser`, `LiveStatus`, `OverrideStatus`, `PlaceStatusOverride`, `PlaceReporter`
- `src/components/places/HoursBadge.tsx` — รับ `override` + ป้าย "อัปเดตโดยชุมชน"
- `src/components/places/HoursBadge.test.tsx` — เพิ่มเคส community
- `src/components/shell/Header.tsx` — ปุ่ม "เข้าสู่ระบบด้วย LINE"
- `.env.local.example` — เพิ่ม env LINE 5 ตัว

---

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

---

### Task 2: Supabase schema (users, place_reporters, place_status_overrides)

**Files:**
- Create: `supabase/migrations/0002_line_features.sql`
- Test: `supabase/migrations/0002_line_features.test.ts`

**Interfaces:**
- Produces: ตาราง `users`, `place_reporters`, `place_status_overrides` ที่ Task 4/7/8 query/insert

- [ ] **Step 1: เขียน test ที่ fail** — `supabase/migrations/0002_line_features.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(
  join(process.cwd(), "supabase/migrations/0002_line_features.sql"),
  "utf8",
);

describe("0002_line_features.sql", () => {
  it("สร้างตาราง users พร้อม line_user_id", () => {
    expect(sql).toMatch(/create table if not exists users/i);
    expect(sql).toContain("line_user_id");
  });
  it("สร้างตาราง place_reporters พร้อม verified", () => {
    expect(sql).toMatch(/create table if not exists place_reporters/i);
    expect(sql).toContain("verified");
  });
  it("สร้างตาราง place_status_overrides จำกัด status เป็น open/closed", () => {
    expect(sql).toMatch(/create table if not exists place_status_overrides/i);
    expect(sql).toMatch(/status in \('open','closed'\)/);
    expect(sql).toContain("expires_at");
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run supabase/migrations/0002_line_features.test.ts`
Expected: FAIL — ENOENT ไม่พบไฟล์ SQL

- [ ] **Step 3: เขียน SQL** — `supabase/migrations/0002_line_features.sql`

```sql
-- ผู้ใช้ที่เข้าระบบด้วย LINE Login
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  line_user_id text unique not null,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ผู้ดูแลสถานที่ที่ verify แล้ว (มีสิทธิ์แจ้งเปิด-ปิดผ่าน LINE OA)
create table if not exists place_reporters (
  id uuid primary key default gen_random_uuid(),
  place_id text not null references places(id),
  line_user_id text not null,
  label text not null default 'ผู้ดูแล',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (place_id, line_user_id)
);

-- override สถานะเปิด-ปิดที่ชุมชนแจ้งเข้ามา
create table if not exists place_status_overrides (
  id uuid primary key default gen_random_uuid(),
  place_id text not null references places(id),
  status text not null check (status in ('open','closed')),
  note text,
  reported_by text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create index if not exists idx_overrides_place_active
  on place_status_overrides (place_id, expires_at desc);
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run supabase/migrations/0002_line_features.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: ลงมือ apply ที่ Supabase** (manual — ไม่ใช่ test)

รัน SQL นี้ใน Supabase SQL Editor ของโปรเจกต์จริง (หรือผ่าน `supabase db push` ถ้าใช้ Supabase CLI) เพื่อให้ตารางมีอยู่จริงก่อน Task 4/7/8 จะ query ได้

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/0002_line_features.sql supabase/migrations/0002_line_features.test.ts
git commit -m "feat(line): supabase schema for users + community status reports"
```

---

### Task 3: LINE Login auth helpers (URL builder + token/profile exchange)

**Files:**
- Create: `src/lib/line/auth.ts`
- Test: `src/lib/line/auth.test.ts`

**Interfaces:**
- Produces:
  - `buildLineAuthUrl({ channelId, redirectUri, state }): string`
  - `exchangeCodeForProfile({ code, channelId, channelSecret, redirectUri, fetchImpl? }): Promise<LineProfile>`
  - `type LineProfile = { userId: string; displayName: string; pictureUrl?: string }`
  - ใช้โดย Task 4 (routes + upsert)

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/auth.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import { buildLineAuthUrl, exchangeCodeForProfile } from "@/lib/line/auth";

describe("buildLineAuthUrl", () => {
  it("ใส่ params ครบและชี้ปลายทาง LINE authorize", () => {
    const url = buildLineAuthUrl({
      channelId: "1234",
      redirectUri: "https://app.test/api/auth/line/callback",
      state: "xyz",
    });
    expect(url).toContain("https://access.line.me/oauth2/v2.1/authorize");
    expect(url).toContain("response_type=code");
    expect(url).toContain("client_id=1234");
    expect(url).toContain("state=xyz");
    expect(url).toContain("scope=profile");
  });
});

describe("exchangeCodeForProfile", () => {
  it("แลก code เป็น token แล้วดึงโปรไฟล์", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "tok" }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ userId: "U1", displayName: "ปอนด์", pictureUrl: "http://img" }),
      });
    const profile = await exchangeCodeForProfile({
      code: "code1",
      channelId: "1234",
      channelSecret: "secret",
      redirectUri: "https://app.test/cb",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(profile).toEqual({ userId: "U1", displayName: "ปอนด์", pictureUrl: "http://img" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("token ล้มเหลว → โยน error", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce({ ok: false, status: 400 });
    await expect(
      exchangeCodeForProfile({
        code: "x",
        channelId: "1",
        channelSecret: "s",
        redirectUri: "r",
        fetchImpl: fetchImpl as unknown as typeof fetch,
      }),
    ).rejects.toThrow(/token/i);
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/auth.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/auth'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/auth.ts`

```ts
const AUTHORIZE_URL = "https://access.line.me/oauth2/v2.1/authorize";
const TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const PROFILE_URL = "https://api.line.me/v2/profile";

export type LineProfile = {
  userId: string;
  displayName: string;
  pictureUrl?: string;
};

export function buildLineAuthUrl(opts: {
  channelId: string;
  redirectUri: string;
  state: string;
}): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: opts.channelId,
    redirect_uri: opts.redirectUri,
    state: opts.state,
    scope: "profile openid",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCodeForProfile(opts: {
  code: string;
  channelId: string;
  channelSecret: string;
  redirectUri: string;
  fetchImpl?: typeof fetch;
}): Promise<LineProfile> {
  const f = opts.fetchImpl ?? fetch;
  const tokenRes = await f(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      redirect_uri: opts.redirectUri,
      client_id: opts.channelId,
      client_secret: opts.channelSecret,
    }).toString(),
  });
  if (!tokenRes.ok) throw new Error(`LINE token exchange failed: ${tokenRes.status}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profRes = await f(PROFILE_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profRes.ok) throw new Error(`LINE profile fetch failed: ${profRes.status}`);
  return (await profRes.json()) as LineProfile;
}
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/auth.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/line/auth.ts src/lib/line/auth.test.ts
git commit -m "feat(line): LINE Login auth helpers (authorize url + code→profile)"
```

---

### Task 4: User upsert + Login/Callback routes + Header button + env

**Files:**
- Create: `src/lib/line/users.ts`
- Test: `src/lib/line/users.test.ts`
- Create: `src/app/api/auth/line/login/route.ts`
- Create: `src/app/api/auth/line/callback/route.ts`
- Modify: `src/components/shell/Header.tsx`
- Modify: `.env.local.example`

**Interfaces:**
- Consumes: `exchangeCodeForProfile`, `LineProfile` (Task 3); `createServerClient` (`@/lib/supabase/server`); `AppUser` (Task 1)
- Produces: `upsertUserFromProfile(supabase, profile): Promise<AppUser>`

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/users.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { upsertUserFromProfile } from "@/lib/line/users";

function mockSupabase(returned: unknown) {
  const single = vi.fn().mockResolvedValue({ data: returned, error: null });
  const select = vi.fn(() => ({ single }));
  const upsert = vi.fn(() => ({ select }));
  const from = vi.fn(() => ({ upsert }));
  return { client: { from } as unknown as SupabaseClient, upsert };
}

describe("upsertUserFromProfile", () => {
  it("upsert ตาม line_user_id แล้วคืน AppUser", async () => {
    const row = { id: "u1", line_user_id: "U1", display_name: "ปอนด์", avatar_url: null };
    const { client, upsert } = mockSupabase(row);
    const user = await upsertUserFromProfile(client, {
      userId: "U1",
      displayName: "ปอนด์",
    });
    expect(user).toEqual(row);
    expect(upsert).toHaveBeenCalledWith(
      { line_user_id: "U1", display_name: "ปอนด์", avatar_url: null },
      { onConflict: "line_user_id" },
    );
  });

  it("error → throw", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "x" } });
    const client = {
      from: () => ({ upsert: () => ({ select: () => ({ single }) }) }),
    } as unknown as SupabaseClient;
    await expect(
      upsertUserFromProfile(client, { userId: "U1", displayName: "ปอนด์" }),
    ).rejects.toThrow(/upsert/i);
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/users.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/users'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/users.ts`

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AppUser } from "@/lib/types";
import type { LineProfile } from "@/lib/line/auth";

export async function upsertUserFromProfile(
  supabase: SupabaseClient,
  profile: LineProfile,
): Promise<AppUser> {
  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        line_user_id: profile.userId,
        display_name: profile.displayName,
        avatar_url: profile.pictureUrl ?? null,
      },
      { onConflict: "line_user_id" },
    )
    .select()
    .single();
  if (error || !data) throw new Error("upsert user failed");
  return data as AppUser;
}
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/users.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: เขียน login route** — `src/app/api/auth/line/login/route.ts`

```ts
import { NextResponse } from "next/server";
import { buildLineAuthUrl } from "@/lib/line/auth";

export async function GET(req: Request) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const redirectUri = process.env.LINE_LOGIN_REDIRECT_URI;

  // Fallback เดโม: ถ้ายังไม่ตั้งค่า LINE → ตั้ง mock user แล้วกลับหน้าแรก (ปุ่ม/flow ยังเดินได้)
  if (!channelId || !redirectUri) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("sj_uid", "mock-user", { httpOnly: true, path: "/" });
    return res;
  }

  const state = crypto.randomUUID();
  const res = NextResponse.redirect(buildLineAuthUrl({ channelId, redirectUri, state }));
  res.cookies.set("sj_oauth_state", state, { httpOnly: true, path: "/", maxAge: 600 });
  return res;
}
```

- [ ] **Step 6: เขียน callback route** — `src/app/api/auth/line/callback/route.ts`

```ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForProfile } from "@/lib/line/auth";
import { upsertUserFromProfile } from "@/lib/line/users";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const jar = await cookies();
  const expectedState = jar.get("sj_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/?login=error", req.url));
  }

  const profile = await exchangeCodeForProfile({
    code,
    channelId: process.env.LINE_LOGIN_CHANNEL_ID!,
    channelSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
    redirectUri: process.env.LINE_LOGIN_REDIRECT_URI!,
  });
  const user = await upsertUserFromProfile(createServerClient(), profile);

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("sj_uid", user.id, { httpOnly: true, path: "/" });
  return res;
}
```

- [ ] **Step 7: เพิ่มปุ่ม LINE ใน Header** — `src/components/shell/Header.tsx`

ใน desktop nav แทรกปุ่มต่อท้าย `</nav>` ตัวแรก (บรรทัด `</nav>` ก่อนปุ่ม hamburger):

```tsx
        <a
          href="/api/auth/line/login"
          className="hidden rounded-full bg-[#06C755] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 md:inline-block"
        >
          เข้าสู่ระบบด้วย LINE
        </a>
```

และใน mobile nav (`<div className="mx-auto flex max-w-6xl flex-col gap-2">` หลัง map ของ navigationItems) แทรก:

```tsx
          <a
            href="/api/auth/line/login"
            className="rounded-card bg-[#06C755] px-3 py-2 text-center text-sm font-bold text-white"
          >
            เข้าสู่ระบบด้วย LINE
          </a>
```

- [ ] **Step 8: เพิ่ม env** — ต่อท้าย `.env.local.example`

```
LINE_LOGIN_CHANNEL_ID=
LINE_LOGIN_CHANNEL_SECRET=
LINE_LOGIN_REDIRECT_URI=
LINE_MESSAGING_CHANNEL_SECRET=
LINE_MESSAGING_ACCESS_TOKEN=
```

- [ ] **Step 9: รัน test ทั้งชุดให้เขียว** (กัน Header test พัง)

Run: `npm test`
Expected: PASS ครบ (รวม `Header.test.tsx` เดิม)

- [ ] **Step 10: Commit**

```bash
git add src/lib/line/users.ts src/lib/line/users.test.ts src/app/api/auth/line src/components/shell/Header.tsx .env.local.example
git commit -m "feat(line): LINE Login routes + user upsert + header button + env"
```

---

### Task 5: ตรวจ LINE webhook signature (HMAC-SHA256)

**Files:**
- Create: `src/lib/line/signature.ts`
- Test: `src/lib/line/signature.test.ts`

**Interfaces:**
- Produces: `verifyLineSignature(channelSecret, rawBody, signature): boolean` ใช้โดย Task 7

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/signature.test.ts`

```ts
import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyLineSignature } from "@/lib/line/signature";

const SECRET = "test-channel-secret";
const BODY = JSON.stringify({ events: [] });
const validSig = crypto.createHmac("sha256", SECRET).update(BODY).digest("base64");

describe("verifyLineSignature", () => {
  it("signature ถูกต้อง → true", () => {
    expect(verifyLineSignature(SECRET, BODY, validSig)).toBe(true);
  });
  it("signature ผิด → false", () => {
    expect(verifyLineSignature(SECRET, BODY, "wrong")).toBe(false);
  });
  it("ไม่มี signature → false", () => {
    expect(verifyLineSignature(SECRET, BODY, null)).toBe(false);
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/signature.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/signature'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/signature.ts`

```ts
import crypto from "node:crypto";

export function verifyLineSignature(
  channelSecret: string,
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/signature.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/line/signature.ts src/lib/line/signature.test.ts
git commit -m "feat(line): verify LINE webhook signature (HMAC-SHA256, timing-safe)"
```

---

### Task 6: แปลงข้อความแจ้งสถานะเป็น report (`parseStatusReport`)

**Files:**
- Create: `src/lib/line/report.ts`
- Test: `src/lib/line/report.test.ts`

**Interfaces:**
- Consumes: `OverrideStatus` (Task 1)
- Produces: `parseStatusReport(text, places): { placeId: string; status: OverrideStatus } | null` ใช้โดย Task 7

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/report.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { parseStatusReport } from "@/lib/line/report";

const PLACES = [
  { id: "p1", name: "วัดพระนอนจักรสีห์" },
  { id: "p2", name: "ตลาดไทยย้อนยุค" },
];

describe("parseStatusReport", () => {
  it("ข้อความ 'ปิด' + ชื่อสถานที่ → closed", () => {
    expect(parseStatusReport("วันนี้ปิด วัดพระนอนจักรสีห์", PLACES)).toEqual({
      placeId: "p1",
      status: "closed",
    });
  });
  it("ข้อความ 'เปิดแล้ว' (มี ปิด ซ้อนใน เปิด) → open ไม่ใช่ closed", () => {
    expect(parseStatusReport("เปิดแล้ว ตลาดไทยย้อนยุค", PLACES)).toEqual({
      placeId: "p2",
      status: "open",
    });
  });
  it("ไม่มีคำว่าเปิด/ปิด → null", () => {
    expect(parseStatusReport("สวัสดีครับ", PLACES)).toBeNull();
  });
  it("จับคู่สถานที่ไม่ได้ → null", () => {
    expect(parseStatusReport("ปิด ร้านที่ไม่อยู่ในระบบ", PLACES)).toBeNull();
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/report.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/report'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/report.ts`

```ts
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
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/report.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/line/report.ts src/lib/line/report.test.ts
git commit -m "feat(line): parse open/close report text → place + status"
```

---

### Task 7: บันทึก override จากผู้ดูแลที่ verify (`handleStatusReport`) + webhook route

**Files:**
- Create: `src/lib/line/webhook.ts`
- Test: `src/lib/line/webhook.test.ts`
- Create: `src/app/api/line/webhook/route.ts`

**Interfaces:**
- Consumes: `verifyLineSignature` (5), `parseStatusReport` (6), `createServerClient`, `Place`, `OverrideStatus`
- Produces: `handleStatusReport(supabase, lineUserId, parsed, now): Promise<"saved" | "unauthorized">`

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/webhook.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { handleStatusReport } from "@/lib/line/webhook";

function mockSupabase(reporter: { verified: boolean } | null) {
  const insert = vi.fn().mockResolvedValue({ data: null, error: null });
  const maybeSingle = vi.fn().mockResolvedValue({ data: reporter, error: null });
  const client = {
    from: (table: string) => {
      if (table === "place_reporters") {
        return {
          select: () => ({ eq: () => ({ eq: () => ({ maybeSingle }) }) }),
        };
      }
      return { insert };
    },
  } as unknown as SupabaseClient;
  return { client, insert };
}

const NOW = new Date("2026-06-30T03:00:00Z");

describe("handleStatusReport", () => {
  it("ผู้แจ้ง verified → insert override แล้วคืน 'saved'", async () => {
    const { client, insert } = mockSupabase({ verified: true });
    const result = await handleStatusReport(
      client,
      "U1",
      { placeId: "p1", status: "closed" },
      NOW,
    );
    expect(result).toBe("saved");
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        place_id: "p1",
        status: "closed",
        reported_by: "U1",
        expires_at: "2026-06-30T15:00:00.000Z", // +12 ชม.
      }),
    );
  });

  it("ผู้แจ้งไม่ได้ verify → 'unauthorized' ไม่ insert", async () => {
    const { client, insert } = mockSupabase({ verified: false });
    const result = await handleStatusReport(
      client,
      "U1",
      { placeId: "p1", status: "closed" },
      NOW,
    );
    expect(result).toBe("unauthorized");
    expect(insert).not.toHaveBeenCalled();
  });

  it("ไม่พบผู้แจ้ง → 'unauthorized'", async () => {
    const { client, insert } = mockSupabase(null);
    expect(await handleStatusReport(client, "U1", { placeId: "p1", status: "open" }, NOW)).toBe(
      "unauthorized",
    );
    expect(insert).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/webhook.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/webhook'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/webhook.ts`

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";

const OVERRIDE_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

export async function handleStatusReport(
  supabase: SupabaseClient,
  lineUserId: string,
  parsed: { placeId: string; status: OverrideStatus },
  now: Date,
): Promise<"saved" | "unauthorized"> {
  const { data: reporter } = await supabase
    .from("place_reporters")
    .select("verified")
    .eq("place_id", parsed.placeId)
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (!reporter || !(reporter as { verified: boolean }).verified) {
    return "unauthorized";
  }

  await supabase.from("place_status_overrides").insert({
    place_id: parsed.placeId,
    status: parsed.status,
    reported_by: lineUserId,
    expires_at: new Date(now.getTime() + OVERRIDE_TTL_MS).toISOString(),
  });
  return "saved";
}
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/webhook.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: เขียน webhook route** — `src/app/api/line/webhook/route.ts`

```ts
import { NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/signature";
import { parseStatusReport } from "@/lib/line/report";
import { handleStatusReport } from "@/lib/line/webhook";
import { createServerClient } from "@/lib/supabase/server";
import type { Place } from "@/lib/types";

type LineEvent = {
  type: string;
  source?: { userId?: string };
  message?: { type: string; text?: string };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-line-signature");
  const secret = process.env.LINE_MESSAGING_CHANNEL_SECRET ?? "";
  if (!verifyLineSignature(secret, raw, signature)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const body = JSON.parse(raw) as { events: LineEvent[] };
  const supabase = createServerClient();
  const { data: places } = await supabase.from("places").select("id, name");
  const placeList = (places ?? []) as Pick<Place, "id" | "name">[];

  for (const ev of body.events) {
    if (ev.type !== "message" || ev.message?.type !== "text" || !ev.source?.userId) continue;
    const parsed = parseStatusReport(ev.message.text ?? "", placeList);
    if (!parsed) continue;
    await handleStatusReport(supabase, ev.source.userId, parsed, new Date());
  }
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/line/webhook.ts src/lib/line/webhook.test.ts src/app/api/line/webhook/route.ts
git commit -m "feat(line): LINE OA webhook → save community status override (verified reporters)"
```

---

### Task 8: แจ้งเตือนผ่าน LINE (push) เมื่อสถานะเปลี่ยน

**Files:**
- Create: `src/lib/line/push.ts`
- Test: `src/lib/line/push.test.ts`
- Modify: `src/lib/line/webhook.ts` (เรียก push หลังบันทึก override)
- Modify: `src/lib/line/webhook.test.ts` (ปรับ signature ของ `handleStatusReport`)

**Interfaces:**
- Produces:
  - `buildStatusMessage(placeName, status): string`
  - `pushLineMessage({ to, text, accessToken, fetchImpl? }): Promise<void>`
  - `pushStatusToInterestedUsers(supabase, placeId, placeName, status, deps): Promise<number>` (คืนจำนวนคนที่ push) — เรียกหลังบันทึก override

- [ ] **Step 1: เขียน test ที่ fail** — `src/lib/line/push.test.ts`

```ts
import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildStatusMessage,
  pushLineMessage,
  pushStatusToInterestedUsers,
} from "@/lib/line/push";

describe("buildStatusMessage", () => {
  it("closed → ข้อความปิด", () => {
    expect(buildStatusMessage("วัดพระนอนจักรสีห์", "closed")).toContain("วัดพระนอนจักรสีห์");
    expect(buildStatusMessage("วัดพระนอนจักรสีห์", "closed")).toContain("ปิด");
  });
});

describe("pushLineMessage", () => {
  it("POST ไป LINE push endpoint พร้อม Bearer + ข้อความ", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true });
    await pushLineMessage({
      to: "U1",
      text: "ทดสอบ",
      accessToken: "tok",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.line.me/v2/bot/message/push",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer tok" }),
      }),
    );
  });
});

describe("pushStatusToInterestedUsers", () => {
  it("ส่งหาผู้ที่เคยเช็คอินสถานที่นี้ทุกคน", async () => {
    const client = {
      from: (table: string) => {
        if (table === "checkins") {
          return { select: () => ({ eq: () => Promise.resolve({ data: [{ user_id: "u1" }, { user_id: "u2" }] }) }) };
        }
        return { select: () => ({ in: () => Promise.resolve({ data: [{ line_user_id: "U1" }, { line_user_id: "U2" }] }) }) };
      },
    } as unknown as SupabaseClient;
    const push = vi.fn().mockResolvedValue(undefined);

    const count = await pushStatusToInterestedUsers(
      client,
      "p1",
      "วัดพระนอนจักรสีห์",
      "closed",
      { push, accessToken: "tok" },
    );
    expect(count).toBe(2);
    expect(push).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/lib/line/push.test.ts`
Expected: FAIL — "Cannot find module '@/lib/line/push'"

- [ ] **Step 3: เขียน implementation** — `src/lib/line/push.ts`

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";

const PUSH_URL = "https://api.line.me/v2/bot/message/push";

export function buildStatusMessage(placeName: string, status: OverrideStatus): string {
  return status === "closed"
    ? `แจ้งเตือน: "${placeName}" ปิดให้บริการชั่วคราว (อัปเดตโดยชุมชน) ตรวจสอบก่อนเดินทางนะ`
    : `ข่าวดี: "${placeName}" กลับมาเปิดให้บริการแล้ว (อัปเดตโดยชุมชน)`;
}

export async function pushLineMessage(opts: {
  to: string;
  text: string;
  accessToken: string;
  fetchImpl?: typeof fetch;
}): Promise<void> {
  const f = opts.fetchImpl ?? fetch;
  const res = await f(PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.accessToken}`,
    },
    body: JSON.stringify({ to: opts.to, messages: [{ type: "text", text: opts.text }] }),
  });
  if (!res.ok) throw new Error(`LINE push failed: ${res.status}`);
}

export async function pushStatusToInterestedUsers(
  supabase: SupabaseClient,
  placeId: string,
  placeName: string,
  status: OverrideStatus,
  deps: {
    accessToken: string;
    push?: (opts: {
      to: string;
      text: string;
      accessToken: string;
      fetchImpl?: typeof fetch;
    }) => Promise<void>;
  },
): Promise<number> {
  const push = deps.push ?? pushLineMessage;
  const { data: checkins } = await supabase
    .from("checkins")
    .select("user_id")
    .eq("place_id", placeId);
  const userIds = [...new Set((checkins ?? []).map((c: { user_id: string }) => c.user_id))];
  if (userIds.length === 0) return 0;

  const { data: users } = await supabase
    .from("users")
    .select("line_user_id")
    .in("id", userIds);
  const recipients = (users ?? []).map((u: { line_user_id: string }) => u.line_user_id);

  const text = buildStatusMessage(placeName, status);
  await Promise.all(
    recipients.map((to) => push({ to, text, accessToken: deps.accessToken })),
  );
  return recipients.length;
}
```

- [ ] **Step 4: รัน test ให้ผ่าน**

Run: `npx vitest run src/lib/line/push.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: เรียก push หลังบันทึก override** — แก้ `src/lib/line/webhook.ts`

เปลี่ยนให้หลัง insert override สำเร็จ ดึงชื่อสถานที่แล้วแจ้งเตือนผู้สนใจ (best-effort — ไม่ให้ push ล้มทำ webhook พัง):

```ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";
import { pushStatusToInterestedUsers } from "@/lib/line/push";

const OVERRIDE_TTL_MS = 12 * 60 * 60 * 1000; // 12 ชั่วโมง

export async function handleStatusReport(
  supabase: SupabaseClient,
  lineUserId: string,
  parsed: { placeId: string; status: OverrideStatus },
  now: Date,
): Promise<"saved" | "unauthorized"> {
  const { data: reporter } = await supabase
    .from("place_reporters")
    .select("verified")
    .eq("place_id", parsed.placeId)
    .eq("line_user_id", lineUserId)
    .maybeSingle();

  if (!reporter || !(reporter as { verified: boolean }).verified) {
    return "unauthorized";
  }

  await supabase.from("place_status_overrides").insert({
    place_id: parsed.placeId,
    status: parsed.status,
    reported_by: lineUserId,
    expires_at: new Date(now.getTime() + OVERRIDE_TTL_MS).toISOString(),
  });

  const accessToken = process.env.LINE_MESSAGING_ACCESS_TOKEN;
  if (accessToken) {
    const { data: place } = await supabase
      .from("places")
      .select("name")
      .eq("id", parsed.placeId)
      .maybeSingle();
    const placeName = (place as { name?: string } | null)?.name ?? "สถานที่";
    try {
      await pushStatusToInterestedUsers(supabase, parsed.placeId, placeName, parsed.status, {
        accessToken,
      });
    } catch {
      /* push ล้มเหลวไม่ควรทำให้การบันทึก override ล้ม */
    }
  }
  return "saved";
}
```

- [ ] **Step 6: อัปเดต mock ใน `src/lib/line/webhook.test.ts`** ให้รองรับ branch ใหม่

ใน `mockSupabase` เพิ่มการรองรับ table `places` (มี `.eq().maybeSingle()`) — แต่เนื่องจาก test ไม่ตั้ง `LINE_MESSAGING_ACCESS_TOKEN` ส่วน push จะถูกข้าม ทำให้ assertion เดิมยังผ่าน ตรวจว่า `process.env.LINE_MESSAGING_ACCESS_TOKEN` ไม่ถูกตั้งในชุดเทสต์ (ถ้าตั้งไว้ใน env เครื่อง ให้เพิ่มบรรทัดนี้บนสุดของไฟล์เทสต์):

```ts
import { beforeEach } from "vitest";
beforeEach(() => {
  delete process.env.LINE_MESSAGING_ACCESS_TOKEN;
});
```

- [ ] **Step 7: รัน test ทั้งสองไฟล์ให้เขียว**

Run: `npx vitest run src/lib/line/webhook.test.ts src/lib/line/push.test.ts`
Expected: PASS ครบ

- [ ] **Step 8: Commit**

```bash
git add src/lib/line/push.ts src/lib/line/push.test.ts src/lib/line/webhook.ts src/lib/line/webhook.test.ts
git commit -m "feat(line): push LINE notification to interested users on status change"
```

---

### Task 9: แสดง override ชุมชนใน HoursBadge (ป้าย "อัปเดตโดยชุมชน")

**Files:**
- Modify: `src/components/places/HoursBadge.tsx`
- Modify: `src/components/places/HoursBadge.test.tsx`

**Interfaces:**
- Consumes: `effectiveStatus` (Task 1); `OverrideStatus` (Task 1)
- Produces: `HoursBadge` รับ prop ใหม่ `override?: { status: OverrideStatus; expires_at: string } | null` (default `null` = พฤติกรรมเดิม)

- [ ] **Step 1: เพิ่ม test เคส community** — `src/components/places/HoursBadge.test.tsx`

ไฟล์เดิมมี import ครบแล้ว (`render`, `screen`, `it`, `expect`, `HoursBadge`, type `Place`) และมีตัวแปร `base: Place` อยู่แล้ว — **อย่าเพิ่ม import หรือ `base` ซ้ำ** และอย่าลบเทสต์เดิม ("เปิดอยู่"/"ปิดแล้ว") ให้ **แทรก `it` ใหม่นี้ภายใน `describe("HoursBadge", () => { ... })` ที่มีอยู่** (override ที่ยังไม่หมดอายุชนะข้อมูลเวลาเสมอ จึงไม่ขึ้นกับวัน/เวลา):

```tsx
  it("override ชุมชนปิด → แสดง 'ปิดแล้ว' + 'อัปเดตโดยชุมชน'", () => {
    render(
      <HoursBadge
        place={base}
        now={new Date("2026-06-29T10:00:00+07:00")}
        override={{ status: "closed", expires_at: "2026-07-01T00:00:00Z" }}
      />,
    );
    expect(screen.getByText("ปิดแล้ว")).toBeInTheDocument();
    expect(screen.getByText("อัปเดตโดยชุมชน")).toBeInTheDocument();
  });
```

- [ ] **Step 2: รัน test ให้เห็นว่า fail**

Run: `npx vitest run src/components/places/HoursBadge.test.tsx`
Expected: FAIL — ไม่พบข้อความ "อัปเดตโดยชุมชน" (prop `override` ยังไม่รองรับ)

- [ ] **Step 3: แก้ implementation** — `src/components/places/HoursBadge.tsx`

```tsx
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
```

- [ ] **Step 4: รัน test ให้ผ่าน (รวมเทสต์เดิม)**

Run: `npx vitest run src/components/places/HoursBadge.test.tsx`
Expected: PASS ครบ (เคสเดิม + เคส community)

- [ ] **Step 5: เชื่อม override ตอนเรนเดอร์จริง** (manual wiring — ที่หน้าที่ render `HoursBadge`)

ที่ฝั่ง server (เช่นใน server component/route ที่โหลด place) ดึง override ล่าสุดที่ยังไม่หมดอายุ แล้วส่งเข้า prop:

```ts
// ตัวอย่างการอ่าน override ล่าสุดของ place (ใช้ในที่ที่โหลดข้อมูล place)
const { data: ov } = await supabase
  .from("place_status_overrides")
  .select("status, expires_at")
  .eq("place_id", place.id)
  .gt("expires_at", new Date().toISOString())
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();
// แล้วส่ง: <HoursBadge place={place} override={ov as { status: OverrideStatus; expires_at: string } | null} />
```

- [ ] **Step 6: รัน test ทั้งโปรเจกต์ให้เขียวก่อน commit**

Run: `npm test`
Expected: PASS ครบทุกไฟล์

- [ ] **Step 7: Commit**

```bash
git add src/components/places/HoursBadge.tsx src/components/places/HoursBadge.test.tsx
git commit -m "feat(line): show community override + 'อัปเดตโดยชุมชน' badge in HoursBadge"
```

---

## หมายเหตุการตั้งค่าจริง (นอกโค้ด — ทำก่อน demo รอบตัดสิน)
- สร้าง **LINE Login channel** + **Messaging API channel (LINE OA)** ใน LINE Developers Console → กรอก env 5 ตัว
- ตั้ง **Webhook URL** ของ LINE OA = `https://<โดเมน>/api/line/webhook` แล้วเปิด "Use webhook"
- เพิ่มผู้ดูแลสถานที่ลงตาราง `place_reporters` (`verified = true`) สำหรับเจ้าของร้าน/ตลาดที่ทดสอบจริง
- ตั้ง **Callback URL** ของ LINE Login = `https://<โดเมน>/api/auth/line/callback`
