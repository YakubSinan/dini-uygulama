"use client";

import { useEffect, useRef } from "react";
import { Bookmark, BookmarkCheck, Pause, Play, X } from "lucide-react";
import { getSurah } from "@/data/surahs";
import { toArabicDigits, type Ayah } from "@/lib/quran";
import { useT, type Bookmark as BookmarkData } from "@/lib/settings";
import { SurahHeader } from "./SurahHeader";

interface Props {
  ayahs: Ayah[];
  arabicSize: number;
  /** Show a surah header when a new surah starts inside the list (page mode). */
  inlineHeaders: boolean;
  activeIndex: number | null;
  playing: boolean;
  selected: number | null;
  onSelect: (i: number | null) => void;
  bookmark: BookmarkData | null;
  onPlay: (i: number) => void;
  onBookmark: (a: Ayah) => void;
}

/** Splits the ayah list into runs that belong to the same surah, keeping global indices. */
function groupBySurah(ayahs: Ayah[]) {
  const groups: { surah: number; items: { ayah: Ayah; index: number }[] }[] = [];
  ayahs.forEach((ayah, index) => {
    const last = groups[groups.length - 1];
    if (last && last.surah === ayah.surah) last.items.push({ ayah, index });
    else groups.push({ surah: ayah.surah, items: [{ ayah, index }] });
  });
  return groups;
}

/**
 * Arabic-only reading view laid out like a printed mushaf page: one continuous, justified
 * block of text per surah with inline ayah markers instead of separate cards per ayah.
 * Tapping an ayah selects it and shows a small action bar (play / bookmark).
 */
export function MushafView({
  ayahs,
  arabicSize,
  inlineHeaders,
  activeIndex,
  playing,
  selected,
  onSelect,
  bookmark,
  onPlay,
  onBookmark,
}: Props) {
  const { t } = useT();
  const barRef = useRef<HTMLDivElement>(null);
  const groups = groupBySurah(ayahs);
  const sel = selected !== null ? ayahs[selected] : null;

  // Tapping outside the text or the action bar clears the selection.
  useEffect(() => {
    if (selected === null) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (barRef.current?.contains(target) || target.closest("[data-mushaf-ayah]")) return;
      onSelect(null);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [selected, onSelect]);

  const selBookmarked = !!sel && bookmark?.surah === sel.surah && bookmark?.ayah === sel.numberInSurah;
  const selPlaying = selected !== null && activeIndex === selected && playing;

  return (
    <>
      {groups.map((group, gi) => {
        const surah = getSurah(group.surah);
        const startsSurah = group.items[0].ayah.numberInSurah === 1;
        return (
          <section key={`${group.surah}-${gi}`}>
            {inlineHeaders && startsSurah && surah && <SurahHeader surah={surah} compact />}
            <div className="mushaf-page my-4 rounded-3xl border border-gold/25 bg-surface px-4 py-5 sm:px-6">
              <p className="arabic mushaf-text text-fg" style={{ fontSize: `${arabicSize}px` }} lang="ar">
                {group.items.map(({ ayah, index }) => {
                  const active = activeIndex === index;
                  const isSel = selected === index;
                  return (
                    <span
                      key={ayah.number}
                      id={`ayah-${ayah.number}`}
                      data-surah-ayah={`${ayah.surah}:${ayah.numberInSurah}`}
                      data-mushaf-ayah=""
                      role="button"
                      tabIndex={0}
                      aria-label={`${t("ayah")} ${ayah.surah}:${ayah.numberInSurah}`}
                      onClick={() => onSelect(isSel ? null : index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelect(isSel ? null : index);
                        }
                      }}
                      className={`mushaf-ayah scroll-mt-40 cursor-pointer rounded-lg outline-none transition-colors ${
                        active ? "bg-gold-soft" : isSel ? "bg-surface-2" : "hover:bg-surface-2/60"
                      }`}
                    >
                      {ayah.arabic}
                      {" "}
                      <span className="mushaf-marker text-gold">{toArabicDigits(ayah.numberInSurah)}</span>{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          </section>
        );
      })}

      {sel && (
        <div
          ref={barRef}
          className="animate-fade fixed inset-x-0 z-30 flex justify-center px-3"
          style={{ bottom: "calc(4rem + env(safe-area-inset-bottom) + 84px)" }}
        >
          <div className="flex items-center gap-1 rounded-full border border-line bg-surface/95 py-1 pl-4 pr-1 shadow-xl backdrop-blur-xl">
            <span className="mr-2 text-sm font-semibold tabular-nums">
              {getSurah(sel.surah)?.latin} {sel.surah}:{sel.numberInSurah}
            </span>
            <button
              onClick={() => onPlay(selected!)}
              className="grid h-9 w-9 place-items-center rounded-full text-gold hover:bg-surface-2"
              aria-label={selPlaying ? t("pause") : t("play")}
            >
              {selPlaying ? <Pause size={17} strokeWidth={1.75} /> : <Play size={17} strokeWidth={1.75} />}
            </button>
            <button
              onClick={() => onBookmark(sel)}
              className={`grid h-9 w-9 place-items-center rounded-full hover:bg-surface-2 ${
                selBookmarked ? "text-gold" : "text-muted"
              }`}
              aria-label={t("bookmark")}
              aria-pressed={selBookmarked}
            >
              {selBookmarked ? <BookmarkCheck size={17} strokeWidth={1.75} /> : <Bookmark size={17} strokeWidth={1.75} />}
            </button>
            <button
              onClick={() => onSelect(null)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2"
              aria-label={t("close")}
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
