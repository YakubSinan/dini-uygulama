"use client";

import { Check } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { TRANSLATION_EDITIONS, defaultTranslation } from "@/lib/quran";
import { useArabicSize, useShowTranslit, useT, useTranslations } from "@/lib/settings";
import { ReciterList } from "./AudioPlayer";

export function ReaderSettings({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useT();
  const [size, setSize] = useArabicSize();
  const [translit, setTranslit] = useShowTranslit();
  const [stored, setStored] = useTranslations();
  const selected = stored.length ? stored : [defaultTranslation(lang)];

  const toggleEdition = (id: string) => {
    const next = selected.includes(id) ? selected.filter((e) => e !== id) : [...selected, id];
    // Keep mushaf order of editions stable (TR, DE, EN).
    setStored(TRANSLATION_EDITIONS.map((e) => e.id).filter((e) => next.includes(e)));
  };

  const heading = "mb-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted";

  return (
    <BottomSheet open={open} onClose={onClose} title={t("readerSettings")}>
      <section>
        <div className={heading}>{t("arabicSize")}</div>
        <div className="flex items-center gap-4">
          <span className="arabic text-lg" style={{ lineHeight: 1 }}>
            ا
          </span>
          <input
            type="range"
            min={22}
            max={48}
            step={2}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="flex-1"
            aria-label={t("arabicSize")}
          />
          <span className="arabic text-3xl" style={{ lineHeight: 1 }}>
            ا
          </span>
        </div>
        <p className="arabic mt-3 rounded-2xl bg-surface-2 p-3 text-center" style={{ fontSize: size }} lang="ar">
          ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
        </p>
      </section>

      <section className="mt-6">
        <button
          onClick={() => setTranslit(!translit)}
          className="flex w-full items-center justify-between rounded-2xl border border-line px-4 py-3"
          role="switch"
          aria-checked={translit}
        >
          <span className="font-medium">{t("transliteration")}</span>
          <span className={`relative h-6 w-11 rounded-full transition-colors ${translit ? "bg-emerald" : "bg-line"}`}>
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                translit ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </section>

      <section className="mt-6">
        <div className={heading}>{t("translations")}</div>
        <ul className="space-y-2">
          {TRANSLATION_EDITIONS.map((e) => {
            const on = selected.includes(e.id);
            return (
              <li key={e.id}>
                <button
                  onClick={() => toggleEdition(e.id)}
                  aria-pressed={on}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                    on ? "border-gold bg-gold-soft" : "border-line"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md border ${
                      on ? "border-gold bg-gold text-white dark:text-[#0F171A]" : "border-line"
                    }`}
                  >
                    {on && <Check size={14} strokeWidth={2.5} />}
                  </span>
                  <span className="text-[15px]">{e.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6">
        <div className={heading}>{t("reciter")}</div>
        <ReciterList />
      </section>
    </BottomSheet>
  );
}
