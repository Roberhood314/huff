"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { LEVELS, type Level, type Quake } from "@/lib/huff/types";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

function quakeColor(mag: number) {
  if (mag >= 6) return LEVELS[4].hex;
  if (mag >= 5) return LEVELS[3].hex;
  if (mag >= 4) return LEVELS[2].hex;
  return LEVELS[1].hex;
}

export default function RiskMap({
  lat,
  lon,
  level,
  quakes,
  radarUrl,
  isCurrent,
}: {
  lat: number;
  lon: number;
  level: Level | null;
  quakes: Quake[];
  radarUrl: string | null;
  isCurrent: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pinRef = useRef<L.Marker | null>(null);
  const areaRef = useRef<L.Circle | null>(null);
  const quakeLayer = useRef<L.LayerGroup | null>(null);
  const radarLayer = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!el.current) return;
    const map = L.map(el.current, { zoomControl: false, attributionControl: true }).setView([lat, lon], 9);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 18,
    }).addTo(map);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    quakeLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      pinRef.current = null;
      areaRef.current = null;
      radarLayer.current = null;
    };
    // Map is created once; position updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const color = level === null ? "#8a94a6" : LEVELS[level].hex;
    const icon = L.divIcon({
      className: "",
      html: `<span class="huff-pin${isCurrent ? " huff-pin-live" : ""}" style="--pin:${color}"></span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
    if (!pinRef.current) pinRef.current = L.marker([lat, lon], { icon, keyboard: false }).addTo(map);
    else pinRef.current.setLatLng([lat, lon]).setIcon(icon);

    if (!areaRef.current) {
      areaRef.current = L.circle([lat, lon], { radius: 15_000, color, weight: 2, fillColor: color, fillOpacity: 0.14 }).addTo(map);
    } else {
      areaRef.current.setLatLng([lat, lon]).setStyle({ color, fillColor: color });
    }
    map.setView([lat, lon], map.getZoom() < 7 ? 9 : map.getZoom(), { animate: true });
  }, [lat, lon, level, isCurrent]);

  useEffect(() => {
    const layer = quakeLayer.current;
    if (!layer) return;
    layer.clearLayers();
    for (const q of quakes) {
      if (q.mag < 3) continue;
      const color = quakeColor(q.mag);
      L.circleMarker([q.lat, q.lon], {
        radius: Math.max(4, q.mag * 2.2),
        color: "#ffffff",
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.85,
      })
        .bindTooltip(`M${q.mag.toFixed(1)} · ${escapeHtml(q.place)}`, { direction: "top" })
        .addTo(layer);
    }
  }, [quakes]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (radarLayer.current) {
      radarLayer.current.remove();
      radarLayer.current = null;
    }
    if (radarUrl) {
      radarLayer.current = L.tileLayer(radarUrl, {
        opacity: 0.7,
        maxNativeZoom: 7,
        maxZoom: 18,
        attribution: "Radar mưa &copy; RainViewer",
      }).addTo(map);
    }
  }, [radarUrl]);

  return <div ref={el} className="h-full w-full" aria-label="Bản đồ vị trí và rủi ro" role="region" />;
}
