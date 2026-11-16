"use client";

import { BookOpen, Hand, History, Moon, Sparkles, type LucideIcon } from "lucide-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { IslamicEvent } from "@/data/islamicEvents";
import { daysBetween, toHijri, todayUTC } from "@/lib/hijri";
import { daysLeftLabel, formatDate, formatHijri } from "@/lib/format";
import { useHijriOffset, useT } from "@/lib/settings";

export interface SheetEntry {
  event: IslamicEvent;
  date: Date;
  dayIndex?: number;
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold">
        <Icon size={15} strokeWidth={1.75} />
        {title}
      </h3>
      <p className="leading-relaxed text-fg/90">{children}</p>
    </section>
  );
}

export function EventSheet({ entries, onClose }: { entries: SheetEntry[]; onClose: () => void }) {
  const { t, pick, lang } = useT();
  const [offset] = useHijriOffset();
  const first = entries[0];

  return (
    <BottomSheet
      open={entries.length > 0}
      onClose={onClose}
      title={first ? entries.map((e) => pick(e.event.name)).join(" · ") : ""}
    >
      {entries.map(({ event, date, dayIndex }, i) => {
        const diff = daysBetween(todayUTC(), date);
        return (
          <article key={event.id} className={i > 0 ? "mt-8 border-t border-line pt-6" : ""}>
            {i > 0 && <h2 className="mb-2 text-lg font-semibold">{pick(event.name)}</h2>}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-surface-2 px-3 py-1">
                {formatDate(date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="rounded-full bg-surface-2 px-3 py-1">{formatHijri(toHijri(date, offset), lang)}</span>
              <span
                className={`rounded-full px-3 py-1 font-semibold ${
                  diff < 0 ? "bg-surface-2 text-muted" : "bg-gold text-white dark:text-[#0F171A]"
                }`}
              >
                {diff < 0 ? t("passed") : daysLeftLabel(diff, lang)}
              </span>
              {dayIndex && dayIndex > 1 && (
                <span className="rounded-full bg-emerald-soft px-3 py-1 text-emerald">
                  {dayIndex}. {t("day")}
                </span>
              )}
            </div>

            <p className="mt-4 font-serif text-lg leading-relaxed">{pick(event.short)}</p>

            {event.night && (
              <p className="mt-3 flex items-center gap-2 rounded-2xl bg-emerald-soft px-4 py-2.5 text-sm text-emerald">
                <Moon size={15} strokeWidth={1.75} className="shrink-0" />
                {t("eveningNote")}
              </p>
            )}

            <Section icon={Sparkles} title={t("meaning")}>
              {pick(event.meaning)}
            </Section>
            <Section icon={History} title={t("history")}>
              {pick(event.history)}
            </Section>
            <Section icon={event.night ? BookOpen : Hand} title={t("worship")}>
              {pick(event.worship)}
            </Section>
          </article>
        );
      })}
    </BottomSheet>
  );
}
