import { describe, it, expect } from "vitest";
import { ITEMS_3D, itemForPlace, getRewardPlaceIds } from "./items";

describe("local items catalog", () => {
  it("มีไอเทม 3 ชิ้นตรงกับ seed (พระนอน/คูปอง/เหรียญ)", () => {
    expect(ITEMS_3D).toHaveLength(3);
    expect(ITEMS_3D.map((i) => i.id).sort()).toEqual(["c1", "m1", "s1"]);
  });

  it("itemForPlace คืนไอเทมของสถานที่ที่มีรางวัล", () => {
    expect(itemForPlace("p1")?.name).toBe("พระนอนจิ๋ว");
    expect(itemForPlace("p6")?.type).toBe("discount");
    expect(itemForPlace("p3")?.model_url).toBe("/models/medal.glb");
  });

  it("itemForPlace คืน null เมื่อสถานที่ไม่มีไอเทม", () => {
    expect(itemForPlace("p2")).toBeNull();
    expect(itemForPlace("ไม่มีจริง")).toBeNull();
  });

  it("getRewardPlaceIds คืน place id ที่มีรางวัลครบ 3 จุด", () => {
    expect(getRewardPlaceIds().sort()).toEqual(["p1", "p3", "p6"]);
  });

  it("คูปองเป็น consumable ของสะสมไม่ใช่", () => {
    expect(itemForPlace("p6")?.is_consumable).toBe(true);
    expect(itemForPlace("p1")?.is_consumable).toBe(false);
  });
});
