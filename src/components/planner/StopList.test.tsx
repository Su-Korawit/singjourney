/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StopList } from "./StopList";

const stops = [
  {
    place_id: "1",
    name: "วัดพระนอน",
    reason: "",
    suggested_time: "09:00",
    lat: 14.86,
    lng: 100.37,
  },
  {
    place_id: "2",
    name: "ค่ายบางระจัน",
    reason: "",
    suggested_time: "11:00",
    lat: 14.93,
    lng: 100.25,
  },
];

describe("StopList", () => {
  it("แสดงชื่อสถานที่ทุกจุด", () => {
    render(<StopList stops={stops} onReorder={vi.fn()} />);
    expect(screen.getByText("วัดพระนอน")).toBeInTheDocument();
    expect(screen.getByText("ค่ายบางระจัน")).toBeInTheDocument();
  });
});
