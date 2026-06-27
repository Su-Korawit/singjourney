"use client";

type ItemViewerProps = {
  modelUrl: string;
  name: string;
  reveal?: "gold";
};

export function ItemViewer({
  modelUrl,
  name,
  reveal,
}: ItemViewerProps) {
  const isGoldReveal = reveal === "gold";

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={
          isGoldReveal
            ? "relative grid place-items-center rounded-full bg-gold/10 p-3"
            : "grid place-items-center"
        }
        style={
          isGoldReveal
            ? {
                animation:
                  "sj-gold-reveal 620ms cubic-bezier(0.16, 1, 0.3, 1) both",
                boxShadow:
                  "0 0 0 1px rgb(200 150 47 / 28%), 0 0 42px rgb(200 150 47 / 42%), inset 0 0 32px rgb(200 150 47 / 18%)",
              }
            : undefined
        }
      >
        {isGoldReveal && (
          <>
            <span className="pointer-events-none absolute inset-2 rounded-full border border-gold/35" />
            <span className="pointer-events-none absolute inset-8 rounded-full bg-gold/20 blur-2xl" />
          </>
        )}
        <model-viewer
          src={modelUrl}
          alt={name}
          camera-controls
          auto-rotate
          ar="false"
          className="relative z-10"
          style={{ width: "260px", height: "260px" }}
        />
      </div>
      <p className="font-head text-lg font-bold text-clay-deep">{name}</p>
      {isGoldReveal && (
        <style>{`
          @keyframes sj-gold-reveal {
            0% {
              opacity: 0;
              transform: scale(0.78);
              filter: drop-shadow(0 0 0 rgb(200 150 47 / 0));
            }
            58% {
              opacity: 1;
              transform: scale(1.06);
              filter: drop-shadow(0 0 28px rgb(200 150 47 / 0.72));
            }
            100% {
              opacity: 1;
              transform: scale(1);
              filter: drop-shadow(0 0 18px rgb(200 150 47 / 0.45));
            }
          }
        `}</style>
      )}
    </div>
  );
}
