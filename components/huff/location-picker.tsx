"use client";

import { Check, LocateFixed, Search } from "lucide-react";
import { useHuff } from "@/contexts/huff-context";
import { PLACE_LABEL_NAME } from "@/lib/huff/data";
import { PLACE_ICON, Sheet } from "./ui";

export function LocationPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { places, target, setTarget, requestLocation, geo, useLocation, setTab } = useHuff();

  const row =
    "flex w-full items-center gap-3 rounded-2xl border bg-card px-4 py-3 text-left active:bg-muted";

  return (
    <Sheet open={open} onClose={onClose} title="Chọn nơi cần xem">
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className={row}
          onClick={() => {
            onClose();
            requestLocation();
          }}
        >
          <LocateFixed className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="flex flex-1 flex-col">
            <span className="font-semibold">Vị trí hiện tại</span>
            <span className="text-sm text-muted-foreground">
              {useLocation
                ? geo.status === "denied"
                  ? "Trình duyệt đang chặn quyền vị trí"
                  : "Đọc lại vị trí của bạn"
                : "Cần bạn cho phép trước khi dùng"}
            </span>
          </span>
          {target?.kind === "current" && <Check className="size-5 text-primary" aria-label="Đang xem" />}
        </button>

        {places.map((p) => {
          const Icon = PLACE_ICON[p.label];
          const active = target?.kind === "place" && target.id === p.id;
          return (
            <button
              key={p.id}
              type="button"
              className={row}
              onClick={() => {
                setTarget({ kind: "place", id: p.id });
                onClose();
              }}
            >
              <Icon className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">{p.name}</span>
                <span className="truncate text-sm text-muted-foreground">
                  {PLACE_LABEL_NAME[p.label]}
                  {p.area ? ` · ${p.area}` : ""}
                </span>
              </span>
              {active && <Check className="size-5 text-primary" aria-label="Đang xem" />}
            </button>
          );
        })}

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"
          onClick={() => {
            onClose();
            setTab("search");
          }}
        >
          <Search className="size-4" aria-hidden />
          Tìm địa điểm khác
        </button>
      </div>
    </Sheet>
  );
}
