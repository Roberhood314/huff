"use client";

import { useState, type ReactNode } from "react";
import { Bell, Database, ExternalLink, LocateFixed, Phone, ShieldCheck } from "lucide-react";
import { useHuff } from "@/contexts/huff-context";
import { LEVELS, type Level } from "@/lib/huff/types";
import { IGP_REF, MODEL_SOURCE, NCHMF_REF, TSUNAMI_SOURCE, USGS_SOURCE } from "@/lib/huff/risk";
import { StorageSheet } from "./storage-sheet";
import { levelCls } from "./ui";
import { cn } from "@/lib/utils";

const HOTLINES = [
  { num: "112", name: "Tìm kiếm cứu nạn" },
  { num: "113", name: "Công an" },
  { num: "114", name: "Cứu hỏa" },
  { num: "115", name: "Cấp cứu" },
];

const SOURCES = [
  { name: USGS_SOURCE.name, url: USGS_SOURCE.url, note: "Động đất, dư chấn" },
  { name: TSUNAMI_SOURCE.name, url: TSUNAMI_SOURCE.url, note: "Bản tin sóng thần" },
  { name: MODEL_SOURCE.name, url: MODEL_SOURCE.url, note: "Mưa, ngập, lũ quét, giông sét, sạt lở" },
  { name: NCHMF_REF.name, url: NCHMF_REF.url, note: "Bản tin chính thức tại Việt Nam" },
  { name: IGP_REF.name, url: IGP_REF.url, note: "Bản tin động đất tại Việt Nam" },
];

function Card({ icon: Icon, title, children }: { icon: typeof Bell; title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4">
      <h2 className="flex items-center gap-2 font-bold">
        <Icon className="size-5 text-primary" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function InfoScreen() {
  const { useLocation, geo, requestLocation, disableLocation } = useHuff();
  const [storageOpen, setStorageOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold">Thông tin</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Huff không theo dõi bạn khi chưa được cho phép.
        </p>
      </header>

      <Card icon={LocateFixed} title="Quyền vị trí">
        <p className="text-sm leading-relaxed text-foreground/80">
          {useLocation
            ? geo.status === "denied"
              ? "Bạn đã cho phép trong Huff nhưng trình duyệt đang chặn. Hãy bật lại trong cài đặt trình duyệt."
              : "Đang bật. Vị trí chỉ được đọc khi bạn mở ứng dụng hoặc bấm cập nhật, không chạy ngầm và không được lưu lại."
            : "Đang tắt. Bạn vẫn dùng đầy đủ Huff bằng cách tìm địa điểm thủ công."}
        </p>
        {useLocation ? (
          <button
            type="button"
            onClick={disableLocation}
            className="rounded-xl border-2 bg-card px-4 py-2.5 text-sm font-semibold"
          >
            Tắt dùng vị trí
          </button>
        ) : (
          <button
            type="button"
            onClick={requestLocation}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Cho phép dùng vị trí
          </button>
        )}
      </Card>

      <Card icon={Bell} title="Cảnh báo đẩy">
        <p className="text-sm leading-relaxed text-foreground/80">
          Trong phiên bản này, cảnh báo cho vị trí hiện tại và từng địa điểm đã lưu được hiển thị ngay trong ứng dụng và
          tự cập nhật mỗi 10 phút. Thông báo đẩy ngoài ứng dụng sẽ được bổ sung khi nền tảng Pi hỗ trợ.
        </p>
      </Card>

      <Card icon={ShieldCheck} title="Thang mức cảnh báo">
        <ul className="flex flex-col gap-2">
          {([0, 1, 2, 3, 4] as Level[]).map((l) => (
            <li key={l} className="flex gap-3">
              <span className={cn("h-fit shrink-0 rounded-lg px-2 py-1 text-xs font-bold", levelCls(l).solid)}>
                Cấp {l}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold">{LEVELS[l].short}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{LEVELS[l].advice}</span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card icon={ExternalLink} title="Nguồn dữ liệu đã kiểm chứng">
        <ul className="flex flex-col divide-y">
          {SOURCES.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 py-2.5">
                <span className="flex flex-1 flex-col">
                  <span className="text-sm font-semibold text-primary">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.note}</span>
                </span>
                <ExternalLink className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Mức rủi ro thời tiết được đánh giá từ dữ liệu dự báo chính thức theo ngưỡng mưa của Việt Nam. Huff không hiển thị
          cảnh báo từ nguồn không xác thực.
        </p>
      </Card>

      <Card icon={Phone} title="Số khẩn cấp">
        <div className="grid grid-cols-2 gap-2">
          {HOTLINES.map((h) => (
            <a key={h.num} href={`tel:${h.num}`} className="flex flex-col rounded-xl bg-muted/60 px-3 py-2.5">
              <span className="huff-nums text-xl font-extrabold">{h.num}</span>
              <span className="text-xs text-muted-foreground">{h.name}</span>
            </a>
          ))}
        </div>
      </Card>

      <Card icon={Database} title="Dữ liệu đã lưu">
        <p className="text-sm leading-relaxed text-foreground/80">
          Chỉ danh sách địa điểm và lựa chọn quyền vị trí được lưu vào tài khoản Pi. Tọa độ vị trí hiện tại không bao giờ được lưu.
        </p>
        <button type="button" onClick={() => setStorageOpen(true)} className="rounded-xl border-2 bg-card px-4 py-2.5 text-sm font-semibold">
          Quản lý dữ liệu đã lưu
        </button>
      </Card>

      <StorageSheet open={storageOpen} onClose={() => setStorageOpen(false)} />
    </div>
  );
}
