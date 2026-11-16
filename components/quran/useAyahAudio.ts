"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { audioUrls, getReciter } from "@/data/reciters";
import { getSurah } from "@/data/surahs";
import type { Ayah } from "@/lib/quran";

/**
 * Sequential ayah-by-ayah player. Streams each ayah from EveryAyah, falls back to the
 * Islamic Network CDN on error, preloads the next ayah, and advances automatically so a
 * whole surah (or page) plays continuously.
 */
export function useAyahAudio(ayahs: Ayah[], reciterId: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadRef = useRef<HTMLAudioElement | null>(null);
  const ayahsRef = useRef(ayahs);
  const reciterRef = useRef(reciterId);
  const cursor = useRef({ index: -1, attempt: 0 });

  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const start = useCallback((i: number, attempt = 0) => {
    const audio = audioRef.current;
    const list = ayahsRef.current;
    if (!audio || i < 0 || i >= list.length) return;
    const ayah = list[i];
    const reciter = getReciter(reciterRef.current);
    const urls = audioUrls(reciter, ayah.surah, ayah.numberInSurah, ayah.number);
    if (attempt >= urls.length) {
      setError(true);
      setPlaying(false);
      setLoading(false);
      return;
    }
    cursor.current = { index: i, attempt };
    setIndex(i);
    setError(false);
    setLoading(true);
    audio.src = urls[attempt];
    audio.play().catch((e: DOMException) => {
      if (e.name === "NotAllowedError") {
        setPlaying(false);
        setLoading(false);
      }
      // AbortError (source switched) and network errors are handled by the "error" event.
    });

    const next = list[i + 1];
    if (next && preloadRef.current) {
      preloadRef.current.src = audioUrls(reciter, next.surah, next.numberInSurah, next.number)[0];
    }

    if ("mediaSession" in navigator) {
      const surah = getSurah(ayah.surah);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: `${surah?.latin ?? ""} ${ayah.surah}:${ayah.numberInSurah}`,
        artist: reciter.name,
        album: "Nur – Quran",
        artwork: [{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }],
      });
    }
  }, []);

  // Create audio elements once.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    const preload = new Audio();
    preload.preload = "auto";
    preload.muted = true;
    audioRef.current = audio;
    preloadRef.current = preload;
    let disposed = false;

    const onPlaying = () => {
      setPlaying(true);
      setLoading(false);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onEnded = () => {
      const nextIndex = cursor.current.index + 1;
      if (nextIndex < ayahsRef.current.length) start(nextIndex);
      else setPlaying(false);
    };
    const onError = () => {
      if (disposed || !audio.getAttribute("src")) return;
      start(cursor.current.index, cursor.current.attempt + 1);
    };

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      disposed = true;
      audio.pause();
      audio.removeAttribute("src");
      preload.removeAttribute("src");
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [start]);

  // New content (different surah/page): stop and reset.
  useEffect(() => {
    ayahsRef.current = ayahs;
    audioRef.current?.pause();
    cursor.current = { index: -1, attempt: 0 };
    setIndex(null);
    setError(false);
    setLoading(false);
  }, [ayahs]);

  // Reciter switched: continue the current ayah with the new voice.
  useEffect(() => {
    reciterRef.current = reciterId;
    const audio = audioRef.current;
    if (audio && !audio.paused && cursor.current.index >= 0) start(cursor.current.index);
  }, [reciterId, start]);

  const playAt = useCallback((i: number) => start(i), [start]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (cursor.current.index < 0) return start(0);
    if (audio.paused) {
      if (error) start(cursor.current.index);
      else audio.play().catch(() => {});
    } else audio.pause();
  }, [start, error]);

  const next = useCallback(() => {
    if (cursor.current.index + 1 < ayahsRef.current.length) start(cursor.current.index + 1);
  }, [start]);

  const prev = useCallback(() => {
    start(Math.max(0, cursor.current.index - 1));
  }, [start]);

  // Lock-screen / headset controls.
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", () => audioRef.current?.play());
    ms.setActionHandler("pause", () => audioRef.current?.pause());
    ms.setActionHandler("nexttrack", next);
    ms.setActionHandler("previoustrack", prev);
    return () => {
      (["play", "pause", "nexttrack", "previoustrack"] as MediaSessionAction[]).forEach((a) =>
        ms.setActionHandler(a, null),
      );
    };
  }, [next, prev]);

  return { index, playing, loading, error, playAt, toggle, next, prev };
}
