"use client";

import { useEffect, useState } from "react";
import type { Item3D } from "@/lib/types";

export function MyCollection() {
  const [items, setItems] = useState<Item3D[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sj_items");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* Collection is a non-critical browser cache. */
    }
  }, []);

  return (
    <section className="mx-auto mt-10 max-w-6xl">
      <h2 className="font-display text-4xl text-clay-deep">คลังของฉัน</h2>
      <p className="mt-1 text-sm text-clay-deep/70">
        ไอเทมและคูปองที่ปลดล็อกจากการเช็คอินจริง
      </p>
      {items.length === 0 ? (
        <div className="mt-5 rounded-card border border-dashed border-clay/25 bg-rice/70 p-8 text-center text-clay-deep/60">
          ยังไม่มีไอเทม - ไปเช็คอินบน Roadmap เพื่อปลดล็อกของสะสม 3D
          และคูปอง
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-card border border-gold/25 bg-rice p-5 shadow-[0_12px_32px_rgba(92,42,30,0.10)]"
            >
              <span className="rounded-full bg-gold/15 px-3 py-1 font-head text-xs font-bold text-gold">
                {item.type === "discount" ? "คูปอง" : "ของสะสม"}
              </span>
              <h3 className="mt-2 font-head text-xl font-bold text-clay-deep">
                {item.name}
              </h3>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
