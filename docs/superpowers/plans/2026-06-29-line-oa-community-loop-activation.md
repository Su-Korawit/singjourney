# Implement Plan — เปิดใช้งานวงจรการมีส่วนร่วมชุมชนผ่าน LINE OA (Activation)

> วันที่: 2026-06-29
> ที่มา: รอบ grill-with-docs (แก้ Form 1-2 + infographic) พบว่า narrative ของครูดัน "ชุมชนแจ้งข้อมูลผ่าน LINE OA" เป็นพระเอก แต่แอป MVP ปัจจุบันตั้งใจ "ตัด LINE ออก" (no-LINE, no-human-in-the-loop) — backend LINE มีอยู่แล้วแต่ยังไม่ wire เข้า UI/ยังไม่เปิด channel จริง
> เป้าหมายแผนนี้: ทำให้คำกล่าวอ้างในฟอร์ม ("พัฒนาฐานระบบไว้แล้ว · นำร่องเฟสถัดไป") กลายเป็น "ทำงานจริง" ได้ เพื่อให้ตอนกรรมการดูแอปจริง (เฟสหลัง 5 วันแรก) เดโมได้ครบ

## สถานะปัจจุบัน (ของจริงในโค้ด)

**มีแล้ว (backend):**
- `src/app/api/line/webhook/route.ts` — รับ webhook, verify signature, parse ข้อความ, เรียก `handleStatusReport`
- `src/lib/line/` — `auth.ts`, `signature.ts`, `report.ts` (parse "ปิด/เปิด ชื่อสถานที่"), `webhook.ts`, `push.ts`, `users.ts` (ครบพร้อมเทสต์)
- `src/app/api/auth/line/login` + `callback` — LINE Login flow (มี mock fallback ถ้าไม่ตั้ง env)
- `supabase/migrations/0002_line_features.sql` — ตาราง override/reporter/user
- `src/lib/types.ts` — `PlaceStatusOverride`, `PlaceReporter`, `AppUser`, `OverrideStatus`

**ยังขาด (gap → live):**
1. UI ไม่แสดง override ของชุมชน — หน้า events/place อ่านจาก `marketStatus(schedule, now)` (อัตโนมัติล้วน) ไม่ได้ merge `PlaceStatusOverride`
2. ปุ่ม LINE Login ถูกถอดออกจาก Header (commit c399851 "drop dead LINE login")
3. ยังไม่ตั้ง env จริง: `LINE_LOGIN_CHANNEL_ID/SECRET/REDIRECT_URI`, `LINE_MESSAGING_CHANNEL_SECRET`, access token
4. ยังไม่มี flow verify ผู้แจ้ง (`PlaceReporter`) — ใครพิมพ์ก็ยังไม่ผูกกับสิทธิ์
5. ยังไม่มี cron/logic หมดอายุ override (`expires_at`)

## ขั้นตอน (เรียงตาม commit เล็ก ๆ)

### Phase A — Merge override เข้า status (โชว์ผลชุมชนได้ทันทีเมื่อมีข้อมูล)
1. เพิ่มฟังก์ชัน `resolveStatus(schedule, override, now)` ใน `src/lib/status/live.ts`: ถ้ามี override ที่ยังไม่ `expires_at` → ใช้ override (พร้อม badge "อัปเดตโดยคนในพื้นที่"), ไม่งั้น fallback `marketStatus` เดิม
2. หน้า events/place ดึง `place_status_overrides` ที่ active จาก Supabase แล้วส่งเข้า `resolveStatus`
3. เทสต์: override active ชนะ schedule; override หมดอายุ → กลับไป schedule
   - **เดโมได้:** insert override ด้วยมือใน Supabase → เว็บโชว์ "ปิดชั่วคราว (แจ้งโดยคนในพื้นที่)" ทันที โดยยังไม่ต้องมี LINE channel จริง

### Phase B — เปิด LINE channel จริง + verify reporter
4. ตั้ง env LINE (Login + Messaging) บน Vercel; ทดสอบ webhook ด้วย LINE OA Manager
5. flow ลงทะเบียนผู้แจ้ง: คนในพื้นที่ทักเข้า LINE OA → ทีม/แอดมิน verify ใส่ลง `place_reporters` (เฟสนำร่องทำมือก่อนได้ ไม่ต้อง automate)
6. `handleStatusReport` ตรวจ `reported_by` ว่าอยู่ใน `place_reporters` ของ place นั้นก่อนเขียน override (กันสแปม)

### Phase C — Login + แจ้งเตือน + หมดอายุ
7. คืนปุ่ม LINE Login เข้า Header (ตอนนี้ env พร้อม) → บันทึกทริปผูกบัญชี (ย้ายจาก localStorage → Supabase ผูก `line_user_id`); เก็บ localStorage เป็น fallback ผู้ไม่ล็อกอิน
8. ใช้ `push.ts` ส่งแจ้งเตือนผู้ที่บันทึกแผนเมื่อสถานที่ในแผนมี override
9. cron (`vercel.json`) ลบ/ปิด override ที่ `expires_at` เลยแล้ว

## เกณฑ์สำเร็จ (ตรวจวัดได้)
- [ ] insert override → เว็บเปลี่ยน badge ภายในการรีเฟรชหน้า (Phase A)
- [ ] ส่งข้อความ "ปิด ตลาดบางระจัน" จากบัญชี reporter ที่ verify แล้ว → override ขึ้นในเว็บ (Phase B)
- [ ] ข้อความจากบัญชีที่ไม่ verify → ไม่มีผล
- [ ] override หมดอายุ → กลับสถานะอัตโนมัติ
- [ ] ล็อกอิน LINE → บันทึกทริปข้ามอุปกรณ์ได้

## หมายเหตุ scope
- Phase A ทำให้ฟอร์มเคลม "ผสานข้อมูลชุมชน" เป็นจริงได้เร็วสุด ต้นทุนต่ำสุด ควรทำก่อนรอบกรรมการดูแอป
- Phase B-C ต้องมี LINE channel จริง + คนในพื้นที่นำร่อง — เป็นงานเชิงพื้นที่ ไม่ใช่แค่โค้ด
- ถ้ายังไม่ทันเฟสแรก (เน้นเอกสาร) คงสถานะ "พัฒนาฐานระบบไว้แล้ว · นำร่องเฟสถัดไป" ในฟอร์มต่อไปได้อย่างซื่อสัตย์
