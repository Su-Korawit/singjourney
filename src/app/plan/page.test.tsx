/** @vitest-environment jsdom */
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
  afterEach(cleanup);

  beforeEach(() => {
    navigation.push.mockClear();
    navigation.search = "";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
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

  it("แสดง 3 การ์ดแผนจาก showcase ทันทีโดยไม่ต้องรอ AI", () => {
    render(<PlanPage />);
    const h3s = screen.getAllByRole("heading", { level: 3 });
    expect(h3s).toHaveLength(3);
    expect(h3s[0]).toHaveTextContent("ครอบครัวสายบุญ");
    expect(h3s[1]).toHaveTextContent("สายประวัติศาสตร์ครึ่งวัน");
    expect(h3s[2]).toHaveTextContent("สายกิน 2 วัน");
  });

  it("แสดงค่าใช้จ่ายที่มีสัญลักษณ์ ฿ และไม่มี em dash หรือ en dash ในหน้า", () => {
    render(<PlanPage />);
    const allText = document.body.textContent ?? "";
    expect(allText).toContain("฿");
    expect(allText).not.toMatch(/[—–]/);
  });

  it("มีลิงก์ ดูบนแผนที่ 3 ลิงก์ ทุกอันชี้ไป /map", () => {
    render(<PlanPage />);
    const links = screen.getAllByRole("link", { name: /ดูบนแผนที่/ });
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/map"));
  });
});
