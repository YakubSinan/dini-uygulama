"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { LANGS } from "@/lib/i18n";
import { useLang, useT, useTheme, type ThemePref } from "@/lib/settings";
import { AppMark } from "@/components/ui/AppMark";

const NEXT_THEME: Record<ThemePref, ThemePref> = { system: "light", light: "dark", dark: "system" };

export function Header() {
  const [lang, setLang] = useLang();
  const [theme, setTheme] = useTheme();
  const { t } = useT();
  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel = theme === "dark" ? t("themeDark") : theme === "light" ? t("themeLight") : t("themeSystem");

  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-line/60 bg-bg/85 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <AppMark className="h-9 w-9" />
          <span className="font-serif text-xl font-bold tracking-wide text-fg">{t("appName")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div
            role="group"
            aria-label="Language"
            className="flex items-center rounded-full border border-line bg-surface p-0.5 text-[11px] font-semibold tracking-wider"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 transition-colors ${
                  lang === l ? "bg-fg text-bg" : "text-muted hover:text-fg"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setTheme(NEXT_THEME[theme])}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            aria-label={`${t("theme")}: ${themeLabel}`}
            title={`${t("theme")}: ${themeLabel}`}
          >
            <ThemeIcon size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </header>
  );
}
