"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileQuiz } from "@/components/planner/ProfileQuiz";
import { PlanCard } from "@/components/planner/PlanCard";
import { ShowcasePlanCard } from "@/components/planner/ShowcasePlanCard";
import { MaeLaFish } from "@/components/brand/MaeLaFish";
import { getShowcasePlans } from "@/lib/demo/showcase";
import { eventById } from "@/lib/data/events";
import { placeById } from "@/lib/data/places";
import type { Plan, SingEvent, UserProfile } from "@/lib/types";

const SHOWCASE_PLANS = getShowcasePlans();

function buildEventContext(event: SingEvent) {
  const anchorPlaceNames = event.anchor_place_ids
    .map((id) => placeById(id)?.name ?? id)
    .join(", ");

  return `ผู้ใช้ต้องการเที่ยวรอบงาน "${event.name}" (${event.when_label}, อำเภอ${event.district}) โดยมีสถานที่ anchor คือ ${anchorPlaceNames} โปรดจัดทริปให้เริ่มจากงานนี้และต่อด้วยสถานที่ใกล้เคียงที่คุ้มค่าการมา`;
}

function PlanPageContent() {
  const [aiPlans, setAiPlans] = useState<Plan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const anchorEvent = eventById(params.get("event") ?? "");

  async function onComplete(profile: UserProfile) {
    setLoading(true);
    setError(null);
    const eventContext = anchorEvent
      ? buildEventContext(anchorEvent)
      : undefined;
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          eventContext ? { ...profile, eventContext } : profile,
        ),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.plans) {
        throw new Error(data?.error ?? `AI วางแผนไม่สำเร็จ (${res.status})`);
      }
      setAiPlans(data.plans);
    } catch {
      setError("ขออภัย ระบบวางแผนขัดข้องชั่วคราว แสดงแผนตัวอย่างแทน");
    } finally {
      setLoading(false);
    }
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
      {!aiPlans && anchorEvent && (
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
      {error && (
        <div className="mb-5 rounded-card border border-clay/30 bg-clay/5 px-4 py-3">
          <p className="font-head text-sm font-bold text-clay-deep">{error}</p>
        </div>
      )}
      {loading && (
        <div className="mt-5 rounded-card border border-clay/10 bg-rice/85 p-5 shadow-[0_18px_48px_rgba(92,42,30,0.12)]">
          <p className="flex items-center gap-2 font-head text-sm font-bold text-clay-deep">
            <MaeLaFish className="h-5 w-auto animate-pulse text-gold" />
            AI กำลังวางแผน...
          </p>
          <div className="mt-4 space-y-3">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-clay/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-gold/15" />
            <div className="h-4 w-5/6 animate-pulse rounded-full bg-clay/10" />
          </div>
        </div>
      )}
      {aiPlans && !loading && (
        <div className="flex flex-col gap-5">
          {aiPlans.map((p, i) => (
            <PlanCard key={i} plan={p} onSelect={select} />
          ))}
        </div>
      )}
      {!aiPlans && !loading && (
        <>
          {!anchorEvent && (
            <div className="mb-6">
              <p className="flex items-center gap-2 font-head text-xs font-bold uppercase tracking-[0.24em] text-gold">
                <MaeLaFish className="h-4 w-auto" />
                ขั้นที่ 1
              </p>
              <h1 className="mt-1 font-display text-3xl text-clay-deep sm:text-4xl">
                ตอบ 3 ข้อ ให้ AI จัดทริปสิงห์บุรีให้คุณ
              </h1>
              <p className="mt-2 text-sm leading-6 text-clay-deep/70">
                บอกสไตล์การเที่ยวสั้นๆ แล้วเลือกแผนที่ถูกใจ เราจะส่งต่อขึ้น Roadmap
                บนแผนที่ให้ทันที
              </p>
            </div>
          )}
          <ProfileQuiz onComplete={onComplete} />
          <div className="mt-10">
            <p className="mb-4 font-head text-xs font-bold uppercase tracking-[0.24em] text-gold">
              หรือดูแผนตัวอย่างที่จัดไว้แล้ว
            </p>
            <div className="flex flex-col gap-5">
              {SHOWCASE_PLANS.map((plan) => (
                <ShowcasePlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </>
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
            <p className="font-head text-sm font-bold text-clay-deep">
              กำลังโหลด...
            </p>
          </div>
        </main>
      }
    >
      <PlanPageContent />
    </Suspense>
  );
}
