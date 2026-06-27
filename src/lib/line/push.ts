import type { SupabaseClient } from "@supabase/supabase-js";
import type { OverrideStatus } from "@/lib/types";

const PUSH_URL = "https://api.line.me/v2/bot/message/push";

export function buildStatusMessage(placeName: string, status: OverrideStatus): string {
  return status === "closed"
    ? `แจ้งเตือน: "${placeName}" ปิดให้บริการชั่วคราว (อัปเดตโดยชุมชน) ตรวจสอบก่อนเดินทางนะ`
    : `ข่าวดี: "${placeName}" กลับมาเปิดให้บริการแล้ว (อัปเดตโดยชุมชน)`;
}

export async function pushLineMessage(opts: {
  to: string;
  text: string;
  accessToken: string;
  fetchImpl?: typeof fetch;
}): Promise<void> {
  const f = opts.fetchImpl ?? fetch;
  const res = await f(PUSH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.accessToken}`,
    },
    body: JSON.stringify({ to: opts.to, messages: [{ type: "text", text: opts.text }] }),
  });
  if (!res.ok) throw new Error(`LINE push failed: ${res.status}`);
}

export async function pushStatusToInterestedUsers(
  supabase: SupabaseClient,
  placeId: string,
  placeName: string,
  status: OverrideStatus,
  deps: {
    accessToken: string;
    push?: (opts: {
      to: string;
      text: string;
      accessToken: string;
      fetchImpl?: typeof fetch;
    }) => Promise<void>;
  },
): Promise<number> {
  const push = deps.push ?? pushLineMessage;
  const { data: checkins } = await supabase
    .from("checkins")
    .select("user_id")
    .eq("place_id", placeId);
  const userIds = [...new Set((checkins ?? []).map((c: { user_id: string }) => c.user_id))];
  if (userIds.length === 0) return 0;

  const { data: users } = await supabase
    .from("users")
    .select("line_user_id")
    .in("id", userIds);
  const recipients = (users ?? []).map((u: { line_user_id: string }) => u.line_user_id);

  const text = buildStatusMessage(placeName, status);
  await Promise.all(
    recipients.map((to) => push({ to, text, accessToken: deps.accessToken })),
  );
  return recipients.length;
}
