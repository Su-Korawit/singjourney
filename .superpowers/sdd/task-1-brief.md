### Task 1: Scaffold โปรเจกต์ + Vitest

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.env.local.example`, `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/lib/route/geo.ts`, `src/lib/route/geo.test.ts` (ใช้พิสูจน์ว่า test รันได้)

**Interfaces:**
- Produces: `haversine(a: LatLng, b: LatLng): number` (กม.) — ใช้โดย Task 5

- [ ] **Step 1: สร้างโปรเจกต์ฐาน**

```bash
npx create-next-app@latest sing-journey --typescript --tailwind --app --src-dir --eslint --no-import-alias
cd sing-journey
npm install maplibre-gl @dnd-kit/core @dnd-kit/sortable @anthropic-ai/sdk @supabase/supabase-js zod
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: ตั้งค่า Vitest**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    environmentMatchGlobs: [["**/*.tsx", "jsdom"]],
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

`vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

เพิ่มใน `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.
ตั้ง `tsconfig.json` paths: `"@/*": ["./src/*"]`.

- [ ] **Step 3: เขียน failing test แรก** — `src/lib/route/geo.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { haversine } from "./geo";

describe("haversine", () => {
  it("คืน 0 เมื่อจุดเดียวกัน", () => {
    expect(haversine({ lat: 14.89, lng: 100.4 }, { lat: 14.89, lng: 100.4 })).toBe(0);
  });
  it("วัดระยะเมืองสิงห์บุรี→อินทร์บุรี ~16–22 กม.", () => {
    const d = haversine({ lat: 14.891, lng: 100.397 }, { lat: 15.012, lng: 100.327 });
    expect(d).toBeGreaterThan(12);
    expect(d).toBeLessThan(25);
  });
});
```

- [ ] **Step 4: รัน test ให้ FAIL**

Run: `npm test`
Expected: FAIL — "Cannot find module './geo'" หรือ "haversine is not a function"

- [ ] **Step 5: เขียน implementation ขั้นต่ำ** — `src/lib/route/geo.ts`

```ts
export type LatLng = { lat: number; lng: number };

export function haversine(a: LatLng, b: LatLng): number {
  if (a.lat === b.lat && a.lng === b.lng) return 0;
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
```

- [ ] **Step 6: รัน test ให้ PASS**

Run: `npm test`
Expected: PASS (2 tests)

- [ ] **Step 7: หน้าแรกขั้นต่ำ** — แก้ `src/app/page.tsx` ให้แสดงชื่อแบรนด์

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">Sing Journey</h1>
      <p className="text-lg text-gray-600">ผู้ช่วยวางแผนเที่ยวสิงห์บุรีด้วย AI</p>
    </main>
  );
}
```

Run: `npm run dev` → เปิด http://localhost:3000 เห็นชื่อแบรนด์

- [ ] **Step 8: `.env.local.example`**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
GOOGLE_PLACES_API_KEY=
```
เพิ่ม `.env.local` ใน `.gitignore` (create-next-app ใส่ให้แล้ว — ยืนยัน)

- [ ] **Step 9: Commit**

```bash
git init && git add -A
git commit -m "chore: scaffold Next.js + Tailwind + Vitest, add haversine"
```
