"use client";
import { useState } from "react";
import type { PlaceCategory, UserProfile } from "@/lib/types";

const BUDGET_OPTIONS = [
  { value: "low" as const, label: "ประหยัด" },
  { value: "medium" as const, label: "ปานกลาง" },
  { value: "high" as const, label: "สบาย ๆ" },
];

const INTEREST_OPTIONS: { value: PlaceCategory; label: string }[] = [
  { value: "temple", label: "วัด" },
  { value: "historical", label: "ประวัติศาสตร์" },
  { value: "food", label: "อาหาร" },
  { value: "kids", label: "ครอบครัว/เด็ก" },
  { value: "adventure", label: "ผจญภัย" },
  { value: "cultural", label: "วัฒนธรรม" },
];

export function ProfileQuiz({
  onComplete,
}: {
  onComplete: (p: UserProfile) => void;
}) {
  const [travelers, setTravelers] = useState("ครอบครัวมีลูกเล็ก");
  const [budget, setBudget] = useState<UserProfile["budget"]>("low");
  const [interests, setInterests] = useState<PlaceCategory[]>(["temple"]);
  const [days, setDays] = useState(1);

  function toggleInterest(cat: PlaceCategory) {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  }

  function submit() {
    onComplete({ travelers, budget, interests, days });
  }

  return (
    <div className="rounded-card border border-clay/10 bg-rice/90 p-5 shadow-[0_18px_48px_rgba(92,42,30,0.12)] sm:p-6">
      <p className="font-head text-xs font-bold uppercase tracking-[0.28em] text-gold">
        Step 01
      </p>
      <h2 className="mt-1 font-head text-2xl font-bold text-clay-deep">
        Profile Quiz
      </h2>
      <div className="mt-5 flex flex-col gap-4">
        <label className="rounded-card border border-clay/10 bg-paper/70 p-4">
          <span className="font-head text-sm font-bold text-clay-deep">
            ผู้ร่วมเดินทาง
          </span>
          <select
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            className="mt-2 w-full rounded-full border border-clay/15 bg-rice px-4 py-2 text-clay-deep outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          >
            <option value="ครอบครัวมีลูกเล็ก">ครอบครัวมีลูกเล็ก</option>
            <option value="เพื่อนกลุ่ม">เพื่อนกลุ่ม</option>
            <option value="คู่รัก">คู่รัก</option>
            <option value="เดินทางคนเดียว">เดินทางคนเดียว</option>
          </select>
        </label>
        <fieldset className="rounded-card border border-clay/10 bg-paper/70 p-4">
          <legend className="font-head text-sm font-bold text-clay-deep">
            Step 02 · งบประมาณ
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGET_OPTIONS.map((o) => (
              <label key={o.value}>
                <input
                  type="radio"
                  name="budget"
                  checked={budget === o.value}
                  onChange={() => setBudget(o.value)}
                  className="peer sr-only"
                />
                <span className="block rounded-full border border-clay/15 bg-rice px-4 py-2 text-sm font-medium text-clay-deep transition peer-checked:border-clay peer-checked:bg-clay peer-checked:text-rice peer-focus-visible:ring-2 peer-focus-visible:ring-gold/30">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="rounded-card border border-clay/10 bg-paper/70 p-4">
          <legend className="font-head text-sm font-bold text-clay-deep">
            Step 03 · สนใจ
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((o) => (
              <label key={o.value}>
                <input
                  type="checkbox"
                  checked={interests.includes(o.value)}
                  onChange={() => toggleInterest(o.value)}
                  className="peer sr-only"
                />
                <span className="block rounded-full border border-gold/25 bg-rice px-4 py-2 text-sm font-medium text-clay-deep transition peer-checked:border-gold peer-checked:bg-gold peer-checked:text-clay-deep peer-focus-visible:ring-2 peer-focus-visible:ring-clay/20">
                  {o.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="rounded-card border border-clay/10 bg-paper/70 p-4">
          <span className="font-head text-sm font-bold text-clay-deep">
            Step 04 · จำนวนวัน
          </span>
          <input
            type="number"
            min={1}
            max={7}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-2 w-full rounded-full border border-clay/15 bg-rice px-4 py-2 text-clay-deep outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
          />
        </label>
        <button
          type="button"
          onClick={submit}
          className="rounded-full bg-clay px-5 py-3 font-head font-bold text-rice shadow-[0_14px_30px_rgba(156,59,46,0.24)] transition hover:-translate-y-0.5 hover:bg-clay-deep"
        >
          สร้างแผน
        </button>
      </div>
    </div>
  );
}
