/** @vitest-environment jsdom */
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TripsPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("TripsPage", () => {
  afterEach(cleanup);
  beforeEach(() => localStorage.clear());

  it("แสดงสถานะว่างเมื่อไม่มีทริป", () => {
    render(<TripsPage />);
    expect(screen.getByText(/ยังไม่มีทริปที่บันทึก/)).toBeInTheDocument();
  });

  it("แสดงทริปจาก localStorage และลบได้", async () => {
    localStorage.setItem(
      "sj_trips",
      JSON.stringify([
        { id: "t1", title: "ทริปสิงห์บุรี 3 จุด", savedAt: "x", stops: [] },
      ]),
    );
    render(<TripsPage />);
    expect(screen.getByText("ทริปสิงห์บุรี 3 จุด")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "ลบ" }));
    expect(screen.queryByText("ทริปสิงห์บุรี 3 จุด")).not.toBeInTheDocument();
    expect(localStorage.getItem("sj_trips")).toBe("[]");
  });
});
