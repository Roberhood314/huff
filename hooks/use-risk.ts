"use client";

import useSWR from "swr";
import type { GeoResult, RiskReport } from "@/lib/huff/types";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed ${res.status}`);
  return res.json() as Promise<T>;
}

export function useRisk(lat?: number, lon?: number) {
  const key =
    lat === undefined || lon === undefined ? null : `/api/risk?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`;
  return useSWR<RiskReport>(key, fetcher, {
    refreshInterval: 10 * 60_000,
    revalidateOnFocus: true,
    dedupingInterval: 60_000,
    keepPreviousData: true,
  });
}

export function useReverseName(lat?: number, lon?: number) {
  const key =
    lat === undefined || lon === undefined ? null : `/api/geocode?lat=${lat.toFixed(3)}&lon=${lon.toFixed(3)}`;
  return useSWR<{ name?: string; area?: string }>(key, fetcher, { revalidateOnFocus: false });
}

export function useGeoSearch(query: string) {
  const key = query ? `/api/geocode?q=${encodeURIComponent(query)}` : null;
  return useSWR<{ results: GeoResult[] }>(key, fetcher, { revalidateOnFocus: false });
}

interface RainViewerJson {
  host?: string;
  radar?: { past?: { time: number; path: string }[] };
}

export function useRadarTiles(enabled: boolean) {
  const { data } = useSWR<RainViewerJson>(
    enabled ? "https://api.rainviewer.com/public/weather-maps.json" : null,
    fetcher,
    { refreshInterval: 10 * 60_000, revalidateOnFocus: false },
  );
  const frame = data?.radar?.past?.at(-1);
  if (!data?.host || !data.host.startsWith("https://") || !frame || typeof frame.path !== "string") return null;
  return { url: `${data.host}${frame.path}/256/{z}/{x}/{y}/2/1_1.png`, time: frame.time * 1000 };
}
