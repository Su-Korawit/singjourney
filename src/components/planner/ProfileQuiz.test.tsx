/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProfileQuiz } from "./ProfileQuiz";

describe("ProfileQuiz", () => {
  it("เรียก onComplete พร้อม profile เมื่อกดสร้างแผน", async () => {
    const onComplete = vi.fn();
    render(<ProfileQuiz onComplete={onComplete} />);
    await userEvent.click(screen.getByRole("button", { name: /สร้างแผน/ }));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete.mock.calls[0][0]).toHaveProperty("budget");
  });
});
