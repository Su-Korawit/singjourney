# Asset Swap-Points (รูป/โมเดล)

> ทุกจุดด้านล่างตอนนี้เป็น placeholder ระบบ `PlaceImage`
> ([src/components/media/PlaceImage.tsx](../src/components/media/PlaceImage.tsx))
> แสดงกล่อง Swap-Point อัตโนมัติเมื่อรูปไม่มี/โหลดไม่ขึ้น layout ไม่พัง
> **ข้อกำหนดประกวด: ห้ามใช้ภาพ AI generate ใช้รูปจริง/ฟรีไลเซนส์เท่านั้น** และลงเครดิตใน
> [public/images/CREDITS.md](../public/images/CREDITS.md)

## รูปสถานที่ (place.image_url)
แก้ที่ src/lib/data/places.ts ฟิลด์ image_url ของแต่ละ place (p1..p12)
วางไฟล์จริงใน public/images/places/ แล้วชี้ path ให้ตรง

## รูป hero
- public/images/hero-bangrachan.jpg (หน้าแรก) สลับเป็นรูปอนุสาวรีย์ค่ายบางระจันจริง

## โมเดล 3D (มีไฟล์ตัวอย่างแล้ว ปรับได้)
- public/models/souvenir.glb (พระนอนจิ๋ว, p1)
- public/models/coupon.glb (คูปองส่วนลด, p6)
- public/models/medal.glb (เหรียญวีรชน, p3)

## วิธีตรวจว่าสลับครบ
เปิดแต่ละหน้าแล้วมองหากล่องป้าย Swap-Point ถ้ายังเห็น = จุดนั้นยังเป็น placeholder
