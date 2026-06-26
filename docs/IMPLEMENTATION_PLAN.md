# Sing Journey — Implementation Plan (สำหรับ build เดโม)

เอกสารนี้คือแผนทางเทคนิคเตรียมไว้สำหรับลงมือ build เดโมหลังส่งเอกสาร
Scope เดโม: **AI วางแผนทริป + Map roadmap (ลากวาง) + ข้อมูลเปิด-ปิดจริงเรียลไทม์ + Check-in ไอเทม 3D + Watt's Up!**
ตัดออกจากเดโม: การจองโรงแรม + โค้ดส่วนลดจริง (แสดงเป็น mock/UI เท่านั้น)

---

## 1. Tech Stack (ตัดสินใจแล้ว)

| ส่วน | เทคโนโลยี | เหตุผล |
|---|---|---|
| Frontend | **Next.js (App Router) + React + TypeScript + Tailwind CSS** | build เร็ว, deploy ง่าย, PWA ได้ |
| แผนที่ + เส้นทาง | **MapLibre GL JS** + free tiles | โอเพนซอร์ส วาด route/marker บนแผนที่จริงได้ ไม่มีค่า API |
| 3D Item | **`<model-viewer>`** (Google) | โหลดโมเดล glTF/GLB หมุนได้ในเว็บ น้ำหนักเบา ทำง่ายสุด |
| AI Planner | **Claude API** (`claude-opus-4-8`) | วิเคราะห์โปรไฟล์ + วางแผน, ใช้ structured output คืน JSON |
| ข้อมูลเปิด-ปิดจริง | **Google Places API** (Place Details) | ดึง `opening_hours` + `business_status` จริงของแต่ละสถานที่ เพื่อความแม่นยำในการเดินทาง |
| Auth / DB / Storage | **Supabase** + **LINE Login** | Postgres + Auth + Storage ครบ, ตรงกับ mockup ที่มีปุ่ม LINE |
| Drag & Drop | **dnd-kit** | ลากวางลำดับสถานที่ลื่นไหล |
| Deploy | **Vercel** | ต่อ Next.js ตรง, ฟรี tier พอสำหรับเดโม |

> ทางเลือกประหยัด: ถ้าค่าเรียก AI สูง สลับ planner เป็น `claude-sonnet-4-6` (input $3 / output $15 ต่อ 1M tokens) สำหรับงาน volume สูง

---

## 2. สถาปัตยกรรมระบบ (ภาพรวม)

```
[ผู้ใช้/เบราว์เซอร์ PWA]
   │  LINE Login
   ▼
[Next.js Frontend] ──> [Next.js API Routes] ──> [Claude API]  (วางแผนทริป)
   │                          │
   │                          ├──> [Google Places API]  (ดึงเวลาเปิด-ปิดจริง — cron/on-demand)
   │                          │
   │                          └──> [Supabase: users, places, trips, items, checkins]
   ▼
[MapLibre]  วาด roadmap + markers
[model-viewer]  แสดงไอเทม 3D
```

**สำคัญ:** API key ของ Claude **และ Google Places** อยู่ฝั่ง server (API route) เท่านั้น — ห้ามเรียกจาก client โดยตรง

---

## 3. Data Model (Supabase / Postgres)

- `users` — id, line_user_id, display_name, avatar_url, profile (jsonb: ไลฟ์สไตล์/งบ/ผู้ร่วมเดินทาง)
- `places` — id, district (อำเภอ), name, lat, lng, category (historical/cultural/temple/adventure/food/kids), description, image_url, avg_price, **google_place_id** (FK ไป Google Places), **opening_hours** (jsonb: เวลาเปิด-ปิดรายวัน), **business_status** (OPERATIONAL/CLOSED_TEMPORARILY/CLOSED_PERMANENTLY), **hours_last_synced** (timestamp อัปเดตล่าสุด)
- `temples` — id, place_id (FK), history, famous_monk, merit_info  ← สำหรับ Watt's Up!
- `trips` — id, user_id, title, days, status, route (jsonb: ลำดับ place_id ต่อวัน)
- `items_3d` — id, name, type (souvenir/discount), model_url (.glb), place_id, is_consumable
- `checkins` — id, user_id, place_id, item_id, created_at
- `user_items` — id, user_id, item_id, used (bool)  ← collection + คูปองใช้แล้วหมดไป

---

## 4. AI Planner — สัญญาการเรียก (Contract)

**Input:** โปรไฟล์ผู้ใช้ + รายการ places (กรองตามอำเภอ/หมวด)
**Method:** Claude `messages.create` + `thinking: {type:"adaptive"}` + `output_config.format` (json_schema) เพื่อบังคับให้คืน JSON ตรง schema

**Output schema (ย่อ):**
```json
{
  "plans": [
    {
      "title": "ทริปครอบครัว 1 วัน งบประหยัด",
      "summary": "เหมาะกับเด็กเล็ก ใกล้ ราคาถูก",
      "days": [
        { "day": 1, "stops": [
          { "place_id": "...", "name": "...", "reason": "เหมาะกับเด็ก",
            "suggested_time": "09:00", "lat": 0, "lng": 0 }
        ]}
      ]
    }
  ]
}
```

**System prompt (สาระ):** "คุณคือผู้ช่วยวางแผนท่องเที่ยวจังหวัดสิงห์บุรี วิเคราะห์โปรไฟล์ผู้ใช้ (เช่น แม่เลี้ยงเดี่ยวมีลูก 2 คน งบจำกัด ต้องการที่เที่ยวสำหรับเด็ก) แล้วเลือกสถานที่จากรายการที่ให้เท่านั้น จัดลำดับเส้นทางให้สมเหตุสมผลตามระยะทาง **หลีกเลี่ยงสถานที่ที่ปิดในวัน/เวลาที่ผู้ใช้จะไป (ดูจากฟิลด์ opening_hours/business_status ที่แนบมากับแต่ละ place)** คืนผลหลายแผนตามรูปแบบที่กำหนด"

---

## 5. Real-time Info Sync — ดึงข้อมูลเปิด-ปิดจริง (เพื่อความแม่นยำในการเดินทาง)

**เป้าหมาย:** ป้องกันปัญหา "ไปถึงแล้วปิด" ด้วยข้อมูลเวลาเปิด-ปิดและสถานะจริงของแต่ละสถานที่

**แหล่งข้อมูล:** Google Places API → **Place Details** ขอเฉพาะฟิลด์ `opening_hours`, `current_opening_hours`, `business_status` (Field Mask ลดค่าใช้จ่าย)

**กลไกการ sync (cache-first กัน rate limit/ค่าใช้จ่าย):**
1. **Seed:** ตอนใส่ place ผูก `google_place_id` ไว้ครั้งเดียว
2. **Refresh เป็นระยะ:** Vercel Cron เรียก API route `/api/sync/hours` วันละ 1–2 ครั้ง → อัปเดต `opening_hours`, `business_status`, `hours_last_synced` ลง Supabase
3. **อ่านจาก DB:** หน้าเว็บ/AI planner อ่านจาก Supabase (ไม่ยิง Google ตรงจาก client) → เร็ว + คุมต้นทุน
4. **คำนวณสถานะ ณ ตอนนี้:** ฟังก์ชัน `isOpenNow(opening_hours, now)` ฝั่ง server แปลงเป็นป้าย "เปิดอยู่ / ปิดแล้ว / ใกล้ปิด"

**การใช้งานในระบบ:**
- **AI Planner:** แนบ `opening_hours` + `business_status` ไปกับรายการ places เพื่อให้ AI ไม่จัดสถานที่ที่ปิด
- **แผนที่/การ์ดสถานที่:** แสดงป้ายสถานะ + เวลาเปิด-ปิด + เตือนถ้าปิดถาวร/ชั่วคราว
- **Fallback:** ถ้าไม่มี `google_place_id` หรือ sync ไม่สำเร็จ → ใช้ `opening_hours` แบบกรอกมือ (seed) และไม่บล็อกการวางแผน

**Demo note:** ถ้า key Google ยังไม่พร้อม ใช้ค่า `opening_hours` แบบ seed มือก่อน แล้วสลับมาต่อ Google Places API ทีหลังโดยไม่ต้องแก้ schema

---

## 6. แผนการ build แบบเป็นเฟส (เรียงตาม wow ต่อเวลา)

**Phase 0 — Setup (0.5 วัน)**
- create-next-app + Tailwind + โครงหน้า + Supabase project + ใส่ตัวอย่าง places สิงห์บุรี 15–20 จุด (seed)

**Phase 1 — Map Roadmap (1–1.5 วัน) ← จุด wow หลัก**
- หน้าแผนที่ MapLibre แสดงสิงห์บุรี + markers รายอำเภอ
- วาดเส้นเชื่อมจุด (route line) จากลำดับ stops
- panel รายการสถานที่ + ลากวางด้วย dnd-kit อัปเดตเส้นบนแผนที่ทันที

**Phase 2 — AI Planner + Real-time Hours (1–1.5 วัน)**
- onboarding quiz สั้นๆ (4–5 ข้อ) เก็บ profile
- API route เรียก Claude คืนแผนหลายแบบ → เรนเดอร์เป็นการ์ด → กดเลือกแล้วโยนเข้า Map (Phase 1)
- ต่อ Google Places API: API route `/api/sync/hours` + Vercel Cron อัปเดต `opening_hours`/`business_status` ลง Supabase
- แนบเวลาเปิด-ปิดให้ AI ใช้กรองสถานที่ + แสดงป้าย "เปิดอยู่/ปิดแล้ว" บนการ์ด/หมุดแผนที่

**Phase 3 — Check-in + ไอเทม 3D (1 วัน)**
- ปุ่มเช็คอินที่จุด (เดโม: กดได้เลย/จำลอง GPS)
- เช็คอินสำเร็จ → เด้งไอเทม 3D หมุนได้ (model-viewer) → เก็บใน collection
- ไอเทมคูปอง = consumable (กดใช้แล้ว disabled)

**Phase 4 — Watt's Up! + Auth + ขัดเงา (0.5–1 วัน)**
- หมวดสายทำบุญ: ลิสต์วัด + หน้า detail ประวัติวัด/พระดัง
- LINE Login จริง (ถ้าทัน) ไม่งั้น mock user
- responsive มือถือ + ใส่โลโก้/ธีม

> เดโมขั้นต่ำที่ขายได้ = Phase 1 + 2 + 3 (Map + AI + ข้อมูลเปิด-ปิดจริง + Check-in 3D)

---

## 7. ความเสี่ยง & ทางเลือกสำรอง
- **3D ทำไม่ทัน** → ใช้ model-viewer + โมเดล .glb ฟรีจาก Sketchfab/Poly Pizza แทนการปั้นเอง
- **LINE Login ตั้งค่ายาก** → เดโมใช้ mock auth ไปก่อน ใส่ของจริงทีหลัง
- **ค่า AI** → cache ผลแผนยอดนิยม + ใช้ sonnet สำหรับงานทั่วไป
- **ค่า Google Places / rate limit** → cache ใน Supabase + sync วันละ 1–2 ครั้ง (ไม่ยิงต่อ request) + ใช้ Field Mask ขอเฉพาะฟิลด์เวลาเปิด-ปิด
- **สถานที่บางแห่งไม่มีใน Google** (วัดเล็ก/จุดชุมชน) → fallback ใช้ `opening_hours` กรอกมือ + ป้าย "อ้างอิงข้อมูลชุมชน"
- **ข้อมูลสถานที่จริง** → เริ่มจาก seed มือ 15–20 จุดให้เดโมเดินได้ ค่อยขยาย

---

## 8. สิ่งที่ต้องเตรียมก่อน build
- [ ] รายชื่อสถานที่ท่องเที่ยวสิงห์บุรีจริง + พิกัด lat/lng (ทำ seed)
- [ ] โมเดล 3D .glb 2–3 ชิ้น (ของที่ระลึก + คูปอง)
- [ ] Claude API key (เก็บใน .env ฝั่ง server)
- [ ] Google Places API key + ผูก `google_place_id` ให้แต่ละสถานที่ (เก็บ key ใน .env ฝั่ง server)
- [ ] Supabase project + LINE Developers channel
