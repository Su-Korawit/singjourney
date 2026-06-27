/** @vitest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DistrictMap } from "./DistrictMap";

const districtNames = [
  "เมืองสิงห์บุรี",
  "บางระจัน",
  "ค่ายบางระจัน",
  "พรหมบุรี",
  "อินทร์บุรี",
  "ท่าช้าง",
];

describe("DistrictMap", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders six districts and calls onSelect with the clicked district", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(<DistrictMap onSelect={onSelect} />);

    for (const districtName of districtNames) {
      expect(
        screen.getByRole("button", { name: districtName }),
      ).toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "บางระจัน" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("บางระจัน");
  });
});
