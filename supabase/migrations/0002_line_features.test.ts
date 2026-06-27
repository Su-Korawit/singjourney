import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const sql = readFileSync(
  join(process.cwd(), "supabase/migrations/0002_line_features.sql"),
  "utf8",
);

describe("0002_line_features.sql", () => {
  it("สร้างตาราง users พร้อม line_user_id", () => {
    expect(sql).toMatch(/create table if not exists users/i);
    expect(sql).toContain("line_user_id");
  });
  it("สร้างตาราง place_reporters พร้อม verified", () => {
    expect(sql).toMatch(/create table if not exists place_reporters/i);
    expect(sql).toContain("verified");
  });
  it("สร้างตาราง place_status_overrides จำกัด status เป็น open/closed", () => {
    expect(sql).toMatch(/create table if not exists place_status_overrides/i);
    expect(sql).toMatch(/status in \('open','closed'\)/);
    expect(sql).toContain("expires_at");
  });
});
