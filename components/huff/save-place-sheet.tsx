"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useHuff } from "@/contexts/huff-context";
import { PLACE_LABELS, cleanText, type PlaceLabel } from "@/lib/huff/data";
import { PLACE_ICON, Sheet } from "./ui";

export interface SaveDraft {
  name: string;
  area: string;
  lat: number;
  lon: number;
  editId?: string;
  label?: PlaceLabel;
}

export function SavePlaceSheet({ draft, onClose }: { draft: SaveDraft | null; onClose: () => void }) {
  const { addPlace, updatePlace } = useHuff();
  const [name, setName] = useState("");
  const [label, setLabel] = useState<PlaceLabel>("home");

  useEffect(() => {
    if (draft) {
      setName(draft.name);
      setLabel(draft.label ?? "home");
    }
  }, [draft]);

  const submit = () => {
    if (!draft) return;
    const clean = cleanText(name, 60);
    if (!clean) return;
    if (draft.editId) {
      updatePlace(draft.editId, { name: clean, label });
      onClose();
    } else if (addPlace({ name: clean, label, lat: draft.lat, lon: draft.lon, area: draft.area })) {
      onClose();
    }
  };

  return (
    <Sheet open={!!draft} onClose={onClose} title={draft?.editId ? "Sửa địa điểm" : "Lưu địa điểm"}>
      {draft && (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {draft.area && <p className="text-sm text-muted-foreground">{draft.area}</p>}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Tên hiển thị</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault();
              }}
              maxLength={60}
              className="rounded-xl border-2 bg-background px-3 py-2.5 text-base outline-none focus:border-primary"
              placeholder="Ví dụ: Nhà bố mẹ"
            />
          </label>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 text-sm font-semibold">Loại địa điểm</legend>
            <div className="flex flex-wrap gap-2">
              {PLACE_LABELS.map((l) => {
                const Icon = PLACE_ICON[l.id];
                const active = label === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setLabel(l.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border-2 px-3 py-2 text-sm font-semibold",
                      active ? "border-primary bg-primary/10 text-primary" : "border-border bg-card",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {l.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <button
            type="submit"
            disabled={!name.trim()}
            className="rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {draft.editId ? "Lưu thay đổi" : "Lưu vào tài khoản Pi"}
          </button>
        </form>
      )}
    </Sheet>
  );
}
