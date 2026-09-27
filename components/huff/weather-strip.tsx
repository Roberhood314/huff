"use client";

import { Droplet, Thermometer, Umbrella, Wind } from "lucide-react";
import type { CurrentWeather } from "@/lib/huff/types";
import { fmtNum, fmtTime } from "@/lib/huff/format";

export function WeatherStrip({ weather, error }: { weather: CurrentWeather | null; error: boolean }) {
  if (!weather) {
    return (
      <div className="rounded-2xl border bg-card p-4 text-sm text-muted-foreground">
        {error ? "Chưa lấy được dữ liệu thời tiết. Ứng dụng sẽ tự thử lại." : "Đang tải thời tiết…"}
      </div>
    );
  }
  const stats = [
    { icon: Thermometer, label: "Cảm giác", value: `${fmtNum(weather.feels)}°` },
    { icon: Droplet, label: "Độ ẩm", value: `${fmtNum(weather.humidity)}%` },
    { icon: Wind, label: "Gió / giật", value: `${fmtNum(weather.wind)}/${fmtNum(weather.gust)} km/h` },
    { icon: Umbrella, label: "Mưa hiện tại", value: `${fmtNum(weather.precip, 1)} mm` },
  ];
  return (
    <section className="flex flex-col gap-3 rounded-2xl border bg-card p-4" aria-label="Thời tiết hiện tại">
      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">Thời tiết lúc {fmtTime(weather.time)}</span>
          <span className="text-lg font-bold">{weather.label}</span>
        </div>
        <span className="huff-nums text-4xl font-extrabold leading-none">{fmtNum(weather.temp)}°C</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <s.icon className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="flex min-w-0 flex-col">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="huff-nums truncate text-sm font-semibold">{s.value}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Nguồn: mô hình dự báo ECMWF · NOAA · JMA · DWD qua Open-Meteo</p>
    </section>
  );
}
