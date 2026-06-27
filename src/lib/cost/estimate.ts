import { haversine, type LatLng } from "@/lib/route/geo";

const MEAL_BAHT = 120;
const MEALS_PER_DAY = 2;
const TRANSPORT_BAHT_PER_KM = 8;
const RANGE = 0.15;

export type CostStop = LatLng & { avg_price: number | null };

const round10 = (n: number) => Math.round(n / 10) * 10;

export function estimateCost(
  stops: CostStop[],
  travelers: number,
  opts: { days?: number } = {},
): { low: number; high: number } {
  const days = opts.days ?? 1;
  const entrance = stops.reduce((s, p) => s + (p.avg_price ?? 0), 0) * travelers;
  const meals = MEAL_BAHT * MEALS_PER_DAY * days * travelers;
  let km = 0;
  for (let i = 1; i < stops.length; i++) km += haversine(stops[i - 1], stops[i]);
  const transport = km * TRANSPORT_BAHT_PER_KM;
  const mid = entrance + meals + transport;
  return { low: round10(mid * (1 - RANGE)), high: round10(mid * (1 + RANGE)) };
}

export function formatBaht(r: { low: number; high: number }): string {
  const f = (n: number) => "\u0e3f" + n.toLocaleString("en-US");
  return `${f(r.low)} ถึง ${f(r.high)} ต่อคน`;
}
