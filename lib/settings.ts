"use client";

import { useCallback } from "react";
import { useStored } from "./storage";
import { translate, type DictKey, type Lang, type Localized } from "./i18n";

export type ThemePref = "system" | "light" | "dark";

export type PrayerLocation =
  | { kind: "coords"; lat: number; lon: number; label?: string }
  | { kind: "city"; city: string; country: string };

export interface Bookmark {
  surah: number;
  ayah: number;
  page: number;
  savedAt: number;
}

export const DEFAULT_LOCATION: PrayerLocation = { kind: "city", city: "Istanbul", country: "Turkey" };

export function useLang() {
  return useStored<Lang>("lang", "tr");
}

export function useTheme() {
  return useStored<ThemePref>("theme", "system");
}

/** Returns a translator bound to the current UI language plus a picker for localized objects. */
export function useT() {
  const [lang] = useLang();
  const t = useCallback((key: DictKey) => translate(lang, key), [lang]);
  const pick = useCallback((value: Localized) => value[lang], [lang]);
  return { t, pick, lang };
}

export function useLocation() {
  return useStored<PrayerLocation>("location", DEFAULT_LOCATION);
}

export function useCalcMethod() {
  return useStored<number>("calcMethod", 13);
}

export function useHijriOffset() {
  return useStored<number>("hijriOffset", 0);
}

export function useBookmark() {
  return useStored<Bookmark | null>("bookmark", null);
}

export function useReciter() {
  return useStored<string>("reciter", "sudais");
}

export function useArabicSize() {
  return useStored<number>("arabicSize", 30);
}

export function useShowTranslit() {
  return useStored<boolean>("showTranslit", true);
}

export function useShowArabic() {
  return useStored<boolean>("showArabic", true);
}

export function useShowTranslation() {
  return useStored<boolean>("showTranslation", true);
}

export type ViewLayer = "arabic" | "translit" | "translation";
export const VIEW_LAYERS: ViewLayer[] = ["arabic", "translit", "translation"];

/** Which text layers the Quran reader shows. At least one layer always stays visible. */
export function useViewLayers() {
  const [arabic, setArabic] = useShowArabic();
  const [translit, setTranslit] = useShowTranslit();
  const [translation, setTranslation] = useShowTranslation();
  const layers: Record<ViewLayer, boolean> = { arabic, translit, translation };
  const setters: Record<ViewLayer, (v: boolean) => void> = {
    arabic: setArabic,
    translit: setTranslit,
    translation: setTranslation,
  };
  const toggle = (layer: ViewLayer) => {
    const active = VIEW_LAYERS.filter((l) => layers[l]);
    if (layers[layer] && active.length === 1) return; // never hide everything
    setters[layer](!layers[layer]);
  };
  const only = (layer: ViewLayer) => VIEW_LAYERS.forEach((l) => setters[l](l === layer));
  const all = () => VIEW_LAYERS.forEach((l) => setters[l](true));
  return { layers, toggle, only, all };
}

/** Selected translation editions. Empty array means "follow UI language". */
export function useTranslations() {
  return useStored<string[]>("translations", []);
}
