"use client";

type DistrictMapProps = {
  onSelect: (district: string) => void;
};

const districts = [
  {
    name: "อินทร์บุรี",
    path: "M154 25 L262 46 L246 122 L171 116 L128 73 Z",
    labelX: 194,
    labelY: 74,
  },
  {
    name: "พรหมบุรี",
    path: "M263 47 L348 92 L329 166 L246 122 Z",
    labelX: 292,
    labelY: 111,
  },
  {
    name: "เมืองสิงห์บุรี",
    path: "M171 116 L246 122 L244 210 L147 218 L104 165 Z",
    labelX: 174,
    labelY: 166,
  },
  {
    name: "ท่าช้าง",
    path: "M247 124 L329 166 L309 251 L244 210 Z",
    labelX: 279,
    labelY: 193,
  },
  {
    name: "บางระจัน",
    path: "M103 166 L147 218 L135 330 L55 286 L44 204 Z",
    labelX: 92,
    labelY: 244,
  },
  {
    name: "ค่ายบางระจัน",
    path: "M148 220 L244 211 L310 252 L238 360 L136 330 Z",
    labelX: 203,
    labelY: 282,
  },
];

export function DistrictMap({ onSelect }: DistrictMapProps) {
  return (
    <figure className="relative overflow-hidden rounded-[2rem] border border-clay/15 bg-rice p-4 shadow-2xl shadow-clay-deep/10 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(200,150,47,0.2),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(156,59,46,0.14),transparent_35%)]" />
      <svg
        viewBox="0 0 390 390"
        role="img"
        aria-labelledby="district-map-title district-map-description"
        className="relative z-10 h-auto w-full"
      >
        <title id="district-map-title">แผนที่ 6 อำเภอสิงห์บุรี</title>
        <desc id="district-map-description">
          เลือกอำเภอเพื่อไปยัง Roadmap ของพื้นที่นั้น
        </desc>

        <path
          d="M286 24 C272 104 290 162 257 231 C231 286 203 320 186 368"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="12"
          className="text-gold/35"
        />
        <path
          d="M286 24 C272 104 290 162 257 231 C231 286 203 320 186 368"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
          className="text-rice"
        />

        {districts.map((district) => (
          <g
            key={district.name}
            role="button"
            tabIndex={0}
            aria-label={district.name}
            onClick={() => onSelect(district.name)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(district.name);
              }
            }}
            className="group cursor-pointer outline-none transition-transform duration-200 hover:-translate-y-1 active:-translate-y-1 focus-visible:-translate-y-1"
          >
            <path
              d={district.path}
              className="fill-clay/20 stroke-clay-deep/25 stroke-2 transition-colors duration-200 group-hover:fill-gold/75 group-active:fill-gold/75 group-focus-visible:fill-gold/75"
            />
            <path
              d={district.path}
              fill="none"
              className="stroke-rice/80 stroke-[5]"
            />
            <text
              x={district.labelX}
              y={district.labelY}
              textAnchor="middle"
              className="pointer-events-none select-none fill-clay-deep font-head text-[15px] font-semibold transition-colors group-hover:fill-clay-deep group-focus-visible:fill-clay-deep"
            >
              {district.name}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="relative z-10 mt-3 text-center text-sm text-clay-deep/65">
        แตะอำเภอเพื่อเปิด Roadmap พร้อมพื้นที่ที่เลือกไว้
      </figcaption>
    </figure>
  );
}
