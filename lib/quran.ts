import { cachedJson } from "./api";
import type { Lang } from "./i18n";

const BASE = "https://api.alquran.cloud/v1";

export const ARABIC_EDITION = "quran-uthmani";
export const TRANSLIT_EDITION = "en.transliteration";

export const TRANSLATION_EDITIONS: { id: string; lang: Lang; label: string }[] = [
  { id: "tr.diyanet", lang: "tr", label: "Türkçe – Diyanet İşleri" },
  { id: "de.bubenheim", lang: "de", label: "Deutsch – Bubenheim & Elyas" },
  { id: "en.sahih", lang: "en", label: "English – Sahih International" },
];

export function defaultTranslation(lang: Lang): string {
  return TRANSLATION_EDITIONS.find((e) => e.lang === lang)!.id;
}

export interface Ayah {
  number: number; // global 1..6236
  surah: number;
  numberInSurah: number;
  page: number;
  juz: number;
  arabic: string;
  translit?: string;
  translations: Record<string, string>;
}

interface ApiAyah {
  number: number;
  text: string;
  numberInSurah: number;
  page: number;
  juz: number;
  surah?: { number: number };
}

interface ApiResponse {
  code: number;
  data: { number?: number; ayahs: ApiAyah[] };
}

const BASMALA_STRIP = /[ً-ٰٟۖ-ۭ]/g;

/** AlQuran.cloud prefixes the basmala to ayah 1 of every surah except 1 and 9; we show it as a header instead. */
export function stripBasmala(text: string, surah: number, ayah: number): string {
  if (surah === 1 || surah === 9 || ayah !== 1) return text;
  const words = text.split(" ");
  const plain = words.slice(0, 4).map((w) => w.replace(BASMALA_STRIP, "").replace(/ٱ/g, "ا"));
  if (plain[0] === "بسم" && plain[3]?.includes("رحيم")) return words.slice(4).join(" ");
  return text;
}

export type QuranTarget = { kind: "surah"; surah: number } | { kind: "page"; page: number };

export async function loadAyahs(
  target: QuranTarget,
  options: { translit: boolean; translations: string[] },
): Promise<{ ayahs: Ayah[]; fromCache: boolean }> {
  const path = target.kind === "surah" ? `surah/${target.surah}` : `page/${target.page}`;
  const editions = [ARABIC_EDITION, ...(options.translit ? [TRANSLIT_EDITION] : []), ...options.translations];
  const results = await Promise.all(editions.map((ed) => cachedJson<ApiResponse>(`${BASE}/${path}/${ed}`)));
  const [arabic, ...rest] = results;
  const surahFromTarget = target.kind === "surah" ? target.surah : 0;
  const offset = options.translit ? 1 : 0;

  const ayahs: Ayah[] = arabic.data.data.ayahs.map((a, i) => {
    const surah = a.surah?.number ?? surahFromTarget;
    const translations: Record<string, string> = {};
    options.translations.forEach((ed, j) => {
      translations[ed] = rest[j + offset]?.data.data.ayahs[i]?.text ?? "";
    });
    return {
      number: a.number,
      surah,
      numberInSurah: a.numberInSurah,
      page: a.page,
      juz: a.juz,
      arabic: stripBasmala(a.text, surah, a.numberInSurah),
      translit: options.translit ? rest[0]?.data.data.ayahs[i]?.text : undefined,
      translations,
    };
  });
  return { ayahs, fromCache: results.some((r) => r.fromCache) };
}

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);
}
