"use client";

import { useEffect } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { useLang, useTheme } from "@/lib/settings";

function useThemeSync() {
  const [theme] = useTheme();
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}

function useLangSync() {
  const [lang, setLang] = useLang();
  useEffect(() => {
    // First run: adopt the device language if it is one we support.
    try {
      if (window.localStorage.getItem("nur:lang") === null) {
        const device = navigator.language.slice(0, 2);
        if (device === "de" || device === "en" || device === "tr") setLang(device);
      }
    } catch {
      // ignore
    }
  }, [setLang]);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
}

function useServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      // Avoid stale caches while developing.
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  useThemeSync();
  useLangSync();
  useServiceWorker();
  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col">
      <Header />
      <main className="flex-1 px-4 pb-28 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
