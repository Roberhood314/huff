import { buildReport } from "@/lib/huff/risk";

export const dynamic = "force-dynamic";

const DAY = 86_400_000;

async function getJson(url: string) {
  const res = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(9000) });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return Response.json({ error: "Tọa độ không hợp lệ" }, { status: 400 });
  }

  const weatherParams = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,cloud_cover",
    hourly: "precipitation,precipitation_probability,weather_code,cape",
    past_days: "2",
    forecast_days: "2",
    timeformat: "unixtime",
    timezone: "GMT",
    wind_speed_unit: "kmh",
  });

  const quakeParams = new URLSearchParams({
    format: "geojson",
    latitude: lat.toFixed(3),
    longitude: lon.toFixed(3),
    maxradiuskm: "3000",
    starttime: new Date(Date.now() - 7 * DAY).toISOString(),
    minmagnitude: "2.5",
    orderby: "time",
    limit: "300",
  });

  const [weather, quakes] = await Promise.allSettled([
    getJson(`https://api.open-meteo.com/v1/forecast?${weatherParams}`),
    getJson(`https://earthquake.usgs.gov/fdsnws/event/1/query?${quakeParams}`),
  ]);

  const report = buildReport(
    lat,
    lon,
    weather.status === "fulfilled" ? weather.value : null,
    quakes.status === "fulfilled" ? quakes.value : null,
    Date.now(),
  );

  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
