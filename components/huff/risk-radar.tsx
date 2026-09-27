"use client";

import { HAZARDS, LEVELS, type HazardId, type Level, type RiskItem } from "@/lib/huff/types";

const SIZE = 400;
const C = SIZE / 2;
const RI = 54;
const rOf = (l: number) => 72 + l * 21;
const SECTOR = 360 / HAZARDS.length;
const GAP = 1.6;

function polar(r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

function wedge(ri: number, ro: number, a0: number, a1: number) {
  const [x0, y0] = polar(ro, a0);
  const [x1, y1] = polar(ro, a1);
  const [x2, y2] = polar(ri, a1);
  const [x3, y3] = polar(ri, a0);
  return `M${x0} ${y0} A${ro} ${ro} 0 0 1 ${x1} ${y1} L${x2} ${y2} A${ri} ${ri} 0 0 0 ${x3} ${y3} Z`;
}

export function RiskRadar({
  items,
  overall,
  onSelect,
}: {
  items: RiskItem[];
  overall: Level | null;
  onSelect: (h: HazardId) => void;
}) {
  const byId = new Map(items.map((i) => [i.hazard, i]));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
      <div
        className="huff-sweep pointer-events-none absolute rounded-full"
        style={{ inset: `${((C - rOf(4)) / SIZE) * 100}%` }}
        aria-hidden
      />
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-full w-full" role="img" aria-label="Radar mức rủi ro theo loại thiên tai">
        {HAZARDS.map((h, i) => {
          const a0 = -90 + i * SECTOR + GAP;
          const a1 = -90 + (i + 1) * SECTOR - GAP;
          return (
            <path key={`track-${h.id}`} d={wedge(RI, rOf(4), a0, a1)} style={{ fill: "var(--muted)" }} />
          );
        })}

        {[1, 2, 3].map((l) => (
          <circle
            key={l}
            cx={C}
            cy={C}
            r={rOf(l)}
            fill="none"
            style={{ stroke: "var(--card)" }}
            strokeWidth={2}
          />
        ))}

        {HAZARDS.map((h, i) => {
          const item = byId.get(h.id);
          const level = item?.level ?? null;
          const a0 = -90 + i * SECTOR + GAP;
          const a1 = -90 + (i + 1) * SECTOR - GAP;
          const mid = -90 + (i + 0.5) * SECTOR;
          const [lx, ly] = polar(176, mid);
          return (
            <g
              key={h.id}
              role="button"
              tabIndex={0}
              aria-label={`${h.name}: ${level === null ? "chưa có dữ liệu" : LEVELS[level].short}`}
              onClick={() => onSelect(h.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(h.id);
                }
              }}
              className="cursor-pointer outline-none"
            >
              {level !== null && (
                <path
                  d={wedge(RI, rOf(level), a0, a1)}
                  fill={LEVELS[level].hex}
                  className="huff-wedge"
                  style={{ transformOrigin: `${C}px ${C}px` }}
                />
              )}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={600}
                style={{ fill: "var(--foreground)" }}
              >
                {h.short}
              </text>
            </g>
          );
        })}

        <circle cx={C} cy={C} r={RI - 4} style={{ fill: "var(--card)" }} />
        <text
          x={C}
          y={C - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={24}
          fontWeight={800}
          fill={overall === null ? "currentColor" : LEVELS[overall].hex}
        >
          {overall === null ? "—" : `Cấp ${overall}`}
        </text>
        <text
          x={C}
          y={C + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
          style={{ fill: "var(--muted-foreground)" }}
        >
          {overall === null ? "Đang tải" : LEVELS[overall].short}
        </text>
      </svg>
    </div>
  );
}
