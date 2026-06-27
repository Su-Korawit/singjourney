import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyLineSignature } from "@/lib/line/signature";

const SECRET = "test-channel-secret";
const BODY = JSON.stringify({ events: [] });
const validSig = crypto.createHmac("sha256", SECRET).update(BODY).digest("base64");

describe("verifyLineSignature", () => {
  it("signature ถูกต้อง → true", () => {
    expect(verifyLineSignature(SECRET, BODY, validSig)).toBe(true);
  });
  it("signature ผิด → false", () => {
    expect(verifyLineSignature(SECRET, BODY, "wrong")).toBe(false);
  });
  it("ไม่มี signature → false", () => {
    expect(verifyLineSignature(SECRET, BODY, null)).toBe(false);
  });
});
