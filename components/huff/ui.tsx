"use client";

import { useEffect, type ReactNode } from "react";
import {
  Activity,
  AudioWaveform,
  Briefcase,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  Droplets,
  Home,
  MapPin,
  Mountain,
  ShieldCheck,
  Sprout,
  Users,
  Waves,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVELS, type HazardId, type Level } from "@/lib/huff/types";
import type { PlaceLabel } from "@/lib/huff/data";

export const LEVEL_CLS: Record<Level, { solid: string; soft: string; dot: string; border: string }> = {
  0: { solid: "bg-lv0 text-on-lv0", soft: "bg-lv0-soft text-lv0-ink", dot: "bg-lv0", border: "border-lv0" },
  1: { solid: "bg-lv1 text-on-lv1", soft: "bg-lv1-soft text-lv1-ink", dot: "bg-lv1", border: "border-lv1" },
  2: { solid: "bg-lv2 text-on-lv2", soft: "bg-lv2-soft text-lv2-ink", dot: "bg-lv2", border: "border-lv2" },
  3: { solid: "bg-lv3 text-on-lv3", soft: "bg-lv3-soft text-lv3-ink", dot: "bg-lv3", border: "border-lv3" },
  4: { solid: "bg-lv4 text-on-lv4", soft: "bg-lv4-soft text-lv4-ink", dot: "bg-lv4", border: "border-lv4" },
};

const NONE_CLS = {
  solid: "bg-muted text-muted-foreground",
  soft: "bg-muted text-muted-foreground",
  dot: "bg-muted-foreground",
  border: "border-border",
};

export function levelCls(level: Level | null) {
  return level === null ? NONE_CLS : LEVEL_CLS[level];
}

export const HAZARD_ICON: Record<HazardId, LucideIcon> = {
  rain: CloudRain,
  flood: Droplets,
  flash: CloudRainWind,
  storm: CloudLightning,
  landslide: Mountain,
  quake: Activity,
  aftershock: AudioWaveform,
  tsunami: Waves,
};

export const PLACE_ICON: Record<PlaceLabel, LucideIcon> = {
  home: Home,
  hometown: Sprout,
  work: Briefcase,
  family: Users,
  other: MapPin,
};

export function LevelPill({
  level,
  short = false,
  className,
}: {
  level: Level | null;
  short?: boolean;
  className?: string;
}) {
  const text = level === null ? "Chưa có dữ liệu" : short ? LEVELS[level].short : LEVELS[level].label;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        levelCls(level).solid,
        className,
      )}
    >
      {text}
    </span>
  );
}

export function SourceBadge({ kind }: { kind: "official" | "model" }) {
  return kind === "official" ? (
    <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
      <ShieldCheck className="size-3.5" aria-hidden />
      Nguồn chính thức
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
      <ShieldCheck className="size-3.5" aria-hidden />
      Dữ liệu dự báo chính thức
    </span>
  );
}

export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Đóng"
        className="huff-fade absolute inset-0 bg-foreground/40"
        onClick={onClose}
      />
      <div className="huff-sheet relative flex max-h-[88dvh] w-full max-w-md flex-col rounded-t-3xl bg-card shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <h2 className="text-base font-bold text-balance">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground"
            aria-label="Đóng"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="huff-safe-bottom overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      aria-hidden
    />
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{children}</h2>
      {action}
    </div>
  );
}
