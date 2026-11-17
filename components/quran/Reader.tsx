"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BookmarkCheck, ChevronLeft, ChevronRight, LoaderCircle, SlidersHorizontal, WifiOff } from "lucide-react";
import { getSurah, TOTAL_PAGES } from "@/data/surahs";
import { loadAyahs, defaultTranslation, type Ayah, type QuranTarget } from "@/lib/quran";
import {
  useArabicSize,
  useBookmark,
  useReciter,
  useT,
  useTranslations,
  useViewLayers,
} from "@/lib/settings";
import { AyahItem } from "./AyahItem";
import { AudioPlayer } from "./AudioPlayer";
import { ReaderSettings } from "./ReaderSettings";
import { SurahHeader } from "./SurahHeader";
import { useAyahAudio } from "./useAyahAudio";
import { ViewFilter } from "./ViewFilter";
import { MushafView } from "./MushafView";

function parseTarget(params: URLSearchParams): QuranTarget {
  const p = Number(params.get("p"));
  if (Number.isInteger(p) && p >= 1 && p <= TOTAL_PAGES) return { kind: "page", page: p };
  const s = Number(params.get("s"));
  return { kind: "surah", surah: Number.isInteger(s) && s >= 1 && s <= 114 ? s : 1 };
}

export function Reader() {
  const params = useSearchParams();
  const { t, pick, lang } = useT();
  const target = useMemo(() => parseTarget(params), [params]);
  const scrollToAyah = Number(params.get("a")) || 0;
  const targetKey = target.kind === "surah" ? `s${target.surah}` : `p${target.page}`;

  const { layers } = useViewLayers();
  const showTranslit = layers.translit;
  // Arabic only: lay the text out as a continuous mushaf page instead of one card per ayah.
  const mushaf = layers.arabic && !layers.translit && !layers.translation;
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => setSelected(null), [targetKey, mushaf]);
  const [storedTranslations] = useTranslations();
  const [arabicSize] = useArabicSize();
  const [reciter] = useReciter();
  const [bookmark, setBookmark] = useBookmark();

  const translations = useMemo(
    () => (storedTranslations.length ? storedTranslations : [defaultTranslation(lang)]),
    [storedTranslations, lang],
  );
  // Only fetch what is shown; hidden layers cost no network.
  const visibleTranslations = useMemo(
    () => (layers.translation ? translations : []),
    [layers.translation, translations],
  );
  const optionsKey = `${showTranslit}|${visibleTranslations.join(",")}`;

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [fromCache, setFromCache] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const loadedKey = useRef("");

  const load = useCallback(async () => {
    const [translitFlag, eds] = optionsKey.split("|");
    const contentChanged = loadedKey.current !== targetKey;
    if (contentChanged) setState("loading");
    try {
      const res = await loadAyahs(target, {
        translit: translitFlag === "true",
        translations: eds ? eds.split(",") : [],
      });
      setAyahs(res.ayahs);
      setFromCache(res.fromCache);
      setState("ok");
      loadedKey.current = targetKey;
    } catch {
      setState("error");
    }
    // target is derived from targetKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey, optionsKey]);

  useEffect(() => {
    load();
  }, [load]);

  // Scroll to top on navigation, or to the requested ayah once loaded.
  useEffect(() => {
    if (state !== "ok") return;
    if (scrollToAyah) {
      const el = document.querySelector(`[data-surah-ayah="${target.kind === "surah" ? target.surah : ""}:${scrollToAyah}"]`);
      el?.scrollIntoView({ block: "center" });
    } else {
      window.scrollTo({ top: 0 });
    }
    // Only when the content target changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state === "ok" ? targetKey : "", scrollToAyah]);

  const audio = useAyahAudio(ayahs, reciter);

  // Auto-scroll to the ayah being recited.
  useEffect(() => {
    if (audio.index === null) return;
    const ayah = ayahs[audio.index];
    if (!ayah) return;
    document.getElementById(`ayah-${ayah.number}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [audio.index, ayahs]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const saveBookmark = useCallback(
    (a: Ayah) => {
      setBookmark({ surah: a.surah, ayah: a.numberInSurah, page: a.page, savedAt: Date.now() });
      setToast(t("bookmarkSaved"));
    },
    [setBookmark, t],
  );

  const surah = target.kind === "surah" ? getSurah(target.surah) : undefined;
  const title =
    target.kind === "surah" && surah ? surah.latin : `${t("page")} ${target.kind === "page" ? target.page : ""}`;
  const subtitle =
    target.kind === "surah" && surah
      ? pick(surah.names)
      : ayahs[0]
        ? `${t("juz")} ${ayahs[0].juz} · ${getSurah(ayahs[0].surah)?.latin ?? ""}`
        : "";

  const prevHref =
    target.kind === "surah"
      ? target.surah > 1 && `/quran/read?s=${target.surah - 1}`
      : target.page > 1 && `/quran/read?p=${target.page - 1}`;
  const nextHref =
    target.kind === "surah"
      ? target.surah < 114 && `/quran/read?s=${target.surah + 1}`
      : target.page < TOTAL_PAGES && `/quran/read?p=${target.page + 1}`;

  const navBtn =
    "grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg";

  return (
    <div className="-mx-4 pb-24">
      {/* Reader toolbar */}
      <div
        className="sticky z-20 flex items-center gap-1 border-b border-line/60 bg-bg/90 px-2 py-2 backdrop-blur-xl"
        style={{ top: "calc(3.5rem + env(safe-area-inset-top))" }}
      >
        <Link href="/quran" className={navBtn} aria-label={t("back")}>
          <ChevronLeft size={20} strokeWidth={1.75} />
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <div className="truncate text-[15px] font-semibold">{title}</div>
          <div className="truncate text-xs text-muted">{subtitle}</div>
        </div>
        {/* Mushaf order runs right-to-left: "previous" sits on the right. */}
        {nextHref ? (
          <Link href={nextHref} className={navBtn} aria-label={t("next")}>
            <ChevronLeft size={18} strokeWidth={1.75} />
          </Link>
        ) : (
          <span className="h-9 w-9" />
        )}
        {prevHref ? (
          <Link href={prevHref} className={navBtn} aria-label={t("previous")}>
            <ChevronRight size={18} strokeWidth={1.75} />
          </Link>
        ) : (
          <span className="h-9 w-9" />
        )}
        <ViewFilter className={navBtn} />
        <button onClick={() => setSettingsOpen(true)} className={navBtn} aria-label={t("readerSettings")}>
          <SlidersHorizontal size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="px-4">
        {state === "loading" && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted">
            <LoaderCircle size={18} strokeWidth={1.75} className="animate-spin" /> {t("loading")}
          </div>
        )}
        {state === "error" && (
          <div className="py-24 text-center text-sm text-muted">
            <p>{t("loadError")}</p>
            <button onClick={load} className="mt-3 rounded-full border border-line px-4 py-1.5 text-fg">
              {t("retry")}
            </button>
          </div>
        )}
        {state === "ok" && (
          <>
            {fromCache && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
                <WifiOff size={13} strokeWidth={1.75} /> {t("offline")}
              </p>
            )}
            {target.kind === "surah" && surah && <SurahHeader surah={surah} />}
            {mushaf ? (
              <MushafView
                ayahs={ayahs}
                arabicSize={arabicSize}
                inlineHeaders={target.kind === "page"}
                activeIndex={audio.index}
                playing={audio.playing}
                selected={selected}
                onSelect={setSelected}
                bookmark={bookmark}
                onPlay={(i) => (audio.index === i ? audio.toggle() : audio.playAt(i))}
                onBookmark={saveBookmark}
              />
            ) : (
              <div>
                {ayahs.map((a, i) => (
                  <div key={a.number}>
                    {target.kind === "page" && a.numberInSurah === 1 && getSurah(a.surah) && (
                      <SurahHeader surah={getSurah(a.surah)!} compact />
                    )}
                    <AyahItem
                      ayah={a}
                      arabicSize={arabicSize}
                      showArabic={layers.arabic}
                      showTranslit={showTranslit}
                      translations={visibleTranslations}
                      active={audio.index === i}
                      playing={audio.index === i && audio.playing}
                      bookmarked={bookmark?.surah === a.surah && bookmark?.ayah === a.numberInSurah}
                      onPlay={() => (audio.index === i ? audio.toggle() : audio.playAt(i))}
                      onBookmark={() => saveBookmark(a)}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between gap-3 py-8">
              {prevHref ? (
                <Link href={prevHref} className="flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm">
                  <ChevronLeft size={16} strokeWidth={1.75} /> {t("previous")}
                </Link>
              ) : (
                <span />
              )}
              {nextHref && (
                <Link href={nextHref} className="flex items-center gap-1 rounded-full border border-line px-4 py-2 text-sm">
                  {t("next")} <ChevronRight size={16} strokeWidth={1.75} />
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      {state === "ok" && ayahs.length > 0 && (
        <AudioPlayer
          audio={audio}
          ayahs={ayahs}
          label={target.kind === "surah" ? t("playSurah") : t("playPage")}
        />
      )}

      {toast && (
        <div className="animate-fade pointer-events-none fixed inset-x-0 top-28 z-50 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm text-bg shadow-lg">
            <BookmarkCheck size={16} strokeWidth={1.75} /> {toast}
          </div>
        </div>
      )}

      <ReaderSettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
