import { describe, it, expect } from "vitest";
import { parseStatusReport } from "@/lib/line/report";

const PLACES = [
  { id: "p1", name: "วัดพระนอนจักรสีห์" },
  { id: "p2", name: "ตลาดไทยย้อนยุค" },
];

describe("parseStatusReport", () => {
  it("ข้อความ 'ปิด' + ชื่อสถานที่ → closed", () => {
    expect(parseStatusReport("วันนี้ปิด วัดพระนอนจักรสีห์", PLACES)).toEqual({
      placeId: "p1",
      status: "closed",
    });
  });
  it("ข้อความ 'เปิดแล้ว' (มี ปิด ซ้อนใน เปิด) → open ไม่ใช่ closed", () => {
    expect(parseStatusReport("เปิดแล้ว ตลาดไทยย้อนยุค", PLACES)).toEqual({
      placeId: "p2",
      status: "open",
    });
  });
  it("ไม่มีคำว่าเปิด/ปิด → null", () => {
    expect(parseStatusReport("สวัสดีครับ", PLACES)).toBeNull();
  });
  it("จับคู่สถานที่ไม่ได้ → null", () => {
    expect(parseStatusReport("ปิด ร้านที่ไม่อยู่ในระบบ", PLACES)).toBeNull();
  });
});
