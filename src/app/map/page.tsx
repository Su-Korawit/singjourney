"use client";
import { useEffect, useState } from "react";
import { MapView } from "@/components/map/MapView";
import { PlaceImage } from "@/components/media/PlaceImage";
import { StopList } from "@/components/planner/StopList";
import { ItemViewer } from "@/components/items/ItemViewer";
import { PLACES, placeById } from "@/lib/data/places";
import { orderStopsByProximity } from "@/lib/route/geo";
import { createBrowserClient } from "@/lib/supabase/client";
import type { Item3D, PlanStop } from "@/lib/types";

type CheckinModalState = "awarded" | "duplicate" | "empty" | null;

const DEFAULT_TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30"];
const DEMO: PlanStop[] = PLACES.slice(0, 5).map((place, index) => ({
  place_id: place.id,
  name: place.name,
  reason: place.description,
  suggested_time: DEFAULT_TIMES[index] ?? "16:00",
  lat: place.lat,
  lng: place.lng,
}));

export default function MapPage() {
  const [stops, setStops] = useState<PlanStop[]>(DEMO);
  const [modalItem, setModalItem] = useState<Item3D | null>(null);
  const [modalMsg, setModalMsg] = useState<string | null>(null);
  const [modalState, setModalState] = useState<CheckinModalState>(null);
  const [couponUsed, setCouponUsed] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [rewardPlaceIds, setRewardPlaceIds] = useState<string[]>([]);

  useEffect(() => {
    createBrowserClient()
      .from("items_3d")
      .select("place_id")
      .then(({ data }) => {
        if (!data) return;
        const ids = [
          ...new Set(
            data
              .map((row) => row.place_id)
              .filter((id): id is string => id != null),
          ),
        ];
        setRewardPlaceIds(ids);
      });
  }, []);

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
    setModalState(null);
    setCouponUsed(false);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place_id: placeId }),
      });
      const body = await res.json();
      if (body.awarded && body.item) {
        setModalMsg("รับไอเทมสำเร็จ!");
        setModalItem(body.item);
        setModalState("awarded");
      } else if (body.item) {
        setModalMsg("คุณมีไอเทมนี้แล้ว");
        setModalItem(body.item);
        setModalState("duplicate");
      } else {
        setModalMsg("ไม่มีไอเทมที่จุดนี้");
        setModalState("empty");
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
          rewardPlaceIds={rewardPlaceIds}
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
          {stops.map((s) => {
            const place = placeById(s.place_id);
            return (
              <li
                key={s.place_id}
                className="flex items-center justify-between gap-3 rounded-card border border-clay/10 bg-paper/70 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <PlaceImage
                    src={place?.image_url ?? null}
                    name={s.name}
                    ratio="4/3"
                    className="w-16 shrink-0 rounded-2xl"
                    eyebrow="Roadmap"
                  />
                  <span className="text-sm font-medium text-clay-deep">
                    {s.name}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={checkingIn === s.place_id}
                  onClick={() => checkIn(s.place_id)}
                  className="rounded-full border border-clay/20 px-3 py-1 font-head text-xs font-bold text-clay transition hover:border-clay hover:bg-clay hover:text-rice disabled:opacity-50"
                >
                  เช็คอิน
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {(modalItem || modalMsg) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-clay-deep/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-gold/30 bg-rice shadow-[0_28px_90px_rgba(92,42,30,0.36)]">
            <div className="relative px-6 pb-6 pt-7">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-24 rounded-full bg-gold/20 blur-3xl" />
              {modalMsg && (
                <div className="relative mb-4 text-center">
                  <p className="font-head text-xs font-bold uppercase tracking-[0.28em] text-gold">
                    Check-in Reveal
                  </p>
                  <h2 className="mt-1 font-head text-2xl font-bold text-clay-deep">
                    {modalMsg}
                  </h2>
                  {modalState === "awarded" && (
                    <p className="mt-2 text-sm leading-6 text-clay-deep/70">
                      หมุนชมของสะสม 3D ที่ปลดล็อกจากจุดเช็คอินนี้
                    </p>
                  )}
                </div>
              )}
              {modalItem && (
                <>
                  <ItemViewer
                    modelUrl={modalItem.model_url}
                    name={modalItem.name}
                    reveal={modalState === "awarded" ? "gold" : undefined}
                  />
                  {modalItem.type === "discount" && (
                    <button
                      type="button"
                      disabled={couponUsed}
                      onClick={() => setCouponUsed(true)}
                      className="mt-4 w-full rounded-full bg-gold px-4 py-3 font-head font-bold text-clay-deep shadow-[0_14px_32px_rgba(200,150,47,0.28)] transition hover:-translate-y-0.5 hover:bg-gold/90 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-clay-deep/20 disabled:text-clay-deep/55 disabled:shadow-none"
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
                  setModalState(null);
                  setCouponUsed(false);
                }}
                className="mt-4 w-full rounded-full border border-clay/20 px-4 py-3 font-head font-bold text-clay-deep transition hover:border-clay hover:bg-paper"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
