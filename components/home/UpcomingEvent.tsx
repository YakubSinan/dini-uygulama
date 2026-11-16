"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { upcomingEvents } from "@/data/islamicEvents";
import { todayUTC } from "@/lib/hijri";
import { useHijriOffset, useT } from "@/lib/settings";
import { useNow } from "@/lib/useNow";
import { formatDate } from "@/lib/format";

export function UpcomingEvent() {
  const { t, pick, lang } = useT();
  const [offset] = useHijriOffset();
  const now = useNow(60_000);
  const dayStamp = now?.toDateString();

  const upcoming = useMemo(
    () => (dayStamp ? upcomingEvents(todayUTC(), offset).slice(0, 3) : []),
    [dayStamp, offset],
  );
  const [first, ...rest] = upcoming;
  if (!first) return <div className="h-40 rounded-3xl border border-line bg-surface" />;

  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-surface">
      <Link href={`/calendar?event=${first.event.id}`} className="block p-5 transition-colors hover:bg-surface-2/50">
        <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
          <Sparkles size={16} strokeWidth={1.75} className="text-gold" />
          {t("upcomingEvent")}
        </h2>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="font-serif text-2xl font-bold leading-tight">{pick(first.event.name)}</div>
            <div className="mt-1 text-sm text-muted">
              {formatDate(first.date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div className="shrink-0 text-right">
            {first.daysLeft === 0 ? (
              <div className="rounded-full bg-gold px-3 py-1 text-sm font-semibold text-white dark:text-[#0F171A]">
                {t("isToday")}
              </div>
            ) : (
              <>
                <div className="text-4xl font-semibold tabular-nums leading-none text-gold">{first.daysLeft}</div>
                <div className="mt-1 text-xs text-muted">{first.daysLeft === 1 ? t("dayLeft") : t("daysLeft")}</div>
              </>
            )}
          </div>
        </div>
      </Link>
      {rest.length > 0 && (
        <ul className="divide-y divide-line border-t border-line">
          {rest.map((u) => (
            <li key={u.event.id}>
              <Link
                href={`/calendar?event=${u.event.id}`}
                className="flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-surface-2/50"
              >
                <span className="truncate">{pick(u.event.name)}</span>
                <span className="flex shrink-0 items-center gap-2 text-muted tabular-nums">
                  {u.daysLeft} {t("days")}
                  <ArrowRight size={14} strokeWidth={1.75} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
