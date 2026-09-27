"use client";

import { pi } from "@/lib/pi";

export type SaveStatus = "ok" | "retrying" | "full";

const MIN_PER_KEY = 5200;
const MIN_ACROSS = 2100;

function isStorageFull(err: unknown): boolean {
  const e = err as { status?: number; data?: unknown; message?: string } | null;
  if (!e) return false;
  if (e.status === 429) return false;
  if (e.status === 413 || e.status === 507) return true;
  const text = `${JSON.stringify(e.data ?? "")} ${e.message ?? ""}`;
  return /quota|storage.*(full|limit)|too large|exceed/i.test(text);
}

export class KeyWriter {
  private pending = new Map<string, Record<string, unknown>>();
  private lastByKey = new Map<string, number>();
  private lastAny = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private inFlight = false;
  private backoff = 0;

  constructor(private onStatus: (s: SaveStatus) => void) {}

  queue(key: string, blob: Record<string, unknown>, delay = 800) {
    this.pending.set(key, blob);
    this.schedule(delay);
  }

  flushNow() {
    if (this.pending.size) this.schedule(0);
  }

  private schedule(delay: number) {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.run();
    }, delay);
  }

  private async run() {
    if (this.inFlight || this.pending.size === 0) return;
    const now = Date.now();
    const acrossWait = MIN_ACROSS - (now - this.lastAny);
    let chosen: string | null = null;
    let minWait = Infinity;
    for (const key of this.pending.keys()) {
      const w = MIN_PER_KEY - (now - (this.lastByKey.get(key) ?? 0));
      if (w <= 0) {
        chosen = key;
        break;
      }
      minWait = Math.min(minWait, w);
    }
    if (!chosen || acrossWait > 0) {
      this.schedule(Math.max(chosen ? 0 : minWait, acrossWait, 50));
      return;
    }

    const blob = this.pending.get(chosen)!;
    this.inFlight = true;
    this.lastAny = Date.now();
    this.lastByKey.set(chosen, Date.now());
    try {
      await pi.userState.set(chosen, blob);
      if (this.pending.get(chosen) === blob) this.pending.delete(chosen);
      this.backoff = 0;
      this.onStatus("ok");
    } catch (err) {
      this.backoff = this.backoff ? Math.min(this.backoff * 1.8, 30_000) : 3000;
      this.onStatus(isStorageFull(err) ? "full" : "retrying");
      this.inFlight = false;
      this.schedule(this.backoff);
      return;
    }
    this.inFlight = false;
    if (this.pending.size) this.schedule(200);
  }
}
