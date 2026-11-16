"use client";

import { useMemo, useState } from "react";
import { BookOpen, Check, Search } from "lucide-react";
import { Card, CardTitle, SegmentedControl } from "@/components/ui/Card";
import { SURAHS, TOTAL_AYAHS, searchSurahs } from "@/data/surahs";
import { useStored } from "@/lib/storage";
import { useT } from "@/lib/settings";
import { LOCALE } from "@/lib/i18n";
import { formatPercent } from "@/lib/format";

type Filter = "all" | "short" | "memorized";
const SHORT_FROM = 93; // Ad-Duha to An-Nas

export function MemorizationList() {
  const { t, pick, lang } = useT();
  const [memorized, setMemorized] = useStored<number[]>("memorized", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const set = useMemo(() => new Set(memorized), [memorized]);
  const nf = new Intl.NumberFormat(LOCALE[lang]);

  const ayahCount = SURAHS.reduce((sum, s) => (set.has(s.number) ? sum + s.ayahs : sum), 0);
  const pct = Math.round((set.size / SURAHS.length) * 100);
  const ayahPct = (ayahCount / TOTAL_AYAHS) * 100;

  const list = useMemo(() => {
    let base = query ? searchSurahs(query) : SURAHS;
    if (filter === "short") base = base.filter((s) => s.number >= SHORT_FROM);
    if (filter === "memorized") base = base.filter((s) => set.has(s.number));
    return base;
  }, [query, filter, set]);

  const toggle = (n: number) =>
    setMemorized((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n].sort((a, b) => a - b)));

  // Ring geometry
  const R = 34;
  const C = 2 * Math.PI * R;

  return (
    <Card>
      <CardTitle icon={BookOpen}>{t("memorizeTitle")}</CardTitle>

      <div className="flex items-center gap-5 rounded-2xl bg-surface-2 p-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke="var(--gold)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C - (C * pct) / 100}
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-lg font-semibold tabular-nums">{formatPercent(pct, lang)}</span>
        </div>
        <div className="min-w-0 text-sm">
          <div>
            <span className="text-2xl font-semibold tabular-nums">{set.size}</span>
            <span className="text-muted"> / 114 {t("surahsMemorized")}</span>
          </div>
          <div className="mt-1 text-muted">
            <span className="font-semibold tabular-nums text-fg">{nf.format(ayahCount)}</span> / {nf.format(TOTAL_AYAHS)}{" "}
            {t("ayahsMemorized")} ({formatPercent(ayahPct, lang, 1)})
          </div>
        </div>
      </div>

      <SegmentedControl<Filter>
        className="mt-4"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: t("all") },
          { value: "short", label: t("shortSurahs") },
          { value: "memorized", label: t("memorized") },
        ]}
      />

      <div className="relative mt-3">
        <Search size={16} strokeWidth={1.75} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("filterSurahs")}
          className="w-full rounded-xl border border-line bg-bg py-2.5 pl-10 pr-3 text-[15px] outline-none focus:border-gold"
        />
      </div>

      <ul className="mt-3 max-h-[60vh] overflow-y-auto rounded-2xl border border-line">
        {list.length === 0 && <li className="py-8 text-center text-sm text-muted">{t("noResults")}</li>}
        {list.map((s, i) => {
          const on = set.has(s.number);
          return (
            <li key={s.number} className={i > 0 ? "border-t border-line" : ""}>
              <button
                onClick={() => toggle(s.number)}
                role="checkbox"
                aria-checked={on}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2/60"
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-colors ${
                    on ? "border-emerald bg-emerald text-white dark:text-[#0F171A]" : "border-line"
                  }`}
                >
                  {on && <Check size={15} strokeWidth={2.5} />}
                </span>
                <span className="w-7 shrink-0 text-xs tabular-nums text-muted">{s.number}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[15px] ${on ? "font-medium" : ""}`}>{s.latin}</span>
                  <span className="block truncate text-xs text-muted">
                    {pick(s.names)} · {s.ayahs} {t("ayahs")}
                  </span>
                </span>
                <span className="arabic shrink-0 text-lg text-fg/80" style={{ lineHeight: 1.4 }}>
                  {s.arabic}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
