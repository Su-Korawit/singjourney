import { NextResponse } from "next/server";
import { buildLineAuthUrl } from "@/lib/line/auth";

export async function GET(req: Request) {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  const redirectUri = process.env.LINE_LOGIN_REDIRECT_URI;

  // Fallback เดโม: ถ้ายังไม่ตั้งค่า LINE → ตั้ง mock user แล้วกลับหน้าแรก (ปุ่ม/flow ยังเดินได้)
  if (!channelId || !redirectUri) {
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.set("sj_uid", "mock-user", { httpOnly: true, path: "/" });
    return res;
  }

  const state = crypto.randomUUID();
  const res = NextResponse.redirect(buildLineAuthUrl({ channelId, redirectUri, state }));
  res.cookies.set("sj_oauth_state", state, { httpOnly: true, path: "/", maxAge: 600 });
  return res;
}
