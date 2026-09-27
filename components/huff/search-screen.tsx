"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, MapPin, Search } from "lucide-react";
import { useHuff } from "@/contexts/huff-context";
import { useGeoSearch } from "@/hooks/use-risk";
import { cleanText } from "@/lib/huff/data";
import { SavePlaceSheet, type SaveDraft } from "./save-place-sheet";
import { Spinner } from "./ui";

const SUGGESTIONS = ["Hà Nội", "Đà Nẵng", "Huế", "Hội An", "Cần Thơ", "Lào Cai", "Quảng Ngãi"];

export function SearchScreen() {
  const { setTarget, setTab, findSavedNear } = useHuff();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<SaveDraft | null>(null);
  const { data, isLoading, error } = useGeoSearch(query);
  const results = data?.results ?? [];

  const run = (q: string) => {
    const clean = cleanText(q, 100);
    if (clean) setQuery(clean);
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <header className="flex flex-col gap-1 pt-2">
        <h1 className="text-2xl font-extrabold">Tìm địa điểm</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Xem cảnh báo cho bất kỳ nơi nào mà không cần chia sẻ vị trí của bạn.
        </p>
      </header>

      <form
        role="search"
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
      >
        <label className="flex flex-1 items-center gap-2 rounded-2xl border-2 bg-card px-3 focus-within:border-primary">
          <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">Tên địa điểm</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault();
            }}
            placeholder="Tỉnh, thành phố, quận, xã…"
            className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
            enterKeyHint="search"
          />
        </label>
        <button
          type="submit"
          className="rounded-2xl bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-60"
          disabled={!input.trim()}
        >
          Tìm
        </button>
      </form>

      {!query && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setInput(s);
                run(s);
              }}
              className="rounded-full border bg-card px-3 py-1.5 text-sm font-medium"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {query && isLoading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Đang tìm “{query}”…
        </p>
      )}
      {query && error && <p className="text-sm text-muted-foreground">Không tìm được lúc này. Vui lòng thử lại.</p>}
      {query && !isLoading && !error && results.length === 0 && (
        <p className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
          Không tìm thấy “{query}”. Thử tên tỉnh hoặc thành phố gần đó, có dấu tiếng Việt.
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {results.map((r) => {
          const saved = !!findSavedNear(r.lat, r.lon);
          return (
            <li key={r.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
              <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-semibold">{r.name}</span>
                {r.area && <span className="truncate text-sm text-muted-foreground">{r.area}</span>}
              </span>
              <button
                type="button"
                aria-label={saved ? "Đã lưu" : `Lưu ${r.name}`}
                disabled={saved}
                onClick={() => setDraft({ name: r.name, area: r.area, lat: r.lat, lon: r.lon })}
                className="flex size-10 items-center justify-center rounded-full border disabled:text-primary"
              >
                {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTarget({ kind: "search", name: r.name, area: r.area, lat: r.lat, lon: r.lon });
                  setTab("home");
                }}
                className="rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Xem
              </button>
            </li>
          );
        })}
      </ul>

      <SavePlaceSheet draft={draft} onClose={() => setDraft(null)} />
    </div>
  );
}
