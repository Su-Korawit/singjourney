import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCodeForProfile } from "@/lib/line/auth";
import { upsertUserFromProfile } from "@/lib/line/users";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const jar = await cookies();
  const expectedState = jar.get("sj_oauth_state")?.value;

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(new URL("/?login=error", req.url));
  }

  const profile = await exchangeCodeForProfile({
    code,
    channelId: process.env.LINE_LOGIN_CHANNEL_ID!,
    channelSecret: process.env.LINE_LOGIN_CHANNEL_SECRET!,
    redirectUri: process.env.LINE_LOGIN_REDIRECT_URI!,
  });
  const user = await upsertUserFromProfile(createServerClient(), profile);

  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("sj_uid", user.id, { httpOnly: true, path: "/" });
  return res;
}
