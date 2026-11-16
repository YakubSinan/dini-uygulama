"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Sparkles } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { eventsForDay, upcomingEvents, type EventMatch } from "@/data/islamicEvents";
import { cachedJson } from "@/lib/api";
import { dateKey, dateKeyToUTC, sameDay, toHijri, todayUTC, type HijriDate } from "@/lib/hijri";
import { HIJRI_MONTHS, HIJRI_SUFFIX } from "@/lib/i18n";
import { daysLeftLabel, formatDate, formatHijri } from "@/lib/format";
import { useHijriOffset, useT } from "@/lib/settings";
import { useHydrated } from "@/lib/storage";
import { EventSheet, type SheetEntry } from "./EventSheet";

interface DayCell {
  date: Date;
  hijri: HijriDate;
  events: EventMatch[];
}

interface AladhanCalendar {
  data: { gregorian: { day: string }; hijri: { day: string; month: { number: number }; year: string } }[];
}

/** Hijri dates for every day of a Gregorian month: Aladhan (Umm al-Qura) online, Intl offline. */
function useMonthHijri(year: number, month: number, offset: number, enabled: boolean) {
  const [remote, setRemote] = useState<{ key: string; days: HijriDate[] } | null>(null);
  const key = `${year}-${month}`;

  useEffect(() => {
    if (!enabled || offset !== 0) return;
    let cancelled = false;
    cachedJson<AladhanCalendar>(
      `https://api.aladhan.com/v1/gToHCalendar/${month + 1}/${year}?calendarMethod=UAQ`,
    )
      .then(({ data }) => {
        if (cancelled) return;
        setRemote({
          key,
          days: data.data.map((d) => ({ day: Number(d.hijri.day), month: d.hijri.month.number, year: Number(d.hijri.year) })),
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [key, year, month, offset, enabled]);

  return useMemo(() => {
    const count = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const fromApi = remote?.key === key && offset === 0 && remote.days.length === count ? remote.days : null;
    return Array.from({ length: count }, (_, i) => {
      const date = dateKeyToUTC(year, month, i + 1);
      const hijri = fromApi?.[i] ?? toHijri(date, offset);
      return { date, hijri, events: eventsForDay(date, hijri) } satisfies DayCell;
    });
  }, [remote, key, year, month, offset]);
}

export function CalendarView() {
  const { t, pick, lang } = useT();
  const hydrated = useHydrated();
  const params = useSearchParams();
  const [offset, setOffset] = useHijriOffset();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() };
  });
  const [selected, setSelected] = useState<Date | null>(null);
  const [sheet, setSheet] = useState<SheetEntry[]>([]);

  const days = useMonthHijri(cursor.y, cursor.m, offset, hydrated);
  const today = hydrated ? todayUTC() : null;

  // Deep link from the home widget: /calendar?event=<id>
  const eventParam = params.get("event");
  useEffect(() => {
    if (!eventParam || !hydrated) return;
    const hit = upcomingEvents(todayUTC(), offset).find((u) => u.event.id === eventParam);
    if (hit) {
      setCursor({ y: hit.date.getUTCFullYear(), m: hit.date.getUTCMonth() });
      setSelected(hit.date);
      setSheet([{ event: hit.event, date: hit.date }]);
    }
  }, [eventParam, hydrated, offset]);

  const upcoming = useMemo(() => (hydrated ? upcomingEvents(todayUTC(), offset).slice(0, 6) : []), [hydrated, offset]);

  const leading = (new Date(Date.UTC(cursor.y, cursor.m, 1)).getUTCDay() + 6) % 7; // Monday-first
  const weekdays = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" });
    // 2024-01-01 was a Monday.
    return Array.from({ length: 7 }, (_, i) => fmt.format(dateKeyToUTC(2024, 0, 1 + i)));
  }, [lang]);

  const hijriRange = useMemo(() => {
    if (!days.length) return "";
    const a = days[0].hijri;
    const b = days[days.length - 1].hijri;
    const name = (h: HijriDate) => HIJRI_MONTHS[h.month - 1][lang];
    if (a.month === b.month) return `${name(a)} ${a.year} ${HIJRI_SUFFIX[lang]}`;
    return a.year === b.year
      ? `${name(a)} – ${name(b)} ${b.year} ${HIJRI_SUFFIX[lang]}`
      : `${name(a)} ${a.year} – ${name(b)} ${b.year} ${HIJRI_SUFFIX[lang]}`;
  }, [days, lang]);

  const monthEvents = days.filter((d) => d.events.some((e) => e.dayIndex === 1));

  const shift = (delta: number) =>
    setCursor(({ y, m }) => {
      const d = new Date(y, m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const openDay = (cell: DayCell) => {
    setSelected(cell.date);
    if (cell.events.length) setSheet(cell.events.map((e) => ({ event: e.event, date: cell.date, dayIndex: e.dayIndex })));
  };

  const selectedCell = selected ? days.find((d) => sameDay(d.date, selected)) : undefined;

  return (
    <div className="space-y-4 pt-3">
      <h1 className="px-1 font-serif text-[1.7rem] font-bold">{t("calendarTitle")}</h1>

      <Card className="px-3 pb-4 pt-4">
        <div className="mb-3 flex items-center justify-between px-2">
          <div>
            <div className="text-xl font-semibold capitalize">
              {formatDate(dateKeyToUTC(cursor.y, cursor.m, 1), lang, { month: "long", year: "numeric" })}
            </div>
            <div className="text-sm text-gold">{hijriRange}</div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const n = new Date();
                setCursor({ y: n.getFullYear(), m: n.getMonth() });
                setSelected(todayUTC());
              }}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-gold hover:bg-gold-soft"
            >
              {t("today")}
            </button>
            <button
              onClick={() => shift(-1)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              aria-label={t("previous")}
            >
              <ChevronLeft size={18} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => shift(1)}
              className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
              aria-label={t("next")}
            >
              <ChevronRight size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-line pb-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted">
          {weekdays.map((w, i) => (
            <div key={i}>{w}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {Array.from({ length: leading }, (_, i) => (
            <div key={`b${i}`} />
          ))}
          {days.map((cell) => {
            const isToday = today && sameDay(cell.date, today);
            const isSelected = selected && sameDay(cell.date, selected);
            const hasEvent = cell.events.length > 0;
            const major = cell.events.some((e) => e.event.major);
            return (
              <button
                key={dateKey(cell.date)}
                onClick={() => openDay(cell)}
                className={`relative mx-auto flex h-14 w-full max-w-[3.25rem] flex-col items-center justify-center rounded-2xl transition-colors ${
                  isSelected ? "bg-fg text-bg" : hasEvent ? "bg-gold-soft hover:bg-gold/20" : "hover:bg-surface-2"
                }`}
                aria-label={`${formatDate(cell.date, lang, { day: "numeric", month: "long" })}, ${formatHijri(cell.hijri, lang)}${
                  hasEvent ? `, ${cell.events.map((e) => pick(e.event.name)).join(", ")}` : ""
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-[15px] tabular-nums ${
                    isToday && !isSelected ? "bg-gold font-semibold text-white dark:text-[#0F171A]" : ""
                  }`}
                >
                  {cell.date.getUTCDate()}
                </span>
                <span className={`text-[10px] tabular-nums ${isSelected ? "text-bg/70" : "text-muted"}`}>
                  {cell.hijri.day}
                </span>
                {hasEvent && (
                  <span
                    className={`absolute bottom-1 h-1 rounded-full ${major ? "w-3 bg-emerald" : "w-1 bg-gold"} ${
                      isSelected ? "bg-bg" : ""
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedCell && (
          <div className="mx-2 mt-4 rounded-2xl bg-surface-2 px-4 py-3 text-sm">
            <div className="font-medium">
              {formatDate(selectedCell.date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
            <div className="text-gold">{formatHijri(selectedCell.hijri, lang)}</div>
            {selectedCell.events.map((e) => (
              <button
                key={e.event.id}
                onClick={() => openDay(selectedCell)}
                className="mt-2 flex items-center gap-2 text-left font-medium text-emerald"
              >
                <Sparkles size={14} strokeWidth={1.75} /> {pick(e.event.name)}
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardTitle icon={Sparkles}>{t("holyDaysThisMonth")}</CardTitle>
        {monthEvents.length === 0 ? (
          <p className="text-sm text-muted">{t("noEventsMonth")}</p>
        ) : (
          <ul className="space-y-2">
            {monthEvents.flatMap((cell) =>
              cell.events
                .filter((e) => e.dayIndex === 1)
                .map((e) => (
                  <EventRow
                    key={e.event.id}
                    name={pick(e.event.name)}
                    date={cell.date}
                    major={e.event.major}
                    onClick={() => setSheet([{ event: e.event, date: cell.date }])}
                  />
                )),
            )}
          </ul>
        )}
      </Card>

      <Card>
        <CardTitle icon={Sparkles}>{t("upcoming")}</CardTitle>
        <ul className="space-y-2">
          {upcoming.map((u) => (
            <EventRow
              key={u.event.id}
              name={pick(u.event.name)}
              date={u.date}
              major={u.event.major}
              onClick={() => setSheet([{ event: u.event, date: u.date }])}
            />
          ))}
        </ul>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-medium">{t("hijriAdjust")}</div>
            <div className="text-xs text-muted">{t("hijriAdjustHint")}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffset(Math.max(-2, offset - 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-fg"
              aria-label="-1"
            >
              <Minus size={16} strokeWidth={1.75} />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{offset > 0 ? `+${offset}` : offset}</span>
            <button
              onClick={() => setOffset(Math.min(2, offset + 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-fg"
              aria-label="+1"
            >
              <Plus size={16} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </Card>

      <EventSheet entries={sheet} onClose={() => setSheet([])} />
    </div>
  );
}

function EventRow({ name, date, major, onClick }: { name: string; date: Date; major?: boolean; onClick: () => void }) {
  const { t, lang } = useT();
  const diff = Math.round((date.getTime() - todayUTC().getTime()) / 86400000);
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-2xl border border-line px-4 py-3 text-left transition-colors hover:bg-surface-2/60"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${major ? "bg-emerald" : "bg-gold"}`} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{name}</span>
          <span className="block text-xs text-muted">
            {formatDate(date, lang, { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
          </span>
        </span>
        <span className="shrink-0 text-xs font-medium tabular-nums text-gold">
          {diff < 0 ? "" : diff <= 1 ? daysLeftLabel(diff, lang) : `${diff} ${t("days")}`}
        </span>
      </button>
    </li>
  );
}
