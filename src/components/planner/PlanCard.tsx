import type { Plan } from "@/lib/types";

export function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (p: Plan) => void;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-clay/10 bg-rice shadow-[0_20px_55px_rgba(92,42,30,0.14)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(92,42,30,0.18)]">
      <div className="relative aspect-video bg-[radial-gradient(circle_at_20%_20%,rgba(200,150,47,0.32),transparent_30%),linear-gradient(135deg,rgba(156,59,46,0.88),rgba(92,42,30,0.92))] p-5">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(251,247,239,0.12)_25%,transparent_25%,transparent_50%,rgba(251,247,239,0.12)_50%,rgba(251,247,239,0.12)_75%,transparent_75%,transparent)] bg-[length:28px_28px]" />
        <div className="relative flex h-full items-end">
          <p className="max-w-[80%] font-head text-2xl font-bold leading-tight text-rice drop-shadow-sm">
            {plan.title}
          </p>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-head text-xl font-bold text-clay-deep">
          {plan.title}
        </h3>
        <p className="mt-1 text-sm leading-6 text-clay-deep/70">
          {plan.summary}
        </p>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          {plan.days
            .flatMap((d) => d.stops)
            .map((s) => (
              <li
                key={s.place_id}
                className="rounded-full border border-clay/10 bg-paper/65 px-3 py-2 text-clay-deep/80"
              >
                <span className="font-head font-bold text-gold">
                  {s.suggested_time}
                </span>{" "}
                {s.name}: {s.reason}
              </li>
            ))}
        </ul>
        <button
          type="button"
          onClick={() => onSelect(plan)}
          className="mt-5 w-full rounded-full bg-clay px-4 py-2.5 font-head font-bold text-rice shadow-[0_12px_28px_rgba(156,59,46,0.24)] transition hover:-translate-y-0.5 hover:bg-clay-deep"
        >
          ใช้แผนนี้
        </button>
      </div>
    </div>
  );
}
