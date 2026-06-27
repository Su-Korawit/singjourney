import { describe, it, expect, vi } from "vitest";
import { buildLineAuthUrl, exchangeCodeForProfile } from "@/lib/line/auth";

describe("buildLineAuthUrl", () => {
  it("ใส่ params ครบและชี้ปลายทาง LINE authorize", () => {
    const url = buildLineAuthUrl({
      channelId: "1234",
      redirectUri: "https://app.test/api/auth/line/callback",
      state: "xyz",
    });
    expect(url).toContain("https://access.line.me/oauth2/v2.1/authorize");
    expect(url).toContain("response_type=code");
    expect(url).toContain("client_id=1234");
    expect(url).toContain("state=xyz");
    expect(url).toContain("scope=profile");
  });
});

describe("exchangeCodeForProfile", () => {
  it("แลก code เป็น token แล้วดึงโปรไฟล์", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: "tok" }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ userId: "U1", displayName: "ปอนด์", pictureUrl: "http://img" }),
      });
    const profile = await exchangeCodeForProfile({
      code: "code1",
      channelId: "1234",
      channelSecret: "secret",
      redirectUri: "https://app.test/cb",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(profile).toEqual({ userId: "U1", displayName: "ปอนด์", pictureUrl: "http://img" });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("token ล้มเหลว → โยน error", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce({ ok: false, status: 400 });
    await expect(
      exchangeCodeForProfile({
        code: "x",
        channelId: "1",
        channelSecret: "s",
        redirectUri: "r",
        fetchImpl: fetchImpl as unknown as typeof fetch,
      }),
    ).rejects.toThrow(/token/i);
  });
});
