"use client";
import { useState } from "react";

type Props = {
  src: string | null;
  name: string;
  ratio?: "16/9" | "4/3";
  className?: string;
  eyebrow?: string;
};

export function PlaceImage({ src, name, ratio = "16/9", className = "", eyebrow = "Swap-Point" }: Props) {
  const [failed, setFailed] = useState(false);
  const aspect = ratio === "4/3" ? "aspect-[4/3]" : "aspect-video";
  const showImg = src && !failed;

  return (
    <div className={`relative overflow-hidden bg-[linear-gradient(135deg,rgba(156,59,46,0.18),rgba(200,150,47,0.28))] ${aspect} ${className}`}>
      {showImg ? (
        <img
          src={src}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-4">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(92,42,30,0.05)_25%,transparent_25%,transparent_50%,rgba(92,42,30,0.05)_50%,rgba(92,42,30,0.05)_75%,transparent_75%,transparent)] bg-[length:24px_24px]" />
          <div className="relative rounded-full border border-gold/30 bg-rice/85 px-4 py-2 text-center backdrop-blur">
            <p className="font-head text-xs font-bold uppercase tracking-[0.24em] text-gold">{eyebrow}</p>
            <p className="mt-1 max-w-48 font-head font-bold text-clay-deep">{name}</p>
          </div>
        </div>
      )}
    </div>
  );
}
