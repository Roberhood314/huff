const pad = (n: number) => String(n).padStart(2, "0");

export function fmtDateTime(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function fmtTime(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtRelative(ms: number, now = Date.now()): string {
  const diff = Math.max(0, now - ms);
  const m = Math.round(diff / 60_000);
  if (m < 1) return "vừa xong";
  if (m < 60) return `${m} phút trước`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} giờ trước`;
  return `${Math.round(h / 24)} ngày trước`;
}

export function fmtNum(v: number, digits = 0): string {
  return v.toLocaleString("vi-VN", { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}
