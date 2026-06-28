import type { PlanStop } from "@/lib/types";

export type SavedTrip = {
  id: string;
  title: string;
  savedAt: string;
  stops: PlanStop[];
};

export function addTrip(list: SavedTrip[], trip: SavedTrip): SavedTrip[] {
  return [trip, ...list];
}

export function removeTrip(list: SavedTrip[], id: string): SavedTrip[] {
  return list.filter((t) => t.id !== id);
}
