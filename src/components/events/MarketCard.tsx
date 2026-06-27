"use client";
import type { Market } from "@/lib/data/events";

type Status = "open" | "closing" | "closed";

const STATUS_LABEL: Record<Status, string> = {
  open: "เปิดอยู่",
  closing: "กำลังจะปิด",
  closed: "ปิดแล้ว",
};

const STATUS_COLOR: Record<Status, string> = {
  open: "#4F7A3A",
  closing: "#C98A2B",
  closed: "#B23A2E",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-3 py-1 font-head text-xs font-bold text-white"
      style={{ backgroundColor: STATUS_COLOR[status] }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function MarketCard({
  market,
  status,
  onPlan,
}: {
  market: Market;
  status: Status;
  onPlan: (id: string) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-card border border-clay/10 bg-rice shadow-[0_18px_48px_rgba(92,42,30,0.10)] transition hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_24px_64px_rgba(92,42,30,0.16)]">
      <div className="relative flex h-32 items-center justify-center bg-[linear-gradient(135deg,rgba(79,122,58,0.18),rgba(200,150,47,0.28))]">
        <span className="font-display text-5xl opacity-30">🏪</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-clay px-3 py-1 font-head text-xs font-bold text-rice">
            {market.district}
          </span>
          <StatusBadge status={status} />
        </div>
        <h2 className="mt-3 font-display text-2xl leading-tight text-clay-deep">
          {market.name}
        </h2>
        <p className="mt-2 text-sm leading-6 text-clay-deep/75">
          {market.description}
        </p>
        <p className="mt-1 font-head text-xs font-semibold text-clay">
          {market.hours}
        </p>
        <button
          type="button"
          onClick={() => onPlan(market.id)}
          className="mt-5 w-full rounded-full bg-clay px-4 py-3 font-head font-bold text-rice shadow-[0_10px_24px_rgba(156,59,46,0.24)] transition hover:-translate-y-0.5 hover:bg-clay-deep"
        >
          วางแผนรอบงานนี้
        </button>
      </div>
    </article>
  );
}
