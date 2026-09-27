"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { HAZARD_MAP, type RiskItem } from "@/lib/huff/types";
import { fmtDateTime } from "@/lib/huff/format";
import { HAZARD_ICON, LevelPill, levelCls } from "./ui";

export function HazardCard({ item, onOpen }: { item: RiskItem; onOpen: () => void }) {
  const Icon = HAZARD_ICON[item.hazard];
  const meta = HAZARD_MAP[item.hazard];
  const cls = levelCls(item.level);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-start gap-3 rounded-2xl border bg-card p-3.5 text-left transition-colors active:bg-muted"
    >
      <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", cls.soft)}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold">{meta.name}</span>
          <LevelPill level={item.level} short />
        </span>
        <span className="text-sm leading-relaxed text-foreground/80 text-pretty">{item.summary}</span>
        <span className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>Nguồn: {item.source.kind === "official" ? "USGS" : "Mô hình dự báo"}</span>
          <span>Cập nhật {fmtDateTime(item.updatedAt)}</span>
          {item.validUntil && <span>Hiệu lực đến {fmtDateTime(item.validUntil)}</span>}
        </span>
      </span>
      <ChevronRight className="mt-3 size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );
}
