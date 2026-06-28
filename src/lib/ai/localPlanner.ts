import type { Place, UserProfile, Plan, PlanStop, PlanDay } from "@/lib/types";
import { orderStopsByProximity } from "@/lib/route/geo";

const TIME_SLOTS = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];

const CATEGORY_REASON: Record<string, string> = {
  temple: "แวะไหว้พระเสริมสิริมงคล",
  historical: "ตามรอยประวัติศาสตร์วีรชนบางระจัน",
  food: "ลิ้มรสของอร่อยขึ้นชื่อ ปลาแม่ลา",
  cultural: "สัมผัสวิถีชุมชนและงานช่างพื้นถิ่น",
};

function reasonFor(place: Place): string {
  return CATEGORY_REASON[place.category] ?? "จุดแวะน่าสนใจของสิงห์บุรี";
}

function toStop(place: Place, time: string): PlanStop {
  return {
    place_id: place.id,
    name: place.name,
    reason: reasonFor(place),
    suggested_time: time,
    lat: place.lat,
    lng: place.lng,
  };
}

function pickByInterest(places: Place[], interests: string[]): Place[] {
  const matched = places.filter((p) => interests.includes(p.category));
  return matched.length >= 3 ? matched : places;
}

function withTimes(stops: PlanStop[]): PlanStop[] {
  return stops.map((stop, i) => ({
    ...stop,
    suggested_time: TIME_SLOTS[i % TIME_SLOTS.length],
  }));
}

function chunkIntoDays(stops: PlanStop[], days: number): PlanDay[] {
  const perDay = Math.max(1, Math.ceil(stops.length / days));
  const result: PlanDay[] = [];
  for (let d = 0; d < days; d++) {
    const slice = withTimes(stops.slice(d * perDay, (d + 1) * perDay));
    if (slice.length) result.push({ day: d + 1, stops: slice });
  }
  return result.length ? result : [{ day: 1, stops: withTimes(stops) }];
}

export function buildLocalPlans(
  profile: UserProfile,
  places: Place[],
): { plans: Plan[] } {
  const pool = pickByInterest(places, profile.interests);
  const ordered = orderStopsByProximity(
    pool.map((p, i) => toStop(p, TIME_SLOTS[i % TIME_SLOTS.length])),
  );

  const planA: Plan = {
    title: "ครึ่งวันแบบกระชับ",
    summary: "เลือกจุดเด่นใกล้กัน เที่ยวสบายไม่เร่งรีบ",
    days: [{ day: 1, stops: withTimes(ordered.slice(0, 3)) }],
  };

  const fullStops = ordered.slice(
    0,
    Math.min(ordered.length, Math.max(profile.days * 3, 3)),
  );
  const planB: Plan = {
    title: `เต็มอิ่ม ${profile.days} วัน`,
    summary: "ครอบคลุมหลายอำเภอ ร้อยเส้นทางตามระยะใกล้-ไกล",
    days: chunkIntoDays(fullStops, profile.days),
  };

  return { plans: [planA, planB] };
}
