"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { removeTrip, type SavedTrip } from "@/lib/trips/storage";
import { MaeLaFish } from "@/components/brand/MaeLaFish";

export default function TripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sj_trips");
      if (raw) setTrips(JSON.parse(raw));
    } catch {
      /* รายการทริปเป็นแคชในเบราว์เซอร์ ไม่ใช่ข้อมูลวิกฤต */
    }
  }, []);

  function open(trip: SavedTrip) {
    localStorage.setItem("sj_stops", JSON.stringify(trip.stops));
    router.push("/map");
  }

  function remove(id: string) {
    const next = removeTrip(trips, id);
    setTrips(next);
    localStorage.setItem("sj_trips", JSON.stringify(next));
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="flex items-center gap-2 font-head text-sm font-bold uppercase tracking-[0.24em] text-gold">
        <MaeLaFish className="h-4 w-auto" />
        ทริปของฉัน
      </p>
      <h1 className="mt-1 font-display text-4xl text-clay-deep">
        ทริปที่บันทึกไว้
      </h1>

      {trips.length === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-clay/25 bg-rice/70 p-8 text-center text-clay-deep/60">
          ยังไม่มีทริปที่บันทึก ไปที่ Roadmap แล้วกด บันทึกทริปนี้ เพื่อเก็บไว้
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex items-center justify-between gap-3 rounded-card border border-clay/10 bg-rice/85 px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-head font-bold text-clay-deep">
                  {trip.title}
                </p>
                <p className="text-xs text-clay-deep/60">
                  {trip.stops.length} จุด
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => open(trip)}
                  className="rounded-full bg-clay px-4 py-1.5 font-head text-xs font-bold text-rice transition hover:bg-clay-deep"
                >
                  เปิดบนแผนที่
                </button>
                <button
                  type="button"
                  onClick={() => remove(trip.id)}
                  className="rounded-full border border-clay/20 px-4 py-1.5 font-head text-xs font-bold text-clay-deep transition hover:border-clay"
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
