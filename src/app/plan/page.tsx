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
    <main className="mx-auto max-w-2xl p-6">
      {!plans && <ProfileQuiz onComplete={onComplete} />}
      {loading && <p>AI กำลังวางแผน…</p>}
      {plans && (
        <div className="flex flex-col gap-4">
          {plans.map((p, i) => (
            <PlanCard key={i} plan={p} onSelect={select} />
          ))}
        </div>
      )}
    </main>
  );
}
