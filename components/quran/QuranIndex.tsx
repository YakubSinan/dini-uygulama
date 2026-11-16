"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Bookmark, ChevronRight, FileText, Search, X } from "lucide-react";
import { JUZ_STARTS, SURAHS, TOTAL_PAGES, getSurah, normalizeSearch, searchSurahs } from "@/data/surahs";
import { useBookmark, useT } from "@/lib/settings";
import { SegmentedControl } from "@/components/ui/Card";

type Tab = "surah" | "juz" | "page";

export function QuranIndex() {
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("surah");
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-4 pt-3">
      <h1 className="px-1 font-serif text-[1.7rem] font-bold">{t("quranTitle")}</h1>
      <LastReadBanner />

      <div className="relative">
        <Search size={18} strokeWidth={1.75} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value) setTab("surah");
          }}
          placeholder={t("searchSurah")}
          inputMode="search"
          className="w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-10 text-[15px] outline-none transition-colors focus:border-gold"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-fg"
            aria-label={t("close")}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        )}
      </div>

      {!query && (
        <SegmentedControl<Tab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "surah", label: t("surahs") },
            { value: "juz", label: t("juz") },
            { value: "page", label: t("page") },
          ]}
        />
      )}

      {tab === "surah" && <SurahList query={query} />}
      {tab === "juz" && !query && <JuzGrid />}
      {tab === "page" && !query && <PageJump />}
    </div>
  );
}

function LastReadBanner() {
  const { t, pick } = useT();
  const [bookmark] = useBookmark();
  const surah = bookmark ? getSurah(bookmark.surah) : undefined;
  const href = bookmark ? `/quran/read?s=${bookmark.surah}&a=${bookmark.ayah}` : "/quran/read?s=1";

  return (
    <Link
      href={href}
      className="pattern-star relative flex items-center gap-4 overflow-hidden rounded-3xl bg-[#13302a] p-5 text-[#f4efe3] shadow-sm transition-transform active:scale-[0.99] dark:bg-[#17332c]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#e2c060]">
        <Bookmark size={22} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#e2c060]">{t("lastRead")}</span>
        {surah && bookmark ? (
          <>
            <span className="mt-0.5 block truncate text-lg font-semibold">
              {surah.latin} <span className="font-normal text-white/70">· {pick(surah.names)}</span>
            </span>
            <span className="block text-sm text-white/70">
              {t("ayah")} {bookmark.ayah} · {t("page")} {bookmark.page}
            </span>
          </>
        ) : (
          <span className="mt-0.5 block text-sm text-white/80">{t("noBookmark")}</span>
        )}
      </span>
      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e2c060] px-3.5 py-1.5 text-sm font-semibold text-[#13302a]">
        {bookmark ? t("resume") : t("startReading")}
      </span>
    </Link>
  );
}

function SurahList({ query }: { query: string }) {
  const { t, pick } = useT();
  const results = useMemo(() => searchSurahs(query), [query]);
  const q = normalizeSearch(query);
  const pageNumber = /^\d+$/.test(q) ? Number(q) : NaN;
  const showPageJump = pageNumber >= 1 && pageNumber <= TOTAL_PAGES;

  return (
    <div className="space-y-2">
      {showPageJump && (
        <Link
          href={`/quran/read?p=${pageNumber}`}
          className="flex items-center gap-3 rounded-2xl border border-dashed border-gold/50 bg-gold-soft px-4 py-3 text-sm"
        >
          <FileText size={18} strokeWidth={1.5} className="text-gold" />
          <span className="flex-1">
            {t("goToPage")} <strong>{pageNumber}</strong>
          </span>
          <ChevronRight size={16} strokeWidth={1.5} className="text-muted" />
        </Link>
      )}
      {results.length === 0 && !showPageJump && <p className="py-10 text-center text-sm text-muted">{t("noResults")}</p>}
      <ul className="overflow-hidden rounded-3xl border border-line bg-surface">
        {results.map((s, i) => (
          <li key={s.number} className={i > 0 ? "border-t border-line" : ""}>
            <Link
              href={`/quran/read?s=${s.number}`}
              className="flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-2/60"
            >
              <SurahNumber n={s.number} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.latin}</span>
                <span className="block truncate text-xs text-muted">
                  {pick(s.names)} · {s.ayahs} {t("ayahs")} · {s.revelation === "meccan" ? t("meccan") : t("medinan")}
                </span>
              </span>
              <span className="arabic shrink-0 text-xl text-fg/90" style={{ lineHeight: 1.4 }}>
                {s.arabic}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SurahNumber({ n, active = false }: { n: number; active?: boolean }) {
  return (
    <span className="relative grid h-10 w-10 shrink-0 place-items-center">
      <svg viewBox="0 0 40 40" className={`absolute inset-0 ${active ? "text-gold" : "text-gold/50"}`} fill="none">
        <rect x="9" y="9" width="22" height="22" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="22" height="22" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 20 20)" />
      </svg>
      <span className="relative text-xs font-semibold tabular-nums">{n}</span>
    </span>
  );
}

function JuzGrid() {
  const { t } = useT();
  return (
    <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {JUZ_STARTS.map((j) => {
        const surah = SURAHS[j.surah - 1];
        return (
          <li key={j.juz}>
            <Link
              href={`/quran/read?p=${j.page}`}
              className="flex flex-col rounded-2xl border border-line bg-surface p-3 transition-colors hover:border-gold/50"
            >
              <span className="text-xs text-muted">{t("juz")}</span>
              <span className="text-2xl font-semibold tabular-nums">{j.juz}</span>
              <span className="mt-1 truncate text-[11px] text-muted">
                {surah.latin} {j.ayah}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function PageJump() {
  const { t } = useT();
  const router = useRouter();
  const [page, setPage] = useState("");
  const n = Number(page);
  const valid = Number.isInteger(n) && n >= 1 && n <= TOTAL_PAGES;

  return (
    <div className="rounded-3xl border border-line bg-surface p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) router.push(`/quran/read?p=${n}`);
        }}
        className="flex gap-2"
      >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={TOTAL_PAGES}
          value={page}
          onChange={(e) => setPage(e.target.value)}
          placeholder={t("pageNumber")}
          className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-3 text-[15px] outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={!valid}
          className="rounded-xl bg-gold px-5 font-semibold text-white disabled:opacity-40 dark:text-[#0F171A]"
        >
          {t("goToPage")}
        </button>
      </form>
      <div className="mt-4 grid grid-cols-6 gap-2">
        {[1, 50, 100, 200, 300, 400, 500, 582, 590, 596, 600, 604].map((p) => (
          <Link
            key={p}
            href={`/quran/read?p=${p}`}
            className="rounded-xl border border-line py-2 text-center text-sm tabular-nums text-muted hover:border-gold/50 hover:text-fg"
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}
