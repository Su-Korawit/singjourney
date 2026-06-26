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
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Profile Quiz</h2>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">ผู้ร่วมเดินทาง</span>
        <select
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          className="rounded border p-2"
        >
          <option value="ครอบครัวมีลูกเล็ก">ครอบครัวมีลูกเล็ก</option>
          <option value="เพื่อนกลุ่ม">เพื่อนกลุ่ม</option>
          <option value="คู่รัก">คู่รัก</option>
          <option value="เดินทางคนเดียว">เดินทางคนเดียว</option>
        </select>
      </label>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">งบประมาณ</legend>
        {BUDGET_OPTIONS.map((o) => (
          <label key={o.value} className="flex items-center gap-2">
            <input
              type="radio"
              name="budget"
              checked={budget === o.value}
              onChange={() => setBudget(o.value)}
            />
            {o.label}
          </label>
        ))}
      </fieldset>
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">สนใจ</legend>
        {INTEREST_OPTIONS.map((o) => (
          <label key={o.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={interests.includes(o.value)}
              onChange={() => toggleInterest(o.value)}
            />
            {o.label}
          </label>
        ))}
      </fieldset>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">จำนวนวัน</span>
        <input
          type="number"
          min={1}
          max={7}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="rounded border p-2"
        />
      </label>
      <button
        type="button"
        onClick={submit}
        className="rounded bg-orange-600 px-4 py-2 text-white"
      >
        สร้างแผน
      </button>
    </div>
  );
}
