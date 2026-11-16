import { HIJRI_MONTHS, HIJRI_SUFFIX, LOCALE, translate, type Lang } from "./i18n";
import type { HijriDate } from "./hijri";

export function formatHijri(h: HijriDate, lang: Lang): string {
  return `${h.day} ${HIJRI_MONTHS[h.month - 1][lang]} ${h.year} ${HIJRI_SUFFIX[lang]}`;
}

/** Formats a UTC-noon calendar date in the UI language. */
export function formatDate(d: Date, lang: Lang, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { timeZone: "UTC", ...opts }).format(d);
}

export function daysLeftLabel(days: number, lang: Lang): string {
  if (days === 0) return translate(lang, "isToday");
  if (days === 1) return translate(lang, "tomorrow");
  return `${days} ${translate(lang, "daysLeft")}`;
}

export function formatPercent(value: number, lang: Lang, digits = 0): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    style: "percent",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value / 100);
}
