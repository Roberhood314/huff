"use client";

import { useHuff } from "@/contexts/huff-context";
import { useRisk } from "@/hooks/use-risk";
import type { Place } from "@/lib/huff/data";
import { LEVELS } from "@/lib/huff/types";
import { cn } from "@/lib/utils";
import { PLACE_ICON, SectionTitle, levelCls } from "./ui";

function Chip({ place }: { place: Place }) {
  const { setTarget } = useHuff();
  const { data } = useRisk(place.lat, place.lon);
  const level = data?.overall ?? null;
  const Icon = PLACE_ICON[place.label];
  return (
    <button
      type="button"
      onClick={() => {
        setTarget({ kind: "place", id: place.id });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="flex w-40 shrink-0 flex-col gap-2 rounded-2xl border bg-card p-3 text-left active:bg-muted"
    >
      <span className="flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-primary" aria-hidden />
        <span className="truncate text-sm font-semibold">{place.name}</span>
      </span>
      <span className={cn("rounded-lg px-2 py-1 text-xs font-bold", levelCls(level).solid)}>
        {level === null ? "Đang tải…" : LEVELS[level].short}
      </span>
    </button>
  );
}

export function SavedStrip({ excludeId }: { excludeId?: string }) {
  const { places, setTab } = useHuff();
  const list = places.filter((p) => p.id !== excludeId);
  if (list.length === 0) return null;
  return (
    <section className="flex flex-col gap-3" aria-label="Địa điểm đã lưu">
      <SectionTitle
        action={
          <button type="button" onClick={() => setTab("places")} className="text-sm font-semibold text-primary">
            Xem tất cả
          </button>
        }
      >
        Địa điểm đã lưu
      </SectionTitle>
      <div className="huff-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {list.map((p) => (
          <Chip key={p.id} place={p} />
        ))}
      </div>
    </section>
  );
}
