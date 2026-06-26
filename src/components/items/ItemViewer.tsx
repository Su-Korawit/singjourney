"use client";
export function ItemViewer({
  modelUrl,
  name,
}: {
  modelUrl: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <model-viewer
        src={modelUrl}
        alt={name}
        camera-controls
        auto-rotate
        ar="false"
        style={{ width: "260px", height: "260px" }}
      />
      <p className="font-medium">{name}</p>
    </div>
  );
}
