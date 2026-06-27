"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileQuiz } from "@/components/planner/ProfileQuiz";
import { PlanCard } from "@/components/planner/PlanCard";
import type { Plan, UserProfile } from "@/lib/types";

export default function PlanPage() {
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onComplete(profile: UserProfile) {
    setLoading(true);
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
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
