/** @vitest-environment jsdom */
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import EventsPage from "./page";
import { MARKETS } from "@/lib/data/events";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

describe("EventsPage: markets + festivals", () => {
  it("renders ตลาด/ของกินท้องถิ่น section", () => {
    render(<EventsPage />);
    expect(screen.getByText(/ตลาด\/ของกินท้องถิ่น/)).toBeInTheDocument();
  });

  it("renders เทศกาลประจำปี section", () => {
    render(<EventsPage />);
    expect(screen.getByText(/เทศกาลประจำปี/)).toBeInTheDocument();
  });

  it("shows LINE OA attribution text", () => {
    render(<EventsPage />);
    expect(screen.getByText(/LINE OA/)).toBeInTheDocument();
  });

  it("has no em-dash or en-dash in rendered output", () => {
    render(<EventsPage />);
    const html = document.body.innerHTML;
    expect(html).not.toContain("—");
    expect(html).not.toContain("–");
  });

  it("renders status badge for at least one market", () => {
    render(<EventsPage />);
    const badges = screen.getAllByText(/เปิดอยู่|กำลังจะปิด|ปิดแล้ว/);
    expect(badges.length).toBeGreaterThan(0);
  });
});

describe("MARKETS data", () => {
  it("has exactly 4 real Singburi markets", () => {
    expect(MARKETS).toHaveLength(4);
  });

  it("contains all 4 verified Singburi markets", () => {
    const names = MARKETS.map((m) => m.name);
    expect(names).toContain("ตลาดไทยย้อนยุคบ้านระจัน");
    expect(names).toContain("ตลาดปลาแม่ลา");
    expect(names).toContain("ตลาดสดเทศบาลเมืองสิงห์บุรี");
    expect(names).toContain("ถนนคนเดินสิงห์บุรี");
  });

  it("has no em-dash in market data", () => {
    for (const m of MARKETS) {
      expect(m.description).not.toContain("—");
      expect(m.description).not.toContain("–");
      expect(m.hours).not.toContain("—");
      expect(m.hours).not.toContain("–");
    }
  });
});
