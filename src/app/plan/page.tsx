"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileQuiz } from "@/components/planner/ProfileQuiz";
import { PlanCard } from "@/components/planner/PlanCard";
import { eventById } from "@/lib/data/events";
import { placeById } from "@/lib/data/places";
import type { Plan, SingEvent, UserProfile } from "@/lib/types";

function buildEventContext(event: SingEvent) {
  const anchorPlaceNames = event.anchor_place_ids
    .map((id) => placeById(id)?.name ?? id)
    .join(", ");

  return `ผู้ใช้ต้องการเที่ยวรอบงาน "${event.name}" (${event.when_label}, อำเภอ${event.district}) โดยมีสถานที่ anchor คือ ${anchorPlaceNames} โปรดจัดทริปให้เริ่มจากงานนี้และต่อด้วยสถานที่ใกล้เคียงที่คุ้มค่าการมา`;
}

function PlanPageContent() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const anchorEvent = eventById(params.get("event") ?? "");

  async function onComplete(profile: UserProfile) {
    setLoading(true);
    const eventContext = anchorEvent
      ? buildEventContext(anchorEvent)
      : undefined;
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        eventContext ? { ...profile, eventContext } : profile,
      ),
    });
    const data = await res.json();
    setPlans(data.plans);
    setLoading(false);
  }

  function select(plan: Plan) {
    localStorage.setItem(
      "sj_stops",
      JSON.stringify(plan.days.flatMap((d) => d.stops)),
    );
    router.push("/map");
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      {!plans && anchorEvent && (
        <div className="mb-5 rounded-card border border-gold/30 bg-rice px-4 py-3">
          <p className="font-head text-xs font-bold uppercase tracking-[0.24em] text-gold">
            วางแผนรอบงาน
          </p>
          <p className="mt-1 font-head text-lg font-bold text-clay-deep">
            {anchorEvent.name}
          </p>
          <p className="text-sm text-clay-deep/70">
            {anchorEvent.when_label} · {anchorEvent.district}
          </p>
        </div>
      )}
      {!plans && <ProfileQuiz onComplete={onComplete} />}
      {loading && (
        <div className="mt-5 rounded-card border border-clay/10 bg-rice/85 p-5 shadow-[0_18px_48px_rgba(92,42,30,0.12)]">
          <p className="font-head text-sm font-bold text-clay-deep">
            AI กำลังวางแผน…
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-clay/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-gold/15" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-clay/10" />
          </div>
        </div>
      )}
      {plans && (
        <div className="flex flex-col gap-5">
          {plans.map((p, i) => (
            <PlanCard key={i} plan={p} onSelect={select} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function PlanPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl p-6">
          <div className="rounded-card border border-clay/10 bg-rice/85 p-5">
            <p className="font-head text-sm font-bold text-clay-deep">กำลังโหลด…</p>
          </div>
        </main>
      }
    >
      <PlanPageContent />
    </Suspense>
  );
}
