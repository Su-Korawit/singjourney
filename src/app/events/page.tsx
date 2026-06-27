"use client";
import { useRouter } from "next/navigation";
import { EVENTS } from "@/lib/data/events";
import { EventCard } from "@/components/events/EventCard";

export default function EventsPage() {
  const router = useRouter();
  const sorted = [...EVENTS].sort((a, b) => a.month - b.month);

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-head text-sm font-semibold uppercase tracking-[0.3em] text-gold">
          Event → Destination
        </p>
        <h1 className="mt-3 font-display text-5xl leading-tight text-clay-deep sm:text-6xl">
          ปฏิทินงานสิงห์บุรี มางาน แล้วอยู่ต่อ
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-clay-deep/75">
          ทุกงานไม่ได้จบแค่ 2-3 วัน  กด“วางแผนรอบงานนี้” แล้วให้ AI ต่อทริปวันต่อ
          วันและร้านอาหารใกล้งานให้คุณ เพลี่ยนอีเวนต์ให้เป็นเหตุผลที่ต้องค้างคืน
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((e) => (
            <EventCard key={e.id} event={e} onPlan={(id) => router.push(`/plan?event=${id}`)} />
          ))}
        </div>
      </section>
    </main>
  );
}
