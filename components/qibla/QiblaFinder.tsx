"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, Info, LoaderCircle, LocateFixed, MapPin, RotateCcw, RotateCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cachedJson } from "@/lib/api";
import { useLocation, useT, type PrayerLocation } from "@/lib/settings";
import { angleDiff, distanceToKaaba, qiblaBearing } from "@/lib/qibla";

interface Coords {
  lat: number;
  lon: number;
  label: string;
}

interface GeocodeResponse {
  results?: { name: string; latitude: number; longitude: number; country?: string; country_code?: string }[];
}

/** Resolves the saved prayer location to coordinates (city names are geocoded via Open-Meteo). */
async function resolveCoords(loc: PrayerLocation, fallbackLabel: string): Promise<Coords> {
  if (loc.kind === "coords") {
    return { lat: loc.lat, lon: loc.lon, label: loc.label ?? `${fallbackLabel} (${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)})` };
  }
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc.city)}&count=10&language=en&format=json`;
  const { data } = await cachedJson<GeocodeResponse>(url);
  const results = data.results ?? [];
  if (!results.length) throw new Error("not found");
  const wanted = loc.country.trim().toLowerCase();
  const match =
    (wanted &&
      results.find(
        (r) =>
          r.country?.toLowerCase().includes(wanted) ||
          wanted.includes(r.country?.toLowerCase() ?? "\u0000") ||
          r.country_code?.toLowerCase() === wanted,
      )) ||
    results[0];
  return { lat: match.latitude, lon: match.longitude, label: [loc.city, loc.country].filter(Boolean).join(", ") };
}

type CompassState = "idle" | "active" | "unsupported" | "denied";

interface OrientationWithCompass extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}
type PermissionCtor = { requestPermission?: () => Promise<"granted" | "denied"> };

/** Device heading in degrees clockwise from north, smoothed. Null until a reading arrives. */
function useCompass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [state, setState] = useState<CompassState>("idle");
  const smooth = useRef<{ x: number; y: number } | null>(null);
  const cleanup = useRef<(() => void) | null>(null);

  const listen = useCallback(() => {
    cleanup.current?.();
    let gotAbsolute = false;
    const apply = (raw: number) => {
      // Low-pass filter on the unit circle so 359° -> 1° does not spin the dial.
      const r = (raw * Math.PI) / 180;
      const prev = smooth.current;
      const k = 0.2;
      const next = prev
        ? { x: prev.x + (Math.cos(r) - prev.x) * k, y: prev.y + (Math.sin(r) - prev.y) * k }
        : { x: Math.cos(r), y: Math.sin(r) };
      smooth.current = next;
      setHeading(((Math.atan2(next.y, next.x) * 180) / Math.PI + 360) % 360);
      setState("active");
    };
    const screenAngle = () => (typeof screen !== "undefined" && screen.orientation ? screen.orientation.angle : 0);

    const onAbsolute = (e: DeviceOrientationEvent) => {
      if (e.alpha == null) return;
      gotAbsolute = true;
      apply((360 - e.alpha + screenAngle()) % 360);
    };
    const onOrientation = (e: DeviceOrientationEvent) => {
      const ios = (e as OrientationWithCompass).webkitCompassHeading;
      if (typeof ios === "number" && ios >= 0) return apply((ios + screenAngle()) % 360);
      if (!gotAbsolute && e.absolute && e.alpha != null) apply((360 - e.alpha + screenAngle()) % 360);
    };

    window.addEventListener("deviceorientationabsolute", onAbsolute as EventListener);
    window.addEventListener("deviceorientation", onOrientation);
    const timer = setTimeout(() => {
      // No usable reading after a few seconds: desktop or a phone without magnetometer.
      setState((s) => (s === "active" ? s : "unsupported"));
    }, 3000);
    cleanup.current = () => {
      clearTimeout(timer);
      window.removeEventListener("deviceorientationabsolute", onAbsolute as EventListener);
      window.removeEventListener("deviceorientation", onOrientation);
    };
  }, []);

  /** iOS needs an explicit permission request from a user gesture. */
  const startWithPermission = useCallback(async () => {
    const ctor = (typeof DeviceOrientationEvent !== "undefined" ? DeviceOrientationEvent : undefined) as
      | PermissionCtor
      | undefined;
    if (ctor?.requestPermission) {
      try {
        if ((await ctor.requestPermission()) !== "granted") return setState("denied");
      } catch {
        return setState("denied");
      }
    }
    listen();
  }, [listen]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      setState("unsupported");
      return;
    }
    // Android/desktop: start right away. iOS waits for the button (permission prompt).
    if (!(DeviceOrientationEvent as unknown as PermissionCtor).requestPermission) listen();
    return () => cleanup.current?.();
  }, [listen]);

  const needsPermission =
    typeof DeviceOrientationEvent !== "undefined" &&
    !!(DeviceOrientationEvent as unknown as PermissionCtor).requestPermission &&
    state === "idle";

  return { heading, state, needsPermission, start: startWithPermission };
}

const ALIGN_TOLERANCE = 5;

export function QiblaFinder() {
  const { t, lang } = useT();
  const [location] = useLocation();
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locState, setLocState] = useState<"loading" | "ok" | "error">("loading");
  const [geoBusy, setGeoBusy] = useState(false);
  const compass = useCompass();
  const wasAligned = useRef(false);
  const locKey = JSON.stringify(location);

  useEffect(() => {
    let cancelled = false;
    setLocState("loading");
    resolveCoords(location, t("currentLocation"))
      .then((c) => {
        if (cancelled) return;
        setCoords(c);
        setLocState("ok");
      })
      .catch(() => !cancelled && setLocState("error"));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locKey]);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    setGeoBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setCoords({ lat, lon, label: `${t("currentLocation")} (${lat.toFixed(2)}, ${lon.toFixed(2)})` });
        setLocState("ok");
        setGeoBusy(false);
      },
      () => setGeoBusy(false),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const bearing = coords ? qiblaBearing(coords.lat, coords.lon) : null;
  const distance = coords ? distanceToKaaba(coords.lat, coords.lon) : null;
  const live = compass.state === "active" && compass.heading !== null;
  const heading = live ? compass.heading! : 0;
  const diff = bearing !== null && live ? angleDiff(heading, bearing) : null;
  const aligned = diff !== null && Math.abs(diff) <= ALIGN_TOLERANCE;

  useEffect(() => {
    if (aligned && !wasAligned.current && "vibrate" in navigator) navigator.vibrate?.(60);
    wasAligned.current = aligned;
  }, [aligned]);

  const nf = new Intl.NumberFormat(lang === "tr" ? "tr-TR" : lang === "de" ? "de-DE" : "en-GB", {
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-4 pb-4">
      <h1 className="px-1 font-serif text-[1.7rem] font-bold">{t("qiblaTitle")}</h1>

      <Card className="flex flex-col items-center pattern-star">
        <Dial heading={heading} bearing={bearing} aligned={aligned} />

        <div className="mt-5 text-center" aria-live="polite">
          {bearing === null ? (
            <p className="text-sm text-muted">
              {locState === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <LoaderCircle size={16} className="animate-spin" /> {t("loading")}
                </span>
              ) : (
                t("qiblaNoLocation")
              )}
            </p>
          ) : (
            <>
              <div className="font-serif text-4xl font-bold tabular-nums text-fg">{nf.format(bearing)}°</div>
              <div className="mt-0.5 text-xs text-muted">
                {t("qiblaDirection")} · {t("qiblaFromNorth")}
              </div>
              {diff !== null && (
                <div
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium ${
                    aligned ? "bg-emerald text-white dark:text-[#0F171A]" : "bg-surface-2 text-fg"
                  }`}
                >
                  {aligned ? (
                    <>
                      <Compass size={15} strokeWidth={2} /> {t("qiblaAligned")}
                    </>
                  ) : diff > 0 ? (
                    <>
                      <RotateCw size={15} strokeWidth={2} /> {t("qiblaTurnRight")} {nf.format(Math.abs(diff))}°
                    </>
                  ) : (
                    <>
                      <RotateCcw size={15} strokeWidth={2} /> {t("qiblaTurnLeft")} {nf.format(Math.abs(diff))}°
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {compass.needsPermission && (
          <button
            onClick={compass.start}
            className="mt-4 flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-medium text-white dark:text-[#0F171A]"
          >
            <Compass size={16} strokeWidth={1.75} /> {t("qiblaStartCompass")}
          </button>
        )}
        {(compass.state === "unsupported" || compass.state === "denied") && (
          <p className="mt-4 max-w-xs text-center text-xs text-muted">
            {compass.state === "denied" ? t("qiblaCompassDenied") : t("qiblaNoCompass")}
          </p>
        )}
      </Card>

      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <MapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-gold" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t("qiblaFor")}</div>
            <div className="truncate text-[15px]">{coords?.label ?? "–"}</div>
            {distance !== null && (
              <div className="mt-0.5 text-xs text-muted">
                {t("qiblaDistance")}: {nf.format(distance)} km
              </div>
            )}
          </div>
        </div>
        <button
          onClick={locateMe}
          disabled={geoBusy}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-2 disabled:opacity-60"
        >
          {geoBusy ? <LoaderCircle size={16} className="animate-spin" /> : <LocateFixed size={16} strokeWidth={1.75} />}
          {geoBusy ? t("locating") : t("useMyLocation")}
        </button>
        <p className="flex gap-2 text-xs leading-relaxed text-muted">
          <Info size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          {t("qiblaCalibrate")}
        </p>
      </Card>
    </div>
  );
}

/** Compass rose that turns with the device; the Kaaba marker sits on the Qibla bearing. */
function Dial({ heading, bearing, aligned }: { heading: number; bearing: number | null; aligned: boolean }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  const cardinal: [string, number][] = [
    ["N", 0],
    ["E", 90],
    ["S", 180],
    ["W", 270],
  ];
  // Accumulate the rotation so crossing north (359° -> 1°) animates 2°, not a full spin.
  const rotation = useRef(-heading);
  const last = useRef(heading);
  rotation.current -= angleDiff(last.current, heading);
  last.current = heading;
  return (
    <div className="relative aspect-square w-full max-w-[300px]">
      {/* Fixed pointer: the direction the top of the phone faces. */}
      <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1">
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden>
          <path d="M10 14 L0 0 H20 Z" className={aligned ? "fill-emerald" : "fill-gold"} />
        </svg>
      </div>
      <svg
        viewBox="0 0 300 300"
        className="h-full w-full transition-transform duration-150 ease-out"
        style={{ transform: `rotate(${rotation.current}deg)` }}
        role="img"
        aria-hidden
      >
        <circle
          cx="150"
          cy="150"
          r="140"
          className={`fill-surface ${aligned ? "stroke-emerald" : "stroke-line"}`}
          strokeWidth={aligned ? 3 : 1.5}
        />
        {ticks.map((d) => {
          const major = d % 30 === 0;
          return (
            <line
              key={d}
              x1="150"
              y1="14"
              x2="150"
              y2={major ? 28 : 21}
              transform={`rotate(${d} 150 150)`}
              className={major ? "stroke-fg/50" : "stroke-fg/20"}
              strokeWidth={major ? 1.5 : 1}
            />
          );
        })}
        {cardinal.map(([label, d]) => (
          <text
            key={label}
            x="150"
            y="48"
            transform={`rotate(${d} 150 150)`}
            textAnchor="middle"
            className={label === "N" ? "fill-gold" : "fill-muted"}
            style={{ fontSize: 15, fontWeight: 600 }}
          >
            {label}
          </text>
        ))}
        {bearing !== null && (
          <g transform={`rotate(${bearing} 150 150)`}>
            <line x1="150" y1="150" x2="150" y2="70" className={aligned ? "stroke-emerald" : "stroke-gold"} strokeWidth="3" strokeLinecap="round" />
            {/* Kaaba */}
            <g transform="translate(150 58)">
              <rect x="-11" y="-11" width="22" height="22" rx="2" className="fill-fg" />
              <rect x="-11" y="-5" width="22" height="3.5" className="fill-gold" />
            </g>
          </g>
        )}
        <circle cx="150" cy="150" r="6" className="fill-gold" />
      </svg>
    </div>
  );
}
