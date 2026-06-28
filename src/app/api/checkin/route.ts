import { NextResponse } from "next/server";
import { itemForPlace } from "@/lib/data/items";

export async function POST(req: Request) {
  const { place_id } = (await req.json()) as { place_id: string };
  return NextResponse.json({ item: itemForPlace(place_id) });
}
