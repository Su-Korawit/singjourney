import type { Item3D } from "@/lib/types";

// แมปจาก supabase/seed.sql มาเป็น place id ท้องถิ่น (ดู src/lib/data/places.ts):
//   p1 = วัดพระนอนจักรสีห์วรวิหาร, p3 = อุทยานค่ายบางระจัน & อนุสาวรีย์วีรชน,
//   p6 = ตลาดไทยย้อนยุคบ้านระจัน
export const ITEMS_3D: Item3D[] = [
  {
    id: "s1",
    name: "พระนอนจิ๋ว",
    type: "souvenir",
    model_url: "/models/souvenir.glb",
    place_id: "p1",
    is_consumable: false,
  },
  {
    id: "c1",
    name: "คูปองส่วนลด 10%",
    type: "discount",
    model_url: "/models/coupon.glb",
    place_id: "p6",
    is_consumable: true,
  },
  {
    id: "m1",
    name: "เหรียญวีรชน",
    type: "souvenir",
    model_url: "/models/medal.glb",
    place_id: "p3",
    is_consumable: false,
  },
];

export function itemForPlace(placeId: string): Item3D | null {
  return ITEMS_3D.find((item) => item.place_id === placeId) ?? null;
}

export function getRewardPlaceIds(): string[] {
  return ITEMS_3D.map((item) => item.place_id);
}
