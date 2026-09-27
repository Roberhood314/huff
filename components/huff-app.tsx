"use client";

import { useState } from "react";
import { Radar } from "lucide-react";
import { HuffProvider, useHuff } from "@/contexts/huff-context";
import { DashboardScreen } from "./huff/dashboard-screen";
import { SearchScreen } from "./huff/search-screen";
import { PlacesScreen } from "./huff/places-screen";
import { InfoScreen } from "./huff/info-screen";
import { BottomNav } from "./huff/bottom-nav";
import { ConsentSheet } from "./huff/consent-sheet";
import { StorageSheet } from "./huff/storage-sheet";

function SaveNotice() {
  const { saveStatus } = useHuff();
  const [open, setOpen] = useState(false);
  if (saveStatus === "ok") return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4" role="status">
        <div className="flex items-center gap-3 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">
          {saveStatus === "full" ? "Bộ nhớ tài khoản Pi đã đầy" : "Đang thử lưu lại vào tài khoản Pi…"}
          {saveStatus === "full" && (
            <button type="button" onClick={() => setOpen(true)} className="font-semibold underline">
              Giải phóng
            </button>
          )}
        </div>
      </div>
      <StorageSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Toast() {
  const { toast } = useHuff();
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4" role="status">
      <div className="huff-fade rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg">
        {toast}
      </div>
    </div>
  );
}

function Shell() {
  const { ready, tab } = useHuff();
  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
        <span className="flex size-14 animate-pulse items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Radar className="size-7" aria-hidden />
        </span>
        <p className="font-semibold">Huff đang khởi động…</p>
      </div>
    );
  }
  return (
    <div className="mx-auto min-h-dvh max-w-md pb-28">
      <main key={tab} className="huff-fade">
        {tab === "home" && <DashboardScreen />}
        {tab === "search" && <SearchScreen />}
        {tab === "places" && <PlacesScreen />}
        {tab === "info" && <InfoScreen />}
      </main>
      <BottomNav />
      <ConsentSheet />
      <SaveNotice />
      <Toast />
    </div>
  );
}

export function HuffApp() {
  return (
    <HuffProvider>
      <Shell />
    </HuffProvider>
  );
}
