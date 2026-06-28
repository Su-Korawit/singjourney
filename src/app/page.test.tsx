/** @vitest-environment jsdom */
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(cleanup);

describe("Home", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2026-06-06T02:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("presents the Bang Rachan hero with a real image and events feature card", () => {
    render(<Home />);

    expect(screen.getByText("แผ่นดินวีรชนบางระจัน")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "สิงห์บุรีไม่ใช่ทางผ่าน แต่คือปลายทางที่อยากให้คุณค้างคืน",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "จากสมรภูมิวีรชนบางระจัน สู่พระนอนองค์ใหญ่ ปลาแม่ลาริมเจ้าพระยา และงานบุญทั้งปี เราเชื่อมทุกจุดแข็งให้เป็นทริปเดียวที่ทำให้คุณอยากค้างคืน ไม่ใช่แค่ขับรถผ่าน",
      ),
    ).toBeInTheDocument();

    const heroImage = screen.getByRole("img", {
      name: "อนุสาวรีย์วีรชนค่ายบางระจัน",
    });
    expect(heroImage).toHaveAttribute("src", "/images/hero-bangrachan.jpg");

    const eventsCard = screen.getByRole("link", { name: /อีเวนต์/ });
    expect(eventsCard).toHaveAttribute("href", "/events");
    expect(
      screen.getByText("ปฏิทินงานเทศกาลทั้งปีของสิงห์บุรี กดวางแผนรอบงานแล้วต่อทริปวัด-ตลาด-ของกินใกล้งานได้ทันที"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("ฟีเจอร์หลัก")).toHaveClass(
      "md:grid-cols-2",
      "lg:grid-cols-4",
    );
  });

  it("แสดงคำขวัญจังหวัดและแถบสถานที่ที่เปิดอยู่ตอนนี้", () => {
    render(<Home />);
    expect(screen.getByText(/ถิ่นวีรชนคนกล้า/)).toBeInTheDocument();
    expect(screen.getByText(/เปิดอยู่ตอนนี้/)).toBeInTheDocument();
  });
});
