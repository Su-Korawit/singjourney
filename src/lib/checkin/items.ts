import type { Item3D, UserItem } from "@/lib/types";

export function awardItem(
  owned: UserItem[],
  item: Item3D,
  userId: string,
): { added: UserItem[]; awarded: boolean } {
  if (owned.some((u) => u.item_id === item.id))
    return { added: owned, awarded: false };
  const next: UserItem = {
    id: crypto.randomUUID(),
    user_id: userId,
    item_id: item.id,
    used: false,
  };
  return { added: [...owned, next], awarded: true };
}

export function useConsumable(owned: UserItem[], itemId: string): UserItem[] {
  return owned.map((u) => (u.item_id === itemId ? { ...u, used: true } : u));
}
