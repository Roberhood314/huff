import type { GeoResult } from "@/lib/huff/types";

export const dynamic = "force-dynamic";

const UA = { "User-Agent": "Huff-Disaster-Alerts/1.0", "Accept-Language": "vi" };

const clean = (v: unknown, max = 80) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : "";

async function getJson(url: string, headers?: Record<string, string>) {
  const res = await fetch(url, { cache: "no-store", headers, signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

async function searchOpenMeteo(q: string): Promise<GeoResult[]> {
  const params = new URLSearchParams({ name: q, count: "10", language: "vi", format: "json" });
  const json = await getJson(`https://geocoding-api.open-meteo.com/v1/search?${params}`);
  const results: Record<string, unknown>[] = Array.isArray(json?.results) ? json.results : [];
  return results.map((r) => ({
    id: `om-${r.id}`,
    name: clean(r.name, 60),
    area: [clean(r.admin2), clean(r.admin1), clean(r.country)].filter(Boolean).join(", "),
    lat: Number(r.latitude),
    lon: Number(r.longitude),
  }));
}

async function searchNominatim(q: string): Promise<GeoResult[]> {
  const params = new URLSearchParams({ q, format: "jsonv2", limit: "10", "accept-language": "vi" });
  const json = await getJson(`https://nominatim.openstreetmap.org/search?${params}`, UA);
  const results: Record<string, unknown>[] = Array.isArray(json) ? json : [];
  return results.map((r) => {
    const parts = clean(r.display_name, 200).split(",").map((s) => s.trim());
    return {
      id: `osm-${r.place_id}`,
      name: clean(r.name, 60) || parts[0] || "Không tên",
      area: parts.slice(1, 4).join(", "),
      lat: Number(r.lat),
      lon: Number(r.lon),
    };
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = clean(searchParams.get("q"), 100);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));

  try {
    if (q) {
      let results = await searchOpenMeteo(q).catch(() => [] as GeoResult[]);
      if (results.length === 0) results = await searchNominatim(q).catch(() => []);
      const valid = results.filter((r) => Number.isFinite(r.lat) && Number.isFinite(r.lon) && r.name);
      return Response.json({ results: valid });
    }

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const params = new URLSearchParams({
        lat: lat.toFixed(4),
        lon: lon.toFixed(4),
        format: "jsonv2",
        zoom: "14",
        "accept-language": "vi",
      });
      const json = await getJson(`https://nominatim.openstreetmap.org/reverse?${params}`, UA);
      const a = (json?.address ?? {}) as Record<string, unknown>;
      const name =
        clean(a.suburb) || clean(a.quarter) || clean(a.village) || clean(a.town) || clean(a.city_district) || clean(a.city);
      const area = [clean(a.city) || clean(a.county), clean(a.state) || clean(a.province)]
        .filter((s) => s && s !== name)
        .join(", ");
      return Response.json({ name, area });
    }
  } catch {
    return Response.json({ results: [], name: "", area: "", error: true });
  }

  return Response.json({ error: "Thiếu tham số" }, { status: 400 });
}
