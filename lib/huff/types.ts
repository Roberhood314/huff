export type HazardId =
  | "rain"
  | "flood"
  | "flash"
  | "storm"
  | "landslide"
  | "quake"
  | "aftershock"
  | "tsunami";

export type Level = 0 | 1 | 2 | 3 | 4;

export interface HazardMeta {
  id: HazardId;
  name: string;
  short: string;
  group: "weather" | "geo";
}

export const HAZARDS: HazardMeta[] = [
  { id: "rain", name: "Mưa lớn", short: "Mưa lớn", group: "weather" },
  { id: "flood", name: "Ngập lụt", short: "Ngập lụt", group: "weather" },
  { id: "flash", name: "Lũ quét", short: "Lũ quét", group: "weather" },
  { id: "storm", name: "Giông sét / sét", short: "Giông sét", group: "weather" },
  { id: "landslide", name: "Sạt lở đất", short: "Sạt lở", group: "weather" },
  { id: "quake", name: "Động đất", short: "Động đất", group: "geo" },
  { id: "aftershock", name: "Dư chấn", short: "Dư chấn", group: "geo" },
  { id: "tsunami", name: "Sóng thần", short: "Sóng thần", group: "geo" },
];

export const HAZARD_MAP: Record<HazardId, HazardMeta> = HAZARDS.reduce(
  (acc, h) => {
    acc[h.id] = h;
    return acc;
  },
  {} as Record<HazardId, HazardMeta>,
);

export interface LevelMeta {
  label: string;
  short: string;
  advice: string;
  hex: string;
}

export const LEVELS: Record<Level, LevelMeta> = {
  0: {
    label: "Cấp 0 · An toàn",
    short: "An toàn",
    advice: "Không có nguy cơ đáng kể. Tiếp tục theo dõi bản tin.",
    hex: "#2f9e5b",
  },
  1: {
    label: "Cấp 1 · Theo dõi",
    short: "Theo dõi",
    advice: "Nguy cơ thấp. Chú ý cập nhật thông tin và chuẩn bị phương án phòng tránh.",
    hex: "#e0b02e",
  },
  2: {
    label: "Cấp 2 · Cảnh giác",
    short: "Cảnh giác",
    advice:
      "Nguy cơ trung bình. Hạn chế đi vào khu vực rủi ro, chuẩn bị đồ dùng thiết yếu và đèn pin.",
    hex: "#e57c2a",
  },
  3: {
    label: "Cấp 3 · Nguy hiểm",
    short: "Nguy hiểm",
    advice:
      "Nguy cơ cao. Tránh xa khu vực nguy hiểm, sẵn sàng sơ tán theo hướng dẫn của chính quyền.",
    hex: "#d2392e",
  },
  4: {
    label: "Cấp 4 · Rất nguy hiểm",
    short: "Rất nguy hiểm",
    advice:
      "Nguy cơ rất cao. Làm theo ngay chỉ dẫn sơ tán của chính quyền địa phương. Gọi 112 khi cần cứu nạn.",
    hex: "#8b2a72",
  },
};

export interface SourceInfo {
  name: string;
  url: string;
  kind: "official" | "model";
}

export interface OfficialRef {
  name: string;
  url: string;
}

export interface RiskItem {
  hazard: HazardId;
  level: Level | null;
  summary: string;
  details: string[];
  metric?: string;
  source: SourceInfo;
  officialRef?: OfficialRef;
  updatedAt: number;
  validUntil: number | null;
}

export interface CurrentWeather {
  time: number;
  temp: number;
  feels: number;
  humidity: number;
  precip: number;
  wind: number;
  gust: number;
  cloud: number;
  code: number;
  label: string;
}

export interface Quake {
  id: string;
  mag: number;
  place: string;
  time: number;
  lat: number;
  lon: number;
  depthKm: number;
  distanceKm: number;
  tsunami: boolean;
  url: string;
}

export interface RiskReport {
  lat: number;
  lon: number;
  elevation: number | null;
  generatedAt: number;
  weather: CurrentWeather | null;
  weatherError: boolean;
  quakeError: boolean;
  items: RiskItem[];
  quakes: Quake[];
  overall: Level | null;
}

export interface GeoResult {
  id: string;
  name: string;
  area: string;
  lat: number;
  lon: number;
}

export function maxLevel(items: RiskItem[]): Level | null {
  let best: Level | null = null;
  for (const it of items) {
    if (it.level === null) continue;
    if (best === null || it.level > best) best = it.level;
  }
  return best;
}

export function sortByLevel(items: RiskItem[]): RiskItem[] {
  return [...items].sort((a, b) => (b.level ?? -1) - (a.level ?? -1));
}
