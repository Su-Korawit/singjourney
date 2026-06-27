import type { Place } from "@/lib/types";

const OPEN_DAILY = {
  0: { open: "08:00", close: "17:00" }, 1: { open: "08:00", close: "17:00" },
  2: { open: "08:00", close: "17:00" }, 3: { open: "08:00", close: "17:00" },
  4: { open: "08:00", close: "17:00" }, 5: { open: "08:00", close: "17:00" },
  6: { open: "08:00", close: "17:00" },
} as const;

function base(id: string): Pick<Place,
  "google_place_id" | "opening_hours" | "business_status" | "hours_last_synced"> {
  return {
    google_place_id: null,
    opening_hours: { ...OPEN_DAILY },
    business_status: "OPERATIONAL",
    hours_last_synced: null,
  };
}

export const PLACES: Place[] = [
  { id: "p1", district: "เมืองสิงห์บุรี", name: "วัดพระนอนจักรสีห์วรวิหาร",
    lat: 14.9215, lng: 100.3548, category: "temple",
    description: "พระอารามหลวง ประดิษฐานพระพุทธไสยาสน์ (พระนอน) องค์ใหญ่ที่งดงามที่สุดองค์หนึ่งของไทย คู่บ้านคู่เมืองสิงห์บุรี",
    image_url: "/images/places/p1.jpg", avg_price: 0, ...base("p1") },
  { id: "p2", district: "เมืองสิงห์บุรี", name: "วัดสว่างอารมณ์ (หมู่บ้านช่างหล่อพระ)",
    lat: 14.8902, lng: 100.4015, category: "cultural",
    description: "ศูนย์รวมช่างหล่อพระพุทธรูปฝีมือพื้นบ้านสิงห์บุรี ชมขั้นตอนปั้น-หล่อ-แต่งองค์พระแบบดั้งเดิม",
    image_url: "/images/places/p2.jpg", avg_price: 0, ...base("p2") },
  { id: "p3", district: "ค่ายบางระจัน", name: "อุทยานค่ายบางระจัน & อนุสาวรีย์วีรชน",
    lat: 14.9389, lng: 100.2589, category: "historical",
    description: "สมรภูมิวีรชนชาวบ้านบางระจัน หัวใจของแบรนด์จังหวัด อนุสาวรีย์ พิพิธภัณฑ์ และลานประวัติศาสตร์",
    image_url: "/images/places/p3.jpg", avg_price: 0, ...base("p3") },
  { id: "p4", district: "ค่ายบางระจัน", name: "วัดโพธิ์เก้าต้น (วัดไม้แดง)",
    lat: 14.9461, lng: 100.2643, category: "historical",
    description: "ฐานที่มั่นเดิมของชาวบ้านบางระจัน มีต้นโพธิ์เก่าแก่และร่องรอยประวัติศาสตร์การสู้รบ",
    image_url: "/images/places/p4.jpg", avg_price: 0, ...base("p4") },
  { id: "p5", district: "บางระจัน", name: "อุทยานแม่ลามหาราชานุสรณ์",
    lat: 14.9020, lng: 100.2410, category: "food",
    description: "แหล่งปลาแม่ลาขึ้นชื่อ ลานริมน้ำกว้าง ร้านอาหารปลาน้ำจืดสด ๆ สัญลักษณ์ความอุดมสมบูรณ์ของลุ่มเจ้าพระยา",
    image_url: "/images/places/p5.jpg", avg_price: 250, ...base("p5") },
  { id: "p6", district: "บางระจัน", name: "ตลาดไทยย้อนยุคบ้านระจัน",
    lat: 14.9355, lng: 100.2620, category: "cultural",
    description: "ตลาดวัฒนธรรมบรรยากาศย้อนยุค อาหารพื้นถิ่น ขนมไทย และของฝากชุมชน เปิดเสาร์-อาทิตย์",
    image_url: "/images/places/p6.jpg", avg_price: 120, ...base("p6") },
  { id: "p7", district: "พรหมบุรี", name: "วัดอัมพวัน",
    lat: 14.8190, lng: 100.4520, category: "temple",
    description: "วัดปฏิบัติธรรมชื่อดัง อดีตเป็นสำนักของหลวงพ่อจรัญ ฐิตธมฺโม ศูนย์วิปัสสนากรรมฐานที่คนทั่วประเทศมาเยือน",
    image_url: "/images/places/p7.jpg", avg_price: 0, ...base("p7") },
  { id: "p8", district: "พรหมบุรี", name: "หมู่บ้านไทยพวนบ้านแป้ง",
    lat: 14.7980, lng: 100.4630, category: "cultural",
    description: "ชุมชนไทยพวนเก่าแก่ เจ้าของประเพณีกำฟ้า วิถีชีวิต อาหาร และผ้าทอมือเอกลักษณ์",
    image_url: "/images/places/p8.jpg", avg_price: 0, ...base("p8") },
  { id: "p9", district: "อินทร์บุรี", name: "พิพิธภัณฑสถานแห่งชาติ อินทร์บุรี",
    lat: 14.9905, lng: 100.3270, category: "cultural",
    description: "พิพิธภัณฑ์รวมโบราณวัตถุ เครื่องปั้นดินเผา และเรื่องเล่าลุ่มเจ้าพระยา ตั้งในวัดโบสถ์ริมแม่น้ำ",
    image_url: "/images/places/p9.jpg", avg_price: 0, ...base("p9") },
  { id: "p10", district: "อินทร์บุรี", name: "เมืองโบราณบ้านคูเมือง",
    lat: 15.0120, lng: 100.3480, category: "historical",
    description: "แหล่งโบราณคดีคูน้ำคันดินสมัยทวารวดี ร่องรอยเมืองเก่ากว่าพันปีของลุ่มน้ำเจ้าพระยาตอนกลาง",
    image_url: "/images/places/p10.jpg", avg_price: 0, ...base("p10") },
  { id: "p11", district: "ท่าช้าง", name: "วัดพิกุลทอง (หลวงพ่อแพ)",
    lat: 14.8420, lng: 100.3950, category: "temple",
    description: "พระอารามหลวง ประดิษฐานพระพุทธรูปองค์ใหญ่ 'หลวงพ่อใหญ่' ลานธรรมสีทอง อนุสรณ์หลวงพ่อแพ เขมงฺกโร",
    image_url: "/images/places/p11.jpg", avg_price: 0, ...base("p11") },
  { id: "p12", district: "ท่าช้าง", name: "วัดโบสถ์ริมเจ้าพระยา",
    lat: 14.8560, lng: 100.3880, category: "temple",
    description: "วัดเก่าริมแม่น้ำเจ้าพระยา จุดชมวิวสายน้ำและทำบุญในเส้นทางวัฒนธรรมท่าช้าง",
    image_url: "/images/places/p12.jpg", avg_price: 0, ...base("p12") },
];

export function placeById(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}
export function placesByDistrict(d: string): Place[] {
  return PLACES.filter((p) => p.district === d);
}
