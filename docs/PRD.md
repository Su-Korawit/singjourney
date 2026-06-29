# Product Requirements Document — Sing Journey (สิงห์เจอร์นีย์)

> สถานะ: Prototype สมบูรณ์ (mockup Part A เสร็จแล้ว) | อัปเดต: มิ.ย. 2569

---

## 1. ภาพรวมผลิตภัณฑ์

**Sing Journey** คือเว็บแอปพลิเคชัน (PWA) ผู้ช่วยวางแผนท่องเที่ยวจังหวัดสิงห์บุรีด้วยปัญญาประดิษฐ์ ชื่อเต็ม:

> สิงห์เจอร์นีย์: แพลตฟอร์มผู้ช่วยวางแผนท่องเที่ยวอัจฉริยะจังหวัดสิงห์บุรีด้วยปัญญาประดิษฐ์
> Sing Journey: An AI-Powered Smart Travel Planning Platform for Sing Buri Province

**คำขวัญจังหวัด:**
> ถิ่นวีรชนคนกล้า คู่หล้าพระนอน นามกระฉ่อนปลาแม่ลา เทศกาลกินปลาประจำปี

**แท็กไลน์:** เที่ยวสิงห์บุรี ให้ AI วางแผนให้ แม่นยำ ไม่ไปถึงแล้วปิด

**กลุ่มเป้าหมาย:** นักท่องเที่ยวทั่วไป, ชุมชน/วัด/ตลาดท้องถิ่น, หน่วยงานส่งเสริมการท่องเที่ยว

---

## 2. ขอบเขตข้อมูล

| หมวด | จำนวน | รายละเอียด |
|---|---|---|
| สถานที่ท่องเที่ยว | 12 แห่ง | ครอบคลุมทั้ง 6 อำเภอ |
| อำเภอ | 6 อำเภอ | ครบทุกอำเภอในจังหวัดสิงห์บุรี |
| เทศกาล/งานประจำจังหวัด | 6 เทศกาล | มีป้ายสถานะเปิด-ปิดจริง |
| ตลาดท้องถิ่น | 4 แห่ง | ตลาดไทยย้อนยุคบ้านระจัน, ตลาดปลาแม่ลา, ตลาดสดเทศบาลเมืองสิงห์บุรี, ถนนคนเดินสิงห์บุรี |
| วัด (Watt's Up!) | 6 วัด | พร้อมโมเดล 3D และประวัติ |

---

## 3. หน้าหลัก (5 หน้า)

### 3.1 หน้าแรก `/`
- แสดงคำขวัญจังหวัดสิงห์บุรี
- แถบ "เปิดอยู่ตอนนี้" (open-now strip) แสดงสถานที่ที่เปิดอยู่ในปัจจุบัน
- ปุ่มเริ่มวางแผนทริป

### 3.2 หน้าวางแผน `/plan`
- 3 การ์ดแผนท่องเที่ยว (showcase plans) สร้างโดย AI
  - แสดงชื่อแผน, สถานที่, ช่วงค่าใช้จ่าย (฿) ต่อคน
  - ปุ่ม "ดูบนแผนที่" เชื่อมไป `/map`
- ระบบประมาณค่าใช้จ่ายเป็นช่วง (haversine + ค่าเข้าชม + ค่าอาหาร)
- บันทึกแผนผ่าน LINE Login

### 3.3 หน้าแผนที่ `/map`
- แผนที่ MapLibre GL JS แสดงเส้นทางถนนจริงจาก GeoJSON (roadmap polyline)
- หมุดสถานที่พร้อม popup แสดงสถานะเปิด-ปิด
- รองรับ mobile และ desktop

### 3.4 หน้าเทศกาล/ตลาด `/events`
- 2 ส่วน: เทศกาล 6 งาน และตลาดท้องถิ่น 4 แห่ง
- ป้ายสถานะสี: เปิดอยู่ (เขียว), ใกล้ปิด (เหลือง), ปิดแล้ว (แดง)
- ข้อความ LINE OA สำหรับแจ้งสถานะ

### 3.5 หน้าวัด `/watts-up`
- 6 วัดในจังหวัดสิงห์บุรี พร้อมประวัติและพระเกจิดัง
- โมเดล 3D (model-viewer) lazy-load
- ระบบเช็คอินรับไอเทม 3 มิติ

---

## 4. ฟีเจอร์หลัก

### 4.1 AI Planning
- ใช้ Gemini AI API (Google Gemini 2.5 Flash) วิเคราะห์ไลฟ์สไตล์ผู้ใช้
- สร้างแผนท่องเที่ยวหลายรูปแบบ (3 showcase plans)
- คืนผลพร้อมช่วงค่าใช้จ่ายโดยประมาณต่อคน

### 4.2 Cost Estimator
- ฟังก์ชัน `estimateCost()` ใน `src/lib/cost/estimate.ts`
- คำนวณ: ระยะทาง (haversine) + ค่าเข้าชม + ค่าอาหาร
- แสดงผลเป็นช่วง ฿ ต่อคน ด้วย `formatBaht()`

### 4.3 Real-time Status (2 ชั้น)
- ชั้น 1: ดึงข้อมูลจาก Google Places API อัตโนมัติ
- ชั้น 2: รับแจ้งจากคนในท้องถิ่นผ่าน LINE OA
- ป้ายสถานะ: เปิดอยู่ / ใกล้ปิด / ปิดแล้ว

### 4.4 Real Road Routing
- GeoJSON เส้นทางถนนจริง (`public/demo/roadmap-route.json`)
- วาด polyline บน MapLibre GL JS
- รองรับการขยายจาก Google Routes API

### 4.5 Gamification
- เช็คอินรับไอเทม 3 มิติ (model-viewer บนเว็บ)
- คอลเลคชันของที่ระลึก/คูปองดิจิทัล

### 4.6 Saved Plans
- บันทึกแผนการเดินทางผ่าน LINE Login
- เรียกดูแผนที่บันทึกไว้ได้ทุกเมื่อ (Supabase)

### 4.7 LINE Integration
- LINE Login สำหรับยืนยันตัวตนและบันทึกข้อมูล
- LINE Messaging API แจ้งเตือนเมื่อสถานที่ในแผนเปลี่ยนสถานะ
- LINE OA รับรายงานสถานะจากชุมชน

---

## 5. สถาปัตยกรรมและเทคโนโลยี

| ชั้น | เทคโนโลยี |
|---|---|
| Frontend Framework | Next.js 14+ App Router (PWA) |
| UI/Styling | Tailwind CSS, Chonburi/Mitr/Sarabun fonts |
| แผนที่ | MapLibre GL JS |
| โมเดล 3D | `<model-viewer>` web component |
| AI | Gemini API (Google Gemini 2.5 Flash) |
| Auth | LINE Login (OAuth 2.0) |
| Messaging | LINE Messaging API (OA) |
| Open/Close data | Google Places API + LINE OA community reports |
| Road routing | Google Routes API / GeoJSON static |
| ฐานข้อมูล | Supabase (PostgreSQL + Storage) |
| Hosting | Vercel |
| Demo data | `src/lib/demo/showcase.ts`, `public/demo/roadmap-route.json` |

---

## 6. ไฟล์ข้อมูลสำคัญ

```
src/
  lib/
    demo/showcase.ts        # 3 showcase plans + market/festival statuses
    cost/estimate.ts        # estimateCost(), formatBaht()
public/
  demo/
    roadmap-route.json      # GeoJSON เส้นทางถนนจริง
  screenshots/
    home.png / home-mobile.png
    plan.png / plan-mobile.png
    roadmap.png / roadmap-mobile.png
    events.png / events-mobile.png
    items.png / items-mobile.png
```

---

## 7. Brand และ Theme

| บทบาท | ชื่อสี | HEX |
|---|---|---|
| แบรนด์หลัก | clay | `#9C3B2E` |
| เข้ม | clay-deep | `#5C2A1E` |
| ทอง | gold | `#C8962F` |
| พื้นหลัง | paper | `#F4ECE0` |
| สถานะเปิด | open | `#4F7A3A` |
| ใกล้ปิด | closing | `#C98A2B` |
| ปิดแล้ว | closed | `#B23A2E` |

**ฟอนต์:** Chonburi (พาดหัว), Mitr (หัวข้อ), Sarabun (เนื้อความ)

---

## 8. ข้อจำกัดและ Non-Goals (v1)

- ไม่รองรับการจองโรงแรม/ร้านอาหารโดยตรง (แสดงข้อมูลเท่านั้น)
- ฐานข้อมูลสถานที่ปัจจุบัน: 12 แห่ง (ขยายได้ในอนาคต)
- ระบบ drag-and-drop ปรับแก้แผนอยู่ใน roadmap (ยังไม่ implement ใน prototype)
- รองรับภาษาไทยเป็นหลัก (ต่อยอดภาษาอังกฤษได้)

---

_PRD นี้สะท้อนสถานะ mockup Part A ที่เสร็จสมบูรณ์แล้ว_
_สรุปข้อมูล: 12 สถานที่ · 6 อำเภอ · 6 เทศกาล · 4 ตลาด · 6 วัด_
