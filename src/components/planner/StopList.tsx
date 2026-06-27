"use client";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { PlanStop } from "@/lib/types";

function Row({ stop, order }: { stop: PlanStop; order: number }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stop.place_id });
  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="group cursor-grab rounded-card border border-clay/10 bg-rice px-4 py-3 shadow-[0_12px_30px_rgba(92,42,30,0.10)] transition hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-[0_16px_38px_rgba(92,42,30,0.14)]"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-clay font-head text-sm font-bold text-rice shadow-[0_8px_18px_rgba(156,59,46,0.22)]">
          {order}
        </span>
        <span className="text-gold/70 transition group-hover:text-gold">⠿</span>
        <span className="flex-1 font-medium text-clay-deep">{stop.name}</span>
        <span className="rounded-full bg-gold/10 px-3 py-1 font-head text-sm font-bold text-gold">
          {stop.suggested_time}
        </span>
      </div>
    </li>
  );
}

export function StopList({
  stops,
  onReorder,
}: {
  stops: PlanStop[];
  onReorder: (n: PlanStop[]) => void;
}) {
  function handleEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = stops.findIndex((s) => s.place_id === active.id);
    const newIdx = stops.findIndex((s) => s.place_id === over.id);
    onReorder(arrayMove(stops, oldIdx, newIdx));
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleEnd}>
      <SortableContext
        items={stops.map((s) => s.place_id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex flex-col gap-3">
          {stops.map((s, index) => (
            <Row key={s.place_id} stop={s} order={index + 1} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
