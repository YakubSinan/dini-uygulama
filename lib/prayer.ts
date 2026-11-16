import { cachedJson } from "./api";
import type { PrayerLocation } from "./settings";

export const PRAYER_KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const CALC_METHODS: { id: number; label: string }[] = [
  { id: 13, label: "Diyanet İşleri Başkanlığı (Türkiye)" },
  { id: 3, label: "Muslim World League" },
  { id: 4, label: "Umm al-Qura, Makkah" },
  { id: 2, label: "ISNA (North America)" },
  { id: 5, label: "Egyptian General Authority" },
  { id: 12, label: "UOIF (France)" },
];

export interface DayTimings {
  date: string; // DD-MM-YYYY in the location's timezone
  timezone: string;
  times: Record<PrayerKey, string>; // HH:MM
  hijri: { day: number; month: number; year: number };
}

interface AladhanTimings {
  data: {
    timings: Record<string, string>;
    date: { gregorian: { date: string }; hijri: { day: string; month: { number: number }; year: string } };
    meta: { timezone: string };
  };
}

const API_KEY_MAP: Record<PrayerKey, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function ddmmyyyy(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}

export function timingsUrl(loc: PrayerLocation, method: number, date = new Date()): string {
  const day = ddmmyyyy(date);
  if (loc.kind === "coords") {
    return `https://api.aladhan.com/v1/timings/${day}?latitude=${loc.lat.toFixed(4)}&longitude=${loc.lon.toFixed(4)}&method=${method}`;
  }
  return `https://api.aladhan.com/v1/timingsByCity/${day}?city=${encodeURIComponent(loc.city)}&country=${encodeURIComponent(loc.country)}&method=${method}`;
}

export async function fetchTimings(loc: PrayerLocation, method: number, date = new Date()) {
  const { data, fromCache } = await cachedJson<AladhanTimings>(timingsUrl(loc, method, date));
  const t = data.data;
  const times = {} as Record<PrayerKey, string>;
  for (const key of PRAYER_KEYS) times[key] = (t.timings[API_KEY_MAP[key]] ?? "00:00").slice(0, 5);
  const result: DayTimings = {
    date: t.date.gregorian.date,
    timezone: t.meta.timezone,
    times,
    hijri: { day: Number(t.date.hijri.day), month: t.date.hijri.month.number, year: Number(t.date.hijri.year) },
  };
  return { timings: result, fromCache };
}

/** Seconds since local midnight in a given IANA timezone. */
export function secondsNowInZone(timezone: string, now = new Date()): number {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return get("hour") * 3600 + get("minute") * 60 + get("second");
  } catch {
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  }
}

export function toSeconds(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 3600 + m * 60;
}

/** Determines the current prayer period and the countdown to the next prayer time. */
export function prayerStatus(timings: DayTimings, now = new Date()) {
  const nowSec = secondsNowInZone(timings.timezone, now);
  const secs = PRAYER_KEYS.map((k) => toSeconds(timings.times[k]));
  let currentIdx = -1;
  for (let i = 0; i < secs.length; i++) if (nowSec >= secs[i]) currentIdx = i;
  const current: PrayerKey = currentIdx === -1 ? "isha" : PRAYER_KEYS[currentIdx];
  const nextIdx = currentIdx + 1;
  const next: PrayerKey = nextIdx >= PRAYER_KEYS.length ? "fajr" : PRAYER_KEYS[nextIdx];
  let remaining = (nextIdx >= PRAYER_KEYS.length ? secs[0] + 86400 : secs[nextIdx]) - nowSec;
  if (remaining < 0) remaining += 86400;
  return { current, next, remaining };
}

export function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}
