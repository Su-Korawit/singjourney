export type BusinessStatus = "OPERATIONAL" | "CLOSED_TEMPORARILY" | "CLOSED_PERMANENTLY";

/** เวลาเปิด-ปิดรายวัน 0=อาทิตย์..6=เสาร์; null = ปิดทั้งวัน */
export type DayHours = { open: string; close: string } | null; // "HH:MM"
export type OpeningHours = Record<number, DayHours>;

export type PlaceCategory =
  | "historical"
  | "cultural"
  | "temple"
  | "adventure"
  | "food"
  | "kids";

export type Place = {
  id: string;
  district: string;
  name: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  description: string;
  image_url: string | null;
  avg_price: number | null;
  google_place_id: string | null;
  opening_hours: OpeningHours | null;
  business_status: BusinessStatus;
  hours_last_synced: string | null;
};

export type Temple = {
  id: string;
  place_id: string;
  history: string;
  famous_monk: string;
  merit_info: string;
};

export type UserProfile = {
  travelers: string;
  budget: "low" | "medium" | "high";
  interests: PlaceCategory[];
  days: number;
};

export type PlanStop = {
  place_id: string;
  name: string;
  reason: string;
  suggested_time: string;
  lat: number;
  lng: number;
};
export type PlanDay = { day: number; stops: PlanStop[] };
export type Plan = { title: string; summary: string; days: PlanDay[] };

export type Trip = {
  id: string;
  user_id: string;
  title: string;
  days: number;
  status: string;
  route: PlanDay[];
};

export type Item3D = {
  id: string;
  name: string;
  type: "souvenir" | "discount";
  model_url: string;
  place_id: string;
  is_consumable: boolean;
};
export type Checkin = {
  id: string;
  user_id: string;
  place_id: string;
  item_id: string | null;
  created_at: string;
};
export type UserItem = {
  id: string;
  user_id: string;
  item_id: string;
  used: boolean;
};

export type SingEvent = {
  id: string;
  name: string;
  district: string;
  month: number;        // 1-12 เดือนที่จัดงานโดยประมาณ
  when_label: string;   // ข้อความช่วงเวลาที่อ่านง่าย
  category: PlaceCategory;
  tagline: string;      // เหตุผลที่ต้องมา (1 ประโยคคม)
  description: string;  // อธิบายงาน + ชวนอยู่ต่อ
  anchor_place_ids: string[]; // ผูกกับ PLACES เพื่อ "วางแผนรอบงานนี้"
  image_url: string | null;
};

export type TempleContent = {
  place_id: string;     // อ้างถึง PLACES
  history: string;      // ประวัติย่อ
  famous_monk: string;  // พระเกจิ/พระสำคัญ
  merit_info: string;   // ทำบุญ/ขอพรเรื่องอะไร
};

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
