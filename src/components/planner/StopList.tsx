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

function Row({ stop }: { stop: PlanStop }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stop.place_id });
  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="cursor-grab rounded border bg-white p-3 shadow-sm"
    >
      <span className="mr-2 text-gray-400">⠿</span>
      <span className="font-medium">{stop.name}</span>
      <span className="ml-2 text-sm text-gray-500">{stop.suggested_time}</span>
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
        <ul className="flex flex-col gap-2">
          {stops.map((s) => (
            <Row key={s.place_id} stop={s} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
