"use client";

import { useState } from "react";
import { ChevronDown, LoaderCircle, Mic, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { RECITERS, getReciter } from "@/data/reciters";
import { getSurah } from "@/data/surahs";
import type { Ayah } from "@/lib/quran";
import { useReciter, useT } from "@/lib/settings";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { useAyahAudio } from "./useAyahAudio";

interface Props {
  audio: ReturnType<typeof useAyahAudio>;
  ayahs: Ayah[];
  label: string;
}

export function AudioPlayer({ audio, ayahs, label }: Props) {
  const { t } = useT();
  const [reciterId] = useReciter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const reciter = getReciter(reciterId);
  const current = audio.index !== null ? ayahs[audio.index] : null;
  const progress = audio.index !== null ? ((audio.index + 1) / ayahs.length) * 100 : 0;

  return (
    <>
      <div
        className="fixed inset-x-0 z-30 px-3"
        style={{ bottom: "calc(4rem + env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-xl backdrop-blur-xl">
          <div className="h-0.5 bg-line">
            <div className="h-full bg-gold transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => setPickerOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 text-left hover:bg-surface-2/60"
              aria-label={t("reciter")}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-soft text-emerald">
                <Volume2 size={17} strokeWidth={1.5} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 truncate text-sm font-medium">
                  {reciter.name}
                  <ChevronDown size={14} strokeWidth={1.75} className="shrink-0 text-muted" />
                </span>
                <span className="block truncate text-xs text-muted">
                  {audio.error
                    ? t("audioError")
                    : current
                      ? `${getSurah(current.surah)?.latin} · ${t("ayah")} ${current.numberInSurah}`
                      : label}
                </span>
              </span>
            </button>
            <button
              onClick={audio.prev}
              disabled={audio.index === null || audio.index === 0}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-fg disabled:opacity-30"
              aria-label={t("previous")}
            >
              <SkipBack size={18} strokeWidth={1.75} />
            </button>
            <button
              onClick={audio.toggle}
              className="grid h-11 w-11 place-items-center rounded-full bg-gold text-white shadow-sm transition-transform active:scale-95 dark:text-[#0F171A]"
              aria-label={audio.playing ? t("pause") : t("play")}
            >
              {audio.loading && audio.playing === false && audio.index !== null && !audio.error ? (
                <LoaderCircle size={20} strokeWidth={2} className="animate-spin" />
              ) : audio.playing ? (
                <Pause size={20} strokeWidth={2} />
              ) : (
                <Play size={20} strokeWidth={2} className="translate-x-px" />
              )}
            </button>
            <button
              onClick={audio.next}
              disabled={audio.index === null || audio.index >= ayahs.length - 1}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-fg disabled:opacity-30"
              aria-label={t("next")}
            >
              <SkipForward size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
      <ReciterPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </>
  );
}

export function ReciterList({ onPicked }: { onPicked?: () => void }) {
  const [reciterId, setReciterId] = useReciter();
  return (
    <ul className="space-y-2">
      {RECITERS.map((r) => {
        const selected = r.id === reciterId;
        return (
          <li key={r.id}>
            <button
              onClick={() => {
                setReciterId(r.id);
                onPicked?.();
              }}
              aria-pressed={selected}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                selected ? "border-gold bg-gold-soft" : "border-line hover:bg-surface-2/60"
              }`}
            >
              <Mic size={18} strokeWidth={1.5} className={selected ? "text-gold" : "text-muted"} />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{r.name}</span>
                <span className="block text-xs text-muted">Masjid al-Haram, Makkah</span>
              </span>
              <span className="arabic shrink-0 text-lg text-fg/80" style={{ lineHeight: 1.4 }}>
                {r.arabic}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ReciterPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  return (
    <BottomSheet open={open} onClose={onClose} title={t("reciter")}>
      <ReciterList onPicked={onClose} />
    </BottomSheet>
  );
}
