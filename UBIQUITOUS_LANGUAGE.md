# Ubiquitous Language — Sing Journey

> สกัดจากเอกสาร `docs/DECISIONS.md` + รอบ grilling เรื่อง UX/UI redesign (2026-06-27)
> เป้าหมาย: ทุกคน (คน + AI agent + Cursor) ใช้คำเดียวกัน ไม่สับสน โดยเฉพาะคำว่า "แผนที่"

## Navigation surfaces (จุดที่คนกดเดินทาง)

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **District Map** (แผนที่อำเภอ) | SVG แผนที่จังหวัดสิงห์บุรีแบบ stylized 6 อำเภอ บนหน้าแรก คลิกอำเภอ → ดูสถานที่ในอำเภอนั้น เป็น "ตัวนำทาง" ไม่ใช่แผนที่จริง | "the map", "หน้าแผนที่", "home map" |
| **Roadmap** (โร้ดแมป) | เส้นทางท่องเที่ยวที่ระบบสร้าง วาดบน **แผนที่จริง** (MapLibre) เริ่มบ้าน → จังหวัด → รายอำเภอ → ไล่จุดต่อเนื่องได้เกิน 1 วัน | "route", "เส้นทาง", "the map" |
| **App Shell** | กรอบร่วมทุกหน้า: Header (wordmark + เมนู) + Footer | "layout", "nav bar" |

## Brand & visual language (ภาษาดีไซน์)

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Brand Anchor** | แก่นภาพที่นิยามแบรนด์ = **บางระจัน วีรชน** โทน "องอาจ-อบอุ่น" (ไม่ epic จัด) คุมสีหลัก/โลโก้/hero/ปุ่มหลัก | "theme", "สไตล์" |
| **Content Theme** | แก่นภาพรอง 2 ตัวที่ไม่แย่งสีหลัก แต่โผล่ตามเนื้อหา: **Watt's Up!** (วัด/ทำบุญ → ทอง) และ **ตลาด/ปลาช่อนแม่ลา** (อาหาร → ความสนุกอบอุ่น) | "anchor", "หมวด" |
| **Clay / แดงอิฐ** | สีแบรนด์หลัก `#9C3B2E` — โลโก้ ปุ่มหลัก เส้น Roadmap จุด active | "orange", "ส้ม", "#e07a2f" (สีเดิม เลิกใช้) |
| **Gold / ทอง** | สี accent `#C8962F` = ธีม Watt's Up!/ของมงคล + glow ตอนรับไอเทม | "yellow", "เหลือง" |
| **Paper / กระดาษ** | พื้นหลังหน้า `#F4ECE0` ครีมอุ่น (ไม่ใช่ขาวจัด) ให้ความอบอุ่นแบบ agriturismo | "white background", "พื้นขาว" |
| **Warm-filter** | CSS filter ที่ทาบบน canvas ของ Roadmap (MapLibre) ดึงสี OSM เข้าโทนกระดาษ/ดิน ให้ Roadmap กับ District Map ดูเป็นแอปเดียวกัน | "map style", "theme tiles" |
| **Swap-Point** | จุดที่ใส่ของชั่วคราวสำหรับ MVP แล้วสลับของจริงทีหลังโดยไม่แก้โครง — ในดีไซน์ = **ทุกภาพถ่าย** (placeholder ตอนนี้ ของจริง/ฟรีไลเซนส์ก่อนส่งจริง) | "TODO", "mock" (ใช้คำ Swap-Point ให้ชัด) |

## Domain (จาก DECISIONS.md — คงไว้)

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Profile** | ข้อมูลตัวตน/ไลฟ์สไตล์ผู้ใช้ ป้อนให้ AI วางแผน | "user data", "ควิซ" |
| **Plan** (แผน) | ผลลัพธ์จาก AI: ทริปหลายแบบ แต่ละแบบมีรายการ stop ต่อวัน | "itinerary", "Roadmap" |
| **ไอเทม 3D** | ของรางวัลจาก Check-in: **ของที่ระลึก** (เก็บถาวร) หรือ **คูปองส่วนลด** (consumable ใช้แล้วหมด รับซ้ำไม่ได้) | "reward", "NFT" |
| **Check-in** | ยืนยันว่าผู้ใช้ไปถึงสถานที่จริงเพื่อรับไอเทม | "visit", "เช็คพอยต์" |
| **Real-time Info Sync** | ดึงเวลาเปิด-ปิด + สถานะเปิด-ปิดจริงผ่าน Google Places API กัน "ไปถึงแล้วปิด" | "sync", "API" |

## Community & status (รอบ grill-with-docs 2026-06-29)

| Term | Definition | Aliases to avoid |
| ---- | ---------- | ---------------- |
| **Community Reporter** (ผู้แจ้งชุมชน) | คนในพื้นที่ที่ verify แล้ว (เจ้าของร้าน/ผู้ดูแลตลาด/วัด) มีสิทธิ์แจ้งสถานะสถานที่ผ่าน LINE OA = `PlaceReporter` ในโค้ด | "user", "ชาวบ้าน", "เจ้าของ" |
| **Status Override** (override สถานะ) | สถานะเปิด-ปิดที่ Community Reporter แจ้ง มา **ทับ** สถานะอัตโนมัติชั่วคราวจนถึง `expires_at` = `PlaceStatusOverride` | "manual status", "การแก้ไข" |
| **Auto Status** (สถานะอัตโนมัติ) | สถานะเปิด-ปิดที่ระบบ **คำนวณเองจากเวลาทำการ/Google Places** ผ่าน `marketStatus(schedule, now)` เป็น default เมื่อไม่มี Override | "real-time 2 ชั้น" (เลิกเคลม "2 ชั้น" จนกว่า Override จะ live) |
| **Local Gem** (ร้านเล็ก/ร้านลับ) | ร้านรายย่อย/กิจการชุมชนที่คนค้นพบน้อย ระบบดันเข้าแผนเพื่อกระจายรายได้ถึงรากหญ้า (ยังเป็นแผน ไม่ใช่ field จริง) | "hidden", "ร้านดัง" |
| **สถานะ Live-vs-Designed** | กติกาเขียนเอกสาร: **(ทำงานจริงแล้ว)** = ใช้ได้ในแอปวันนี้ · **(พัฒนาฐานระบบแล้ว · นำร่องเฟสถัดไป)** = backend พร้อม UI/channel ยังไม่เปิด | "เสร็จแล้ว", "กำลังทำ" (ลอย ๆ) |

## Relationships

- **Profile** ป้อนเข้า AI → ได้ **Plan** หลายแบบ → เลือก 1 Plan → กลายเป็น **Roadmap** บนแผนที่จริง
- **Community Reporter** แจ้งผ่าน LINE OA → สร้าง **Status Override** → ทับ **Auto Status** จนหมดอายุ (ปัจจุบัน Override = "พัฒนาฐานระบบแล้ว · นำร่องเฟสถัดไป", Auto Status = "ทำงานจริงแล้ว")
- **District Map** (หน้าแรก) คลิกอำเภอ → กรองสถานที่ → เริ่มสร้าง **Plan**/**Roadmap** ได้
- **Brand Anchor** คุม Clay/Paper/typography ส่วน **Content Theme** Watt's Up! คุม Gold
- **Check-in** บน Roadmap → มอบ **ไอเทม 3D** (reveal ด้วย Gold glow)
- ทุก **ภาพถ่าย** คือ **Swap-Point**

## Example dialogue

> **Dev:** "เวลาพูดว่า 'หน้าแผนที่' หมายถึงอันไหน?"
> **Domain:** "ห้ามพูดลอยๆ — หน้าแรกคือ **District Map** (SVG นำทาง) ส่วนหน้า `/map` คือ **Roadmap** (MapLibre จริง) คนละตัว"
> **Dev:** "งั้นสีเส้นทางใช้อะไร?"
> **Domain:** "เส้น **Roadmap** ใช้ **Clay** `#9C3B2E` ไม่ใช่ส้มเดิม และทาบ **Warm-filter** บน tile เพื่อให้เข้าโทน **Paper** เหมือน District Map"
> **Dev:** "รูปวัดในหน้า Watt's Up! ยังไม่มีของจริง?"
> **Domain:** "ใส่ **Swap-Point** ไปก่อน — placeholder ตอนนี้ ก่อนส่งจริงค่อยสลับรูปฟรีไลเซนส์ ห้าม AI generate และ layout ต้องไม่พังถ้ารูปหาย"

## Flagged ambiguities

- **"แผนที่ / map"** ถูกใช้กับ 2 สิ่งที่ต่างกันสิ้นเชิง → แยกเป็น **District Map** (นำทาง, SVG, หน้าแรก) กับ **Roadmap** (เส้นทางจริง, MapLibre, `/map`) เสมอ ห้ามเรียก "the map" ลอยๆ
- **"Plan" vs "Roadmap"** → **Plan** = ผลข้อความจาก AI (หลายแบบ ยังไม่ได้เลือก); **Roadmap** = Plan ที่ถูกเลือกแล้ววาดบนแผนที่จริง
- **"ส้ม #e07a2f"** (สีในโค้ดเดิม) → เลิกใช้ แทนด้วย **Clay #9C3B2E**; ที่ไหนยังเป็นส้มถือว่าเป็นหนี้ที่ต้องล้าง
- **"LINE OA / ชุมชนแจ้งข้อมูล"** ถูกเขียนในฟอร์มเหมือนใช้งานจริงแล้ว แต่จริง ๆ เป็น **(พัฒนาฐานระบบแล้ว · นำร่องเฟสถัดไป)** → ต้องติดป้าย **สถานะ Live-vs-Designed** เสมอเมื่อพูดถึง Community Reporter/Status Override/LINE Login/แจ้งเตือน ห้ามเคลมลอย ๆ ว่า "ชุมชนใช้แล้ว" (ดู ADR 2026-06-29)
- **"ข้อมูลจริง 2 ชั้น"** → ปัจจุบันมีแค่ชั้น **Auto Status**; ชั้น **Status Override** ยังไม่ live อย่าเคลม "2 ชั้น" จนกว่าจะทำ Phase A ของแผน LINE OA เสร็จ
