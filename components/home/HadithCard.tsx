"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Quote, RefreshCw, ScrollText } from "lucide-react";
import { HADITHS, hadithOfTheDay } from "@/data/hadiths";
import { useT } from "@/lib/settings";
import { useNow } from "@/lib/useNow";
import { BottomSheet } from "@/components/ui/BottomSheet";

export function HadithCard() {
  const { t, pick } = useT();
  const now = useNow(60_000);
  const [shift, setShift] = useState(0);
  const [open, setOpen] = useState(false);

  // Before mount, show the first hadith so server and client markup agree.
  const hadith = useMemo(() => (now ? hadithOfTheDay(now, shift) : HADITHS[0]), [now, shift]);

  return (
    <>
      <section className="pattern-star relative overflow-hidden rounded-3xl border border-gold/25 bg-surface p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold">
            <ScrollText size={16} strokeWidth={1.75} />
            {t("dailyHadith")}
          </h2>
          <button
            onClick={() => setShift((s) => s + 1)}
            className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label={t("anotherHadith")}
            title={t("anotherHadith")}
          >
            <RefreshCw size={15} strokeWidth={1.75} />
          </button>
        </div>

        <Quote size={22} strokeWidth={1.5} className="mb-2 text-gold/60" />
        <p key={hadith.id} className="animate-fade font-serif text-[1.18rem] leading-relaxed text-fg">
          {pick(hadith.text)}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0 text-xs leading-relaxed text-muted">
            <div>{pick(hadith.narrator)}</div>
            <div className="font-medium text-fg/70">{hadith.source}</div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex shrink-0 items-center gap-1 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95 dark:text-[#0F171A]"
          >
            {t("readMore")}
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </div>
      </section>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={t("dailyHadith")}>
        <blockquote className="rounded-2xl border-l-2 border-gold bg-gold-soft p-4 font-serif text-lg leading-relaxed">
          {pick(hadith.text)}
        </blockquote>
        <p className="mt-2 text-xs text-muted">
          {pick(hadith.narrator)} · {t("source")}: {hadith.source}
        </p>

        <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold">{t("commentary")}</h3>
        <p className="mt-2 leading-relaxed text-fg/90">{pick(hadith.commentary)}</p>

        <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-emerald">{t("takeaway")}</h3>
        <p className="mt-2 rounded-2xl bg-emerald-soft p-4 leading-relaxed text-fg/90">{pick(hadith.takeaway)}</p>
      </BottomSheet>
    </>
  );
}
