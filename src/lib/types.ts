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
