"use client";

import { TriangleAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { HAZARD_MAP, LEVELS, type RiskReport } from "@/lib/huff/types";
import { fmtRelative } from "@/lib/huff/format";
import { levelCls } from "./ui";

export function StatusHero({ report }: { report: RiskReport }) {
  const level = report.overall;
  const top =
    level !== null && level > 0
      ? report.items.filter((i) => i.level === level).map((i) => HAZARD_MAP[i.hazard].name)
      : [];
  const Icon = level !== null && level >= 2 ? TriangleAlert : ShieldCheck;

  return (
    <section
      className={cn("flex flex-col gap-2 rounded-3xl p-5", levelCls(level).solid)}
      aria-live="polite"
      aria-label="Mức cảnh báo cao nhất"
    >
      <div className="flex items-center gap-2 text-sm font-semibold opacity-90">
        <Icon className="size-4" aria-hidden />
        Mức cảnh báo cao nhất
      </div>
      <p className="text-3xl font-extrabold leading-tight text-balance">
        {level === null ? "Chưa có dữ liệu" : LEVELS[level].label}
      </p>
      {top.length > 0 && <p className="font-semibold text-pretty">{top.join(" · ")}</p>}
      <p className="text-sm leading-relaxed opacity-90 text-pretty">
        {level === null ? "Đang chờ dữ liệu từ nguồn chính thức." : LEVELS[level].advice}
      </p>
      <p className="text-xs font-medium opacity-80">Cập nhật {fmtRelative(report.generatedAt)}</p>
    </section>
  );
}
