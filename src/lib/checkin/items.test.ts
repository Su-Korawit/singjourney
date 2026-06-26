import { describe, it, expect } from "vitest";
import { awardItem, useConsumable } from "./items";
import type { Item3D, UserItem } from "@/lib/types";

const souvenir: Item3D = {
  id: "s1",
  name: "พระนอนจิ๋ว",
  type: "souvenir",
  model_url: "/m.glb",
  place_id: "1",
  is_consumable: false,
};
const coupon: Item3D = {
  id: "c1",
  name: "คูปอง 10%",
  type: "discount",
  model_url: "/c.glb",
  place_id: "1",
  is_consumable: true,
};

describe("awardItem", () => {
  it("ให้ไอเทมใหม่เมื่อยังไม่มี", () => {
    const r = awardItem([], souvenir, "u1");
    expect(r.awarded).toBe(true);
    expect(r.added).toHaveLength(1);
  });
  it("ไม่ให้ซ้ำเมื่อมีไอเทมนั้นแล้ว", () => {
    const owned: UserItem[] = [
      { id: "x", user_id: "u1", item_id: "s1", used: false },
    ];
    const r = awardItem(owned, souvenir, "u1");
    expect(r.awarded).toBe(false);
    expect(r.added).toEqual(owned);
  });
  it("คูปองที่ใช้ไปแล้ว รับซ้ำไม่ได้", () => {
    const owned: UserItem[] = [
      { id: "x", user_id: "u1", item_id: "c1", used: true },
    ];
    expect(awardItem(owned, coupon, "u1").awarded).toBe(false);
  });
});

describe("useConsumable", () => {
  it("mark used=true", () => {
    const owned: UserItem[] = [
      { id: "x", user_id: "u1", item_id: "c1", used: false },
    ];
    expect(useConsumable(owned, "c1")[0].used).toBe(true);
  });
});
