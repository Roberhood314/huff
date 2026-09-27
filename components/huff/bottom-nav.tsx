"use client";

import { Bookmark, Info, Radar, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHuff, type TabId } from "@/contexts/huff-context";

const TABS: { id: TabId; label: string; icon: typeof Radar }[] = [
  { id: "home", label: "Bảng tin", icon: Radar },
  { id: "search", label: "Tìm kiếm", icon: Search },
  { id: "places", label: "Đã lưu", icon: Bookmark },
  { id: "info", label: "Thông tin", icon: Info },
];

export function BottomNav() {
  const { tab, setTab, places } = useHuff();
  return (
    <nav
      className="huff-safe-bottom fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 backdrop-blur"
      aria-label="Điều hướng chính"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                onClick={() => {
                  setTab(t.id);
                  window.scrollTo({ top: 0 });
                }}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex w-full flex-col items-center gap-1 py-2.5 text-xs font-semibold",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className={cn("flex h-8 w-14 items-center justify-center rounded-full", active && "bg-primary/10")}>
                  <t.icon className="size-5" aria-hidden />
                </span>
                {t.label}
                {t.id === "places" && places.length > 0 && (
                  <span className="huff-nums absolute right-1/2 top-1.5 translate-x-6 rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">
                    {places.length}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
