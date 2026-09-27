"use client";

import { useState } from "react";
import useSWR from "swr";
import { Trash2 } from "lucide-react";
import { pi } from "@/lib/pi";
import { PLACES_KEY, PREFS_KEY } from "@/lib/huff/data";
import { Sheet, Spinner } from "./ui";

const KEY_NAMES: Record<string, string> = {
  [PLACES_KEY]: "Địa điểm đã lưu của Huff",
  [PREFS_KEY]: "Lựa chọn quyền vị trí của Huff",
};

export function StorageSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, isLoading, error, mutate } = useSWR(open ? "pi-user-keys" : null, () => pi.userState.keys());
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const keys = Array.isArray(data) ? data.filter((k): k is string => typeof k === "string") : [];

  const remove = async (key: string) => {
    if (confirm !== key) {
      setConfirm(key);
      return;
    }
    setBusy(key);
    try {
      await pi.userState.delete(key);
      await mutate();
    } finally {
      setBusy(null);
      setConfirm(null);
    }
  };

  return (
    <Sheet open={open} onClose={onClose} title="Dữ liệu trong tài khoản Pi">
      <div className="flex flex-col gap-3">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nếu bộ nhớ tài khoản đầy, hãy xóa bớt mục cũ không cần thiết. Xóa mục của Huff sẽ xóa dữ liệu tương ứng khi mở lại ứng dụng.
        </p>
        {isLoading && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner /> Đang tải…
          </p>
        )}
        {error && <p className="text-sm text-muted-foreground">Không tải được danh sách. Vui lòng thử lại sau.</p>}
        {!isLoading && !error && keys.length === 0 && (
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu nào được lưu.</p>
        )}
        <ul className="flex flex-col gap-2">
          {keys.map((k) => (
            <li key={k} className="flex items-center gap-3 rounded-xl border p-3">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold">{KEY_NAMES[k] ?? "Dữ liệu khác"}</span>
                <span className="huff-nums truncate text-xs text-muted-foreground">{k}</span>
              </span>
              <button
                type="button"
                disabled={busy === k}
                onClick={() => void remove(k)}
                className={
                  confirm === k
                    ? "flex items-center gap-1 rounded-lg bg-lv3 px-3 py-2 text-xs font-semibold text-on-lv3"
                    : "flex items-center gap-1 rounded-lg border px-3 py-2 text-xs font-semibold"
                }
              >
                {busy === k ? <Spinner /> : <Trash2 className="size-3.5" aria-hidden />}
                {confirm === k ? "Xác nhận xóa" : "Xóa"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Sheet>
  );
}
