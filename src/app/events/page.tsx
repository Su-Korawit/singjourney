"use client";
import { useRouter } from "next/navigation";
import { EVENTS, MARKETS } from "@/lib/data/events";
import { EventCard } from "@/components/events/EventCard";
import { MarketCard } from "@/components/events/MarketCard";
import { getMarketStatuses } from "@/lib/demo/showcase";

export default function EventsPage() {
  const router = useRouter();
  const sorted = [...EVENTS].sort((a, b) => a.month - b.month);

  const marketStatuses = getMarketStatuses();
  function getMarketStatus(id: string): "open" | "closing" | "closed" {
    return marketStatuses.find((s) => s.id === id)?.status ?? "open";
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-head text-sm font-semibold uppercase tracking-[0.3em] text-gold">
          Event &rarr; Destination
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-clay-deep sm:text-6xl">
          ปฏิทินงานสิงห์บุรี มางาน แล้วอยู่ต่อ
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-clay-deep/75">
          ทุกงานไม่ได้จบแค่ 2-3 วัน กด&ldquo;วางแผนรอบงานนี้&rdquo; แล้วให้ AI ต่อทริปวันต่อ
          วันและร้านอาหารใกล้งานให้คุณ เปลี่ยนอีเวนต์ให้เป็นเหตุผลที่ต้องค้างคืน
        </p>

        {/* เทศกาลประจำปี */}
        <div className="mt-12">
          <h2 className="font-display text-3xl text-clay-deep">เทศกาลประจำปี</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((e) => (
              <EventCard key={e.id} event={e} onPlan={(id) => router.push(`/plan?event=${id}`)} />
            ))}
          </div>
        </div>

        {/* ตลาด/ของกินท้องถิ่น */}
        <div className="mt-16">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-display text-3xl text-clay-deep">ตลาด/ของกินท้องถิ่น</h2>
            <p className="text-sm text-clay-deep/60">
              สถานะอัปเดตโดยเจ้าของร้านผ่าน LINE OA
            </p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {MARKETS.map((m) => (
              <MarketCard
                key={m.id}
                market={m}
                status={getMarketStatus(m.id)}
                onPlan={() => router.push("/plan")}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
