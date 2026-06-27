"use client";
import type { SingEvent } from "@/lib/types";
import { PlaceImage } from "@/components/media/PlaceImage";
import { placeById } from "@/lib/data/places";

export function EventCard({ event, onPlan }: { event: SingEvent; onPlan: (id: string) => void }) {
  const anchors = event.anchor_place_ids.map(placeById).filter(Boolean);
  return (
    <article className="group overflow-hidden rounded-card border border-clay/10 bg-rice shadow-[0_18px_48px_rgba(92,42,30,0.10)] transition hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_24px_64px_rgba(92,42,30,0.16)]">
      <PlaceImage src={event.image_url} name={event.name} ratio="16/9" eyebrow={event.when_label} />
      <div className="p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-clay px-3 py-1 font-head text-xs font-bold text-rice">{event.district}</span>
          <span className="font-head text-xs font-bold text-gold">{event.when_label}</span>
        </div>
        <h2 className="mt-3 font-display text-3xl leading-tight text-clay-deep">{event.name}</h2>
        <p className="mt-2 font-head text-sm font-semibold text-clay">{event.tagline}</p>
        <p className="mt-3 text-sm leading-6 text-clay-deep/75">{event.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {anchors.map((p) => (
            <span key={p!.id} className="rounded-full border border-clay/15 bg-paper/70 px-3 py-1 text-xs text-clay-deep/80">
              {p!.name}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onPlan(event.id)}
          className="mt-5 w-full rounded-full bg-clay px-4 py-3 font-head font-bold text-rice shadow-[0_10px_24px_rgba(156,59,46,0.24)] transition hover:-translate-y-0.5 hover:bg-clay-deep"
        >
          วางแผนรอบงานนี้
        </button>
      </div>
    </article>
  );
}
