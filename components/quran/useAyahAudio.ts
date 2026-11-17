"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioUrls, getReciter } from "@/data/reciters";
import { getSurah } from "@/data/surahs";
import type { Ayah } from "@/lib/quran";

/**
 * Gapless ayah-by-ayah player.
 *
 * Switching the `src` of an <audio> element between ayahs forces a new request and decoder
 * start-up, which is heard as a short dropout at every ayah boundary. Instead, each ayah is
 * fetched and decoded into an AudioBuffer ahead of time and the next ayah is scheduled on the
 * Web Audio clock to start at the exact sample the current one ends, so a whole surah (or
 * page) plays without interruption.
 *
 * If an ayah cannot be fetched with CORS (e.g. the Islamic Network fallback CDN), that ayah
 * plays through a plain <audio> element and the player returns to gapless mode afterwards.
 */

interface Slot {
  index: number;
  key: string;
  source: AudioBufferSourceNode;
  end: number;
}

type Mode = "web" | "html" | null;

// Small lead time so the first ayah never starts in the past on slow devices.
const START_LEAD = 0.05;

type AudioCtor = typeof AudioContext;
function audioContextCtor(): AudioCtor | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
}

export function useAyahAudio(ayahs: Ayah[], reciterId: string) {
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const htmlRef = useRef<HTMLAudioElement | null>(null);
  const ayahsRef = useRef(ayahs);
  const reciterRef = useRef(reciterId);
  const buffers = useRef(new Map<string, Promise<AudioBuffer>>());
  const queue = useRef<Slot[]>([]);
  const token = useRef(0);
  const mode = useRef<Mode>(null);
  const cursor = useRef(-1);
  const htmlAttempt = useRef(0);
  const playingRef = useRef(false);

  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlayingState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const setPlaying = useCallback((p: boolean) => {
    playingRef.current = p;
    setPlayingState(p);
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = p ? "playing" : "paused";
  }, []);

  const keyFor = (i: number) => `${reciterRef.current}:${ayahsRef.current[i]?.number}`;

  const updateMediaSession = useCallback((i: number) => {
    const ayah = ayahsRef.current[i];
    if (!ayah || !("mediaSession" in navigator)) return;
    const surah = getSurah(ayah.surah);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: `${surah?.latin ?? ""} ${ayah.surah}:${ayah.numberInSurah}`,
      artist: getReciter(reciterRef.current).name,
      album: "Rıhlemedar – Quran",
      artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
    });
  }, []);

  /** Lazily creates (or wakes) the AudioContext. Must run inside a user gesture on iOS. */
  const ensureContext = useCallback((): AudioContext | null => {
    let ctx = ctxRef.current;
    if (!ctx) {
      const Ctor = audioContextCtor();
      if (!Ctor) return null;
      ctx = new Ctor();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      ctxRef.current = ctx;
      gainRef.current = gain;
      // Safari 17+: let Web Audio keep playing with the screen locked / silent switch on.
      const session = (navigator as unknown as { audioSession?: { type: string } }).audioSession;
      if (session) session.type = "playback";
      ctx.addEventListener("statechange", () => {
        if (mode.current !== "web") return;
        const running = ctx!.state === "running" && queue.current.length > 0;
        if (running !== playingRef.current) setPlaying(running);
      });
    }
    if (ctx.state !== "running") ctx.resume().catch(() => {});
    return ctx;
  }, [setPlaying]);

  /** Fetches and decodes one ayah, trying each mirror that allows CORS. Cached per reciter+ayah. */
  const loadBuffer = useCallback((i: number): Promise<AudioBuffer> => {
    const key = keyFor(i);
    const cached = buffers.current.get(key);
    if (cached) return cached;
    const ayah = ayahsRef.current[i];
    const ctx = ctxRef.current;
    const promise = (async () => {
      if (!ayah || !ctx) throw new Error("unavailable");
      const urls = audioUrls(getReciter(reciterRef.current), ayah.surah, ayah.numberInSurah, ayah.number);
      let lastErr: unknown;
      for (const url of urls) {
        try {
          const res = await fetch(url, { mode: "cors" });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await ctx.decodeAudioData(await res.arrayBuffer());
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr;
    })();
    buffers.current.set(key, promise);
    promise.catch(() => buffers.current.delete(key));
    return promise;
  }, []);

  /** Stops everything that is scheduled or playing and invalidates pending async work. */
  const stopAll = useCallback(() => {
    token.current++;
    for (const slot of queue.current) {
      slot.source.onended = null;
      try {
        slot.source.stop();
      } catch {
        // already stopped
      }
      slot.source.disconnect();
    }
    queue.current = [];
    const html = htmlRef.current;
    if (html) {
      html.pause();
      html.removeAttribute("src");
      html.load();
    }
    mode.current = null;
  }, []);

  // Declared via refs so the scheduling functions can call each other without stale closures.
  const startRef = useRef<(i: number) => void>(() => {});
  const queueNextRef = useRef<(tok: number) => void>(() => {});

  const schedule = useCallback(
    (i: number, buffer: AudioBuffer, when: number, tok: number) => {
      const ctx = ctxRef.current!;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gainRef.current!);
      source.start(when);
      const slot: Slot = { index: i, key: keyFor(i), source, end: when + buffer.duration };
      source.onended = () => {
        if (tok !== token.current) return;
        source.disconnect();
        queue.current = queue.current.filter((s) => s !== slot);
        buffers.current.delete(slot.key);
        const current = queue.current[0];
        if (current) {
          // The next ayah has already started on the audio clock; just follow it in the UI.
          cursor.current = current.index;
          setIndex(current.index);
          updateMediaSession(current.index);
          queueNextRef.current(tok);
        } else if (slot.index + 1 < ayahsRef.current.length) {
          // Next ayah was not ready in time (slow network) or needs the fallback player.
          startRef.current(slot.index + 1);
        } else {
          mode.current = null;
          setPlaying(false);
        }
      };
      queue.current.push(slot);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setPlaying, updateMediaSession],
  );

  /** Decodes the ayah after the last scheduled one and queues it seamlessly behind it. */
  const queueNext = useCallback(
    (tok: number) => {
      const last = queue.current[queue.current.length - 1];
      if (!last || queue.current.length > 1) return;
      const n = last.index + 1;
      if (n >= ayahsRef.current.length) return;
      loadBuffer(n)
        .then((buffer) => {
          if (tok !== token.current || queue.current.length !== 1 || queue.current[0] !== last) return;
          const ctx = ctxRef.current!;
          schedule(n, buffer, Math.max(last.end, ctx.currentTime + 0.01), tok);
        })
        .catch(() => {
          // Handled when the current ayah ends: start(n) falls back to the <audio> element.
        });
    },
    [loadBuffer, schedule],
  );
  queueNextRef.current = queueNext;

  /** Plays ayah i through the <audio> element (non-CORS mirrors). */
  const playHtml = useCallback(
    (i: number, tok: number, attempt: number) => {
      const html = htmlRef.current;
      const ayah = ayahsRef.current[i];
      if (!html || !ayah) return;
      const urls = audioUrls(getReciter(reciterRef.current), ayah.surah, ayah.numberInSurah, ayah.number);
      if (attempt >= urls.length) {
        setError(true);
        setLoading(false);
        setPlaying(false);
        mode.current = null;
        return;
      }
      mode.current = "html";
      htmlAttempt.current = attempt;
      html.dataset.token = String(tok);
      html.dataset.index = String(i);
      html.src = urls[attempt];
      html.play().catch((e: DOMException) => {
        if (e.name === "NotAllowedError") {
          setPlaying(false);
          setLoading(false);
        }
      });
    },
    [setPlaying],
  );

  const start = useCallback(
    (i: number) => {
      const list = ayahsRef.current;
      if (i < 0 || i >= list.length) return;
      stopAll();
      const tok = token.current;
      // Keep only what can still be used: this ayah and the one after it.
      const keep = new Set([keyFor(i), keyFor(i + 1)]);
      for (const k of buffers.current.keys()) if (!keep.has(k)) buffers.current.delete(k);

      cursor.current = i;
      setIndex(i);
      setError(false);
      setLoading(true);
      updateMediaSession(i);

      const ctx = ensureContext();
      if (!ctx) return playHtml(i, tok, 0);
      mode.current = "web";
      loadBuffer(i)
        .then((buffer) => {
          if (tok !== token.current) return;
          schedule(i, buffer, ctx.currentTime + START_LEAD, tok);
          setLoading(false);
          setPlaying(true);
          if (ctx.state !== "running") ctx.resume().catch(() => {});
          queueNext(tok);
        })
        .catch(() => {
          if (tok === token.current) playHtml(i, tok, 0);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stopAll, ensureContext, loadBuffer, schedule, queueNext, playHtml, setPlaying, updateMediaSession],
  );
  startRef.current = start;

  // Fallback <audio> element, created once.
  useEffect(() => {
    const html = new Audio();
    html.preload = "auto";
    htmlRef.current = html;
    const current = () => Number(html.dataset.token) === token.current && mode.current === "html";

    const onPlaying = () => {
      if (!current()) return;
      setPlaying(true);
      setLoading(false);
    };
    const onPause = () => current() && setPlaying(false);
    const onWaiting = () => current() && setLoading(true);
    const onEnded = () => {
      if (!current()) return;
      const next = Number(html.dataset.index) + 1;
      if (next < ayahsRef.current.length) startRef.current(next);
      else {
        mode.current = null;
        setPlaying(false);
      }
    };
    const onError = () => {
      if (!current() || !html.getAttribute("src")) return;
      playHtml(Number(html.dataset.index), token.current, htmlAttempt.current + 1);
    };

    html.addEventListener("playing", onPlaying);
    html.addEventListener("pause", onPause);
    html.addEventListener("waiting", onWaiting);
    html.addEventListener("ended", onEnded);
    html.addEventListener("error", onError);
    return () => {
      html.removeEventListener("playing", onPlaying);
      html.removeEventListener("pause", onPause);
      html.removeEventListener("waiting", onWaiting);
      html.removeEventListener("ended", onEnded);
      html.removeEventListener("error", onError);
    };
  }, [playHtml, setPlaying]);

  // Unmount: release audio resources.
  useEffect(
    () => () => {
      stopAll();
      buffers.current.clear();
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    },
    [stopAll],
  );

  // New content (different surah/page): stop and reset.
  useEffect(() => {
    ayahsRef.current = ayahs;
    stopAll();
    buffers.current.clear();
    cursor.current = -1;
    setIndex(null);
    setError(false);
    setLoading(false);
    setPlaying(false);
  }, [ayahs, stopAll, setPlaying]);

  // Reciter switched: continue the current ayah with the new voice.
  useEffect(() => {
    if (reciterRef.current === reciterId) return;
    reciterRef.current = reciterId;
    if (playingRef.current && cursor.current >= 0) startRef.current(cursor.current);
  }, [reciterId]);

  const pause = useCallback(() => {
    if (mode.current === "web") {
      ctxRef.current?.suspend().catch(() => {});
      setPlaying(false);
    } else if (mode.current === "html") htmlRef.current?.pause();
  }, [setPlaying]);

  const resume = useCallback(() => {
    if (mode.current === "web" && queue.current.length > 0) {
      ensureContext();
      setPlaying(true);
    } else if (mode.current === "html") htmlRef.current?.play().catch(() => {});
    else start(Math.max(0, cursor.current));
  }, [ensureContext, setPlaying, start]);

  const playAt = useCallback((i: number) => start(i), [start]);

  const toggle = useCallback(() => {
    if (cursor.current < 0) return start(0);
    if (error) return start(cursor.current);
    if (playingRef.current) pause();
    else resume();
  }, [start, error, pause, resume]);

  const next = useCallback(() => {
    if (cursor.current + 1 < ayahsRef.current.length) start(cursor.current + 1);
  }, [start]);

  const prev = useCallback(() => {
    start(Math.max(0, cursor.current - 1));
  }, [start]);

  // Lock-screen / headset controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", resume);
    ms.setActionHandler("pause", pause);
    ms.setActionHandler("nexttrack", next);
    ms.setActionHandler("previoustrack", prev);
    return () => {
      (["play", "pause", "nexttrack", "previoustrack"] as MediaSessionAction[]).forEach((a) =>
        ms.setActionHandler(a, null),
      );
    };
  }, [next, prev, pause, resume]);

  return { index, playing, loading, error, playAt, toggle, next, prev };
}
