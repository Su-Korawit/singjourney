import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildFieldMask, fetchPlaceDetails } from "./sync";

describe("places/sync", () => {
  beforeEach(() => vi.restoreAllMocks());
  it("field mask ขอเฉพาะฟิลด์เวลา/สถานะ", () => {
    expect(buildFieldMask()).toBe(
      "regularOpeningHours,currentOpeningHours,businessStatus",
    );
  });
  it("แปลงผล Google → opening_hours + business_status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          businessStatus: "OPERATIONAL",
          regularOpeningHours: {
            periods: [
              {
                open: { day: 1, hour: 8, minute: 0 },
                close: { day: 1, hour: 17, minute: 0 },
              },
            ],
          },
        }),
      }),
    );
    const out = await fetchPlaceDetails("places/abc");
    expect(out.business_status).toBe("OPERATIONAL");
    expect(out.opening_hours?.[1]).toEqual({ open: "08:00", close: "17:00" });
  });
});
