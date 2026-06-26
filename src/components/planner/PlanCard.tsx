import type { Plan } from "@/lib/types";

export function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (p: Plan) => void;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-bold">{plan.title}</h3>
      <p className="text-sm text-gray-600">{plan.summary}</p>
      <ul className="mt-2 text-sm">
        {plan.days
          .flatMap((d) => d.stops)
          .map((s) => (
            <li key={s.place_id}>
              • {s.suggested_time} {s.name} — {s.reason}
            </li>
          ))}
      </ul>
      <button
        type="button"
        onClick={() => onSelect(plan)}
        className="mt-3 rounded bg-orange-600 px-3 py-1 text-white"
      >
        ใช้แผนนี้
      </button>
    </div>
  );
}
