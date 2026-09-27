"use client";

import { Check, LocateFixed } from "lucide-react";
import { useHuff } from "@/contexts/huff-context";
import { Sheet } from "./ui";

const POINTS = [
  "Chỉ dùng để hiển thị thời tiết và cảnh báo tại nơi bạn đang đứng.",
  "Chỉ đọc khi bạn mở ứng dụng hoặc bấm cập nhật — không theo dõi ngầm.",
  "Tọa độ không được lưu lại; chỉ gửi tới nguồn dữ liệu để lấy cảnh báo.",
  "Bạn có thể tắt bất cứ lúc nào trong mục Thông tin.",
];

export function ConsentSheet() {
  const { consentOpen, grantLocation, declineLocation } = useHuff();
  return (
    <Sheet open={consentOpen} onClose={declineLocation} title="Cho phép Huff dùng vị trí?">
      <div className="flex flex-col gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <LocateFixed className="size-7" aria-hidden />
        </span>
        <ul className="flex flex-col gap-2.5">
          {POINTS.map((p) => (
            <li key={p} className="flex gap-2.5 text-sm leading-relaxed">
              <Check className="mt-0.5 size-4 shrink-0 text-lv0" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={grantLocation}
            className="rounded-2xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground"
          >
            Cho phép dùng vị trí
          </button>
          <button type="button" onClick={declineLocation} className="rounded-2xl border-2 bg-card px-4 py-3.5 font-semibold">
            Để sau, tôi sẽ tìm thủ công
          </button>
        </div>
      </div>
    </Sheet>
  );
}
