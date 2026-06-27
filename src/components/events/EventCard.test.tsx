/** @vitest-environment jsdom */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventCard } from "./EventCard";
import { EVENTS } from "@/lib/data/events";

describe("EventCard", () => {
  it("แสดงชื่องาน + tagline + ปุ่มวางแผน", () => {
    const e = EVENTS[0];
    const onPlan = vi.fn();
    render(<EventCard event={e} onPlan={onPlan} />);
    expect(screen.getByText(e.name)).toBeInTheDocument();
    expect(screen.getByText(e.tagline)).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /วางแผนรอบงานนี้/ });
    fireEvent.click(btn);
    expect(onPlan).toHaveBeenCalledWith(e.id);
  });
});
