"use client";

import type { Surah } from "@/data/surahs";
import { useT } from "@/lib/settings";

const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

export function SurahHeader({ surah, compact = false }: { surah: Surah; compact?: boolean }) {
  const { t, pick } = useT();
  const showBasmala = surah.number !== 1 && surah.number !== 9;

  return (
    <header className={`text-center ${compact ? "mt-6 pb-2" : "mt-5 pb-3"}`}>
      <div className="pattern-star relative overflow-hidden rounded-3xl border border-gold/30 bg-surface px-5 py-5">
        <div className="arabic text-3xl text-fg" style={{ lineHeight: 1.6 }} lang="ar">
          سورة {surah.arabic}
        </div>
        <div className="mt-1 font-semibold">
          {surah.latin} <span className="font-normal text-muted">· {pick(surah.names)}</span>
        </div>
        {!compact && (
          <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted">
            {surah.ayahs} {t("ayahs")} · {surah.revelation === "meccan" ? t("meccan") : t("medinan")} · {t("page")}{" "}
            {surah.page}
          </div>
        )}
      </div>
      {showBasmala && (
        <p className="arabic mt-5 text-center text-[1.75rem] text-fg/90" style={{ direction: "rtl" }} lang="ar">
          {BASMALA}
        </p>
      )}
    </header>
  );
}
