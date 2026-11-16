"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed reactive store. Every key is namespaced, values are JSON,
 * and all components that read the same key re-render together when it changes
 * (also across browser tabs via the native "storage" event).
 */

const PREFIX = "nur:";
const listeners = new Set<() => void>();
const parsedCache = new Map<string, { raw: string | null; value: unknown }>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key.startsWith(PREFIX)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = readRaw(key);
  const cached = parsedCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  let value: unknown = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw);
    } catch {
      value = fallback;
    }
  }
  parsedCache.set(key, { raw, value });
  return value as T;
}

export function writeStored<T>(key: string, value: T) {
  try {
    if (value === undefined) window.localStorage.removeItem(PREFIX + key);
    else window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode). The app keeps working in memory for this session.
  }
  emit();
}

/**
 * React hook for a persisted value. On the server and during hydration it returns the
 * fallback, then switches to the stored value, so markup never mismatches.
 */
const serverFallbacks = new Map<string, unknown>();
function stableFallback<T>(key: string, fallback: T): T {
  if (!serverFallbacks.has(key)) serverFallbacks.set(key, fallback);
  return serverFallbacks.get(key) as T;
}

export function useStored<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, stableFallback(key, fallback)),
    () => stableFallback(key, fallback),
  );
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readStored(key, stableFallback(key, fallback));
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeStored(key, resolved);
    },
    // fallback is intentionally excluded: callers pass literals that are recreated each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  return [value, set];
}

const noopSubscribe = () => () => {};
/** True once running in the browser after hydration. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
