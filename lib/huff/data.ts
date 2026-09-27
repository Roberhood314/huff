export type PlaceLabel = "home" | "hometown" | "work" | "family" | "other";

export const PLACE_LABELS: { id: PlaceLabel; name: string }[] = [
  { id: "home", name: "Nhà" },
  { id: "hometown", name: "Quê" },
  { id: "work", name: "Nơi làm việc" },
  { id: "family", name: "Người thân" },
  { id: "other", name: "Khác" },
];

export const PLACE_LABEL_NAME: Record<PlaceLabel, string> = {
  home: "Nhà",
  hometown: "Quê",
  work: "Nơi làm việc",
  family: "Người thân",
  other: "Khác",
};

export interface Place {
  id: string;
  name: string;
  label: PlaceLabel;
  lat: number;
  lon: number;
  area: string;
  createdAt: number;
}

export interface Prefs {
  useLocation: boolean;
}

export const PLACES_KEY = "huff.places";
export const PREFS_KEY = "huff.prefs";
export const APP_KEYS = [PLACES_KEY, PREFS_KEY];
export const MAX_PLACES = 12;

export function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function cleanText(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max) : "";
}

function blobOf(rec: unknown): Record<string, unknown> | null {
  if (!rec || typeof rec !== "object") return null;
  const r = rec as Record<string, unknown>;
  const b = r.blob;
  if (b && typeof b === "object" && !Array.isArray(b)) return b as Record<string, unknown>;
  return null;
}

const isLabel = (v: unknown): v is PlaceLabel =>
  typeof v === "string" && PLACE_LABELS.some((l) => l.id === v);

export function sanitizePlaces(rec: unknown): Place[] {
  const blob = blobOf(rec);
  const items = blob && Array.isArray(blob.items) ? blob.items : [];
  const out: Place[] = [];
  const seen = new Set<string>();
  for (const raw of items) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    const id = cleanText(r.id, 40);
    const lat = Number(r.lat);
    const lon = Number(r.lon);
    if (!id || seen.has(id) || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    seen.add(id);
    out.push({
      id,
      name: cleanText(r.name, 60) || "Địa điểm",
      label: isLabel(r.label) ? r.label : "other",
      lat,
      lon,
      area: cleanText(r.area, 100),
      createdAt: Number.isFinite(Number(r.createdAt)) ? Number(r.createdAt) : 0,
    });
    if (out.length >= MAX_PLACES) break;
  }
  return out;
}

export function placesToBlob(list: Place[]): Record<string, unknown> {
  return {
    v: 1,
    items: list.map((p) => ({
      id: p.id,
      name: p.name,
      label: p.label,
      lat: p.lat,
      lon: p.lon,
      area: p.area,
      createdAt: p.createdAt,
    })),
  };
}

export function sanitizePrefs(rec: unknown): Prefs {
  const blob = blobOf(rec);
  return { useLocation: blob?.useLocation === true };
}
