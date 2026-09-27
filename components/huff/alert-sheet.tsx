"use client";

import type { ReactNode } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { HAZARD_MAP, LEVELS, type Quake, type RiskItem } from "@/lib/huff/types";
import { fmtDateTime, fmtRelative } from "@/lib/huff/format";
import { HAZARD_ICON, LevelPill, Sheet, SourceBadge, levelCls } from "./ui";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl bg-muted/60 p-3">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold leading-snug">{children}</span>
    </div>
  );
}

export function AlertSheet({
  item,
  quakes,
  onClose,
}: {
  item: RiskItem | null;
  quakes: Quake[];
  onClose: () => void;
}) {
  const meta = item ? HAZARD_MAP[item.hazard] : null;
  const Icon = item ? HAZARD_ICON[item.hazard] : null;
  const showQuakes = item && (item.hazard === "quake" || item.hazard === "aftershock" || item.hazard === "tsunami");
  const nearQuakes = quakes.filter((q) => q.distanceKm <= 1000).slice(0, 6);

  return (
    <Sheet open={!!item} onClose={onClose} title={meta ? `Cảnh báo ${meta.name.toLowerCase()}` : ""}>
      {item && meta && Icon && (
        <div className="flex flex-col gap-4">
          <div className={cn("flex items-center gap-3 rounded-2xl p-4", levelCls(item.level).soft)}>
            <Icon className="size-8 shrink-0" aria-hidden />
            <div className="flex min-w-0 flex-col gap-1.5">
              <LevelPill level={item.level} />
              {item.metric && <span className="huff-nums text-sm font-semibold">{item.metric}</span>}
            </div>
          </div>

          <p className="leading-relaxed text-pretty">{item.summary}</p>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Mức cảnh báo">{item.level === null ? "Chưa có dữ liệu" : LEVELS[item.level].label}</Field>
            <Field label="Thời gian cập nhật">{fmtDateTime(item.updatedAt)}</Field>
            <Field label="Hiệu lực đến">{item.validUntil ? fmtDateTime(item.validUntil) : "—"}</Field>
            <Field label="Loại nguồn">
              <SourceBadge kind={item.source.kind} />
            </Field>
          </div>

          <div className="flex flex-col gap-1 rounded-xl border p-3">
            <span className="text-xs font-medium text-muted-foreground">Nguồn tin</span>
            <a
              href={item.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              {item.source.name}
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            </a>
          </div>

          {item.level !== null && (
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-bold">Khuyến nghị</h3>
              <p className="text-sm leading-relaxed text-foreground/80">{LEVELS[item.level].advice}</p>
            </div>
          )}

          {item.details.length > 0 && (
            <ul className="flex flex-col gap-2">
              {item.details.map((d) => (
                <li key={d} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          )}

          {showQuakes && nearQuakes.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-bold">Động đất gần đây (bán kính 1.000 km)</h3>
              <ul className="flex flex-col divide-y rounded-xl border">
                {nearQuakes.map((q) => (
                  <li key={q.id}>
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5"
                    >
                      <span className="huff-nums w-12 shrink-0 font-bold">M{q.mag.toFixed(1)}</span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm">{q.place}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(q.distanceKm)} km · {fmtRelative(q.time)}
                          {q.tsunami ? " · có bản tin sóng thần" : ""}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.officialRef && (
            <a
              href={item.officialRef.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <span className="text-pretty">Xem bản tin chính thức của Việt Nam: {item.officialRef.name}</span>
              <ExternalLink className="size-4 shrink-0" aria-hidden />
            </a>
          )}
        </div>
      )}
    </Sheet>
  );
}
