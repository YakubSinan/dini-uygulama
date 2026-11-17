"use client";

import { memo } from "react";
import { Bookmark, BookmarkCheck, Pause, Play } from "lucide-react";
import { toArabicDigits, TRANSLATION_EDITIONS, type Ayah } from "@/lib/quran";
import { useT } from "@/lib/settings";

interface Props {
  ayah: Ayah;
  arabicSize: number;
  showArabic: boolean;
  showTranslit: boolean;
  translations: string[];
  active: boolean;
  playing: boolean;
  bookmarked: boolean;
  onPlay: () => void;
  onBookmark: () => void;
}

/** The transliteration edition marks long vowels and emphatic letters with simple HTML tags. */
function cleanTranslit(s: string) {
  return s.replace(/<[^>]+>/g, "");
}

export const AyahItem = memo(function AyahItem({
  ayah,
  arabicSize,
  showArabic,
  showTranslit,
  translations,
  active,
  playing,
  bookmarked,
  onPlay,
  onBookmark,
}: Props) {
  const { t } = useT();
  const multiple = translations.length > 1;
  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-surface-2 active:scale-95";

  return (
    <article
      id={`ayah-${ayah.number}`}
      data-surah-ayah={`${ayah.surah}:${ayah.numberInSurah}`}
      className={`-mx-4 scroll-mt-32 border-b border-line/70 px-4 py-5 transition-colors ${
        active ? "bg-gold-soft" : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums ${
            active ? "bg-gold text-white dark:text-[#0F171A]" : "bg-surface-2 text-muted"
          }`}
        >
          {ayah.surah}:{ayah.numberInSurah}
        </span>
        <div className="flex items-center gap-0.5 text-muted">
          <button onClick={onPlay} className={`${iconBtn} ${active ? "text-gold" : ""}`} aria-label={playing ? t("pause") : t("play")}>
            {playing ? <Pause size={16} strokeWidth={1.75} /> : <Play size={16} strokeWidth={1.75} />}
          </button>
          <button
            onClick={onBookmark}
            className={`${iconBtn} ${bookmarked ? "text-gold" : ""}`}
            aria-label={t("bookmark")}
            aria-pressed={bookmarked}
          >
            {bookmarked ? <BookmarkCheck size={16} strokeWidth={1.75} /> : <Bookmark size={16} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {showArabic && (
        <p className="arabic text-right text-fg" style={{ fontSize: `${arabicSize}px` }} lang="ar">
          {ayah.arabic}
          <span className="mx-1 inline-block text-gold" style={{ fontSize: "0.95em" }}>
            {toArabicDigits(ayah.numberInSurah)}
          </span>
        </p>
      )}

      {showTranslit && ayah.translit && (
        <p className={`text-[15px] italic leading-relaxed text-fg ${showArabic ? "mt-3" : ""}`}>
          {cleanTranslit(ayah.translit)}
        </p>
      )}

      {translations.map((ed, i) => {
        const text = ayah.translations[ed];
        if (!text) return null;
        const meta = TRANSLATION_EDITIONS.find((e) => e.id === ed);
        return (
          <div key={ed} className={i > 0 || showArabic || (showTranslit && ayah.translit) ? "mt-3" : ""}>
            {multiple && meta && (
              <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                {meta.lang.toUpperCase()}
              </div>
            )}
            <p className="text-[15px] leading-relaxed text-fg/85" lang={meta?.lang}>
              {text}
            </p>
          </div>
        );
      })}
    </article>
  );
});
