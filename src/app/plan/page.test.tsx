/** @vitest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlanPage from "./page";

const navigation = vi.hoisted(() => ({
  push: vi.fn(),
  search: "",
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
  useSearchParams: () => new URLSearchParams(navigation.search),
}));

describe("PlanPage", () => {
  beforeEach(() => {
    navigation.push.mockClear();
    navigation.search = "";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ plans: [] }),
      }),
    );
  });

  it("แสดง anchor event banner และแนบ eventContext ตอนสร้างแผน", async () => {
    navigation.search = "event=e1";
    render(<PlanPage />);

    expect(screen.getByText("วางแผนรอบงาน")).toBeInTheDocument();
    expect(screen.getByText("งานรำลึกวีรชนค่ายบางระจัน")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /สร้างแผน/ }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    const body = JSON.parse(
      vi.mocked(fetch).mock.calls[0][1]?.body as string,
    ) as { eventContext?: string };
    expect(body.eventContext).toContain("งานรำลึกวีรชนค่ายบางระจัน");
    expect(body.eventContext).toContain("อุทยานค่ายบางระจัน & อนุสาวรีย์วีรชน");
    expect(body.eventContext).toContain("ต้นเดือนกุมภาพันธ์ทุกปี");
  });
});
