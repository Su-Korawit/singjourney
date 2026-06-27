import { NextResponse } from "next/server";
import { verifyLineSignature } from "@/lib/line/signature";
import { parseStatusReport } from "@/lib/line/report";
import { handleStatusReport } from "@/lib/line/webhook";
import { createServerClient } from "@/lib/supabase/server";
import type { Place } from "@/lib/types";

type LineEvent = {
  type: string;
  source?: { userId?: string };
  message?: { type: string; text?: string };
};

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-line-signature");
  const secret = process.env.LINE_MESSAGING_CHANNEL_SECRET ?? "";
  if (!verifyLineSignature(secret, raw, signature)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const body = JSON.parse(raw) as { events: LineEvent[] };
  const supabase = createServerClient();
  const { data: places } = await supabase.from("places").select("id, name");
  const placeList = (places ?? []) as Pick<Place, "id" | "name">[];

  for (const ev of body.events) {
    if (ev.type !== "message" || ev.message?.type !== "text" || !ev.source?.userId) continue;
    const parsed = parseStatusReport(ev.message.text ?? "", placeList);
    if (!parsed) continue;
    await handleStatusReport(supabase, ev.source.userId, parsed, new Date());
  }
  return NextResponse.json({ ok: true });
}
