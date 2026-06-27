"use client";
import { useEffect, useState } from "react";
import { MapView } from "@/components/map/MapView";
import { StopList } from "@/components/planner/StopList";
import { ItemViewer } from "@/components/items/ItemViewer";
import { orderStopsByProximity } from "@/lib/route/geo";
import type { Item3D, PlanStop } from "@/lib/types";

const DEMO: PlanStop[] = [
  {
    place_id: "1",
    name: "วัดพระนอนจักรสีห์",
    reason: "",
    suggested_time: "09:00",
    lat: 14.8628,
    lng: 100.3712,
  },
  {
    place_id: "2",
    name: "อนุสาวรีย์ค่ายบางระจัน",
    reason: "",
    suggested_time: "11:00",
    lat: 14.9389,
    lng: 100.2589,
  },
  {
    place_id: "3",
    name: "ตลาดไทยย้อนยุค",
    reason: "",
    suggested_time: "13:00",
    lat: 15.005,
    lng: 100.33,
  },
];

export default function MapPage() {
  const [stops, setStops] = useState<PlanStop[]>(DEMO);
  const [modalItem, setModalItem] = useState<Item3D | null>(null);
  const [modalMsg, setModalMsg] = useState<string | null>(null);
  const [couponUsed, setCouponUsed] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sj_stops");
    if (saved) {
      try {
        setStops(JSON.parse(saved));
      } catch {
        /* keep DEMO */
      }
    }
  }, []);

  async function checkIn(placeId: string) {
    setCheckingIn(placeId);
    setModalItem(null);
    setModalMsg(null);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId }),
      });
      const body = await res.json();
      if (body.awarded && body.item) {
        setModalItem(body.item);
        setCouponUsed(false);
      } else if (body.item) {
        setModalMsg("คุณมีไอเทมนี้แล้ว");
        setModalItem(body.item);
      } else {
        setModalMsg("ไม่มีไอเทมที่จุดนี้");
      }
    } finally {
      setCheckingIn(null);
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:px-6 md:grid-cols-[360px_minmax(0,1fr)] md:gap-6 md:py-8">
      <div className="sticky top-4 z-10 -mx-4 sm:mx-0 md:order-2 md:top-6">
        <MapView
          stops={stops}
          onCheckIn={checkIn}
          checkingInPlaceId={checkingIn}
        />
      </div>

      <section className="rounded-card border border-clay/10 bg-rice/85 p-4 shadow-[0_18px_45px_rgba(92,42,30,0.10)] md:order-1 md:self-start">
        <p className="mb-1 font-head text-xs font-bold uppercase tracking-[0.28em] text-gold">
          Sing Journey Roadmap
        </p>
        <h2 className="mb-3 font-head text-2xl font-bold text-clay-deep">
          จัดเส้นทางเที่ยวสิงห์บุรี
        </h2>
        <button
          type="button"
          onClick={() => setStops(orderStopsByProximity(stops))}
          className="mb-4 w-full rounded-full bg-clay px-4 py-2 font-head font-bold text-rice shadow-[0_10px_24px_rgba(156,59,46,0.24)] transition hover:-translate-y-0.5 hover:bg-clay-deep"
        >
          จัดเส้นทางอัตโนมัติ
        </button>
        <StopList stops={stops} onReorder={setStops} />
        <ul className="mt-4 flex flex-col gap-2">
          {stops.map((s) => (
            <li
              key={s.place_id}
              className="flex items-center justify-between gap-3 rounded-card border border-clay/10 bg-paper/70 px-3 py-2"
            >
              <span className="text-sm font-medium text-clay-deep">{s.name}</span>
              <button
                type="button"
                disabled={checkingIn === s.place_id}
                onClick={() => checkIn(s.place_id)}
                className="rounded-full border border-clay/20 px-3 py-1 font-head text-xs font-bold text-clay transition hover:border-clay hover:bg-clay hover:text-rice disabled:opacity-50"
              >
                เช็คอิน
              </button>
            </li>
          ))}
        </ul>
      </section>

      {(modalItem || modalMsg) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            {modalMsg && <p className="mb-3 text-center">{modalMsg}</p>}
            {modalItem && (
              <>
                <ItemViewer modelUrl={modalItem.model_url} name={modalItem.name} />
                {modalItem.type === "discount" && (
                  <button
                    type="button"
                    disabled={couponUsed}
                    onClick={() => setCouponUsed(true)}
                    className="mt-3 w-full rounded bg-amber-600 px-3 py-1 text-white disabled:opacity-50"
                  >
                    {couponUsed ? "ใช้แล้ว" : "ใช้คูปอง"}
                  </button>
                )}
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setModalItem(null);
                setModalMsg(null);
              }}
              className="mt-4 w-full rounded border px-3 py-1"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
