"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { HadithCard } from "./HadithCard";
import { PrayerTimes } from "./PrayerTimes";
import { UpcomingEvent } from "./UpcomingEvent";
import { useBookmark, useHijriOffset, useT } from "@/lib/settings";
import { useNow } from "@/lib/useNow";
import { toHijri, todayUTC } from "@/lib/hijri";
import { formatDate, formatHijri } from "@/lib/format";
import { getSurah } from "@/data/surahs";

function DateLine() {
  const { lang } = useT();
  const [offset] = useHijriOffset();
  const now = useNow(60_000);
  if (!now) return <div className="h-5" />;
  const today = todayUTC();
  return (
    <p className="text-sm text-muted">
      {formatDate(today, lang, { weekday: "long", day: "numeric", month: "long" })}
      <span className="mx-2 text-gold">·</span>
      {formatHijri(toHijri(today, offset), lang)}
    </p>
  );
}

function ContinueReading() {
  const { t, pick } = useT();
  const [bookmark] = useBookmark();
  if (!bookmark) return null;
  const surah = getSurah(bookmark.surah);
  if (!surah) return null;
  return (
    <Link
      href={`/quran/read?s=${bookmark.surah}&a=${bookmark.ayah}`}
      className="flex items-center gap-4 rounded-3xl border border-line bg-surface p-4 transition-colors hover:bg-surface-2/60"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-soft text-emerald">
        <BookOpen size={20} strokeWidth={1.5} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs uppercase tracking-wider text-muted">{t("continueReading")}</span>
        <span className="block truncate font-medium">
          {surah.latin} · {pick(surah.names)} · {t("ayah")} {bookmark.ayah}
        </span>
      </span>
      <ChevronRight size={18} strokeWidth={1.5} className="text-muted" />
    </Link>
  );
}

export function HomeView() {
  const { t } = useT();
  return (
    <div className="space-y-4">
      <div className="px-1 pb-1 pt-3">
        <h1 className="font-serif text-[1.7rem] font-bold leading-tight">{t("greeting")}</h1>
        <DateLine />
      </div>
      <HadithCard />
      <PrayerTimes />
      <UpcomingEvent />
      <ContinueReading />
    </div>
  );
}
