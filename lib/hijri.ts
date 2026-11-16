/**
 * Offline Hijri conversion based on the Umm al-Qura calendar shipped with every modern
 * browser's Intl implementation. The same calendar (UAQ) is requested from the Aladhan API,
 * so online and offline results agree.
 */

export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
}

let formatter: Intl.DateTimeFormat | null = null;

function getFormatter() {
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return formatter;
}

/** Local calendar date at UTC noon, which avoids timezone and DST edge cases. */
export function dateKeyToUTC(y: number, m: number, d: number): Date {
  return new Date(Date.UTC(y, m, d, 12));
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function todayUTC(): Date {
  const now = new Date();
  return dateKeyToUTC(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toHijri(date: Date, offsetDays = 0): HijriDate {
  const shifted = offsetDays ? addDays(date, offsetDays) : date;
  const parts = getFormatter().formatToParts(shifted);
  const get = (type: string) => parseInt(parts.find((p) => p.type === type)?.value ?? "0", 10);
  return { day: get("day"), month: get("month"), year: get("year") };
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export function dateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
