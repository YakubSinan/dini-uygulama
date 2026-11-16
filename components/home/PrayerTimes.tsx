"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Clock,
  CloudSun,
  LoaderCircle,
  LocateFixed,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  WifiOff,
  type LucideIcon,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useCalcMethod, useLocation, useT, type PrayerLocation } from "@/lib/settings";
import {
  CALC_METHODS,
  PRAYER_KEYS,
  fetchTimings,
  formatCountdown,
  prayerStatus,
  type DayTimings,
  type PrayerKey,
} from "@/lib/prayer";
import { useNow } from "@/lib/useNow";

const ICONS: Record<PrayerKey, LucideIcon> = {
  fajr: Moon,
  sunrise: Sunrise,
  dhuhr: Sun,
  asr: CloudSun,
  maghrib: Sunset,
  isha: Moon,
};

function locationLabel(loc: PrayerLocation, fallback: string) {
  if (loc.kind === "city") return `${loc.city}, ${loc.country}`;
  return loc.label ?? `${fallback} (${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)})`;
}

export function PrayerTimes() {
  const { t } = useT();
  const [location] = useLocation();
  const [method] = useCalcMethod();
  const now = useNow(1000);
  const [timings, setTimings] = useState<DayTimings | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [fromCache, setFromCache] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const dayStamp = now ? now.toDateString() : "";
  const locKey = JSON.stringify(location);

  const load = useCallback(async () => {
    setState("loading");
    try {
      const res = await fetchTimings(JSON.parse(locKey) as PrayerLocation, method);
      setTimings(res.timings);
      setFromCache(res.fromCache);
      setState("ok");
    } catch {
      setState("error");
    }
  }, [locKey, method]);

  useEffect(() => {
    if (dayStamp) load();
  }, [load, dayStamp]);

  const status = timings && now ? prayerStatus(timings, now) : null;

  return (
    <Card>
      <CardTitle
        icon={Clock}
        action={
          <button
            onClick={() => setSheetOpen(true)}
            className="flex max-w-[60%] items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors hover:text-fg"
          >
            <MapPin size={13} strokeWidth={1.75} className="shrink-0" />
            <span className="truncate">{locationLabel(location, t("currentLocation"))}</span>
          </button>
        }
      >
        {t("prayerTimes")}
      </CardTitle>

      {status && timings ? (
        <>
          <div className="mb-4 rounded-2xl bg-emerald-soft px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wider text-emerald">
              {t("nextPrayer")}: {t(status.next)}
            </div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
                {formatCountdown(status.remaining)}
              </span>
              <span className="text-sm text-muted">{t("timeLeft")}</span>
            </div>
          </div>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {PRAYER_KEYS.map((key) => {
              const Icon = ICONS[key];
              const active = status.current === key;
              const isNext = status.next === key;
              return (
                <li
                  key={key}
                  className={`flex flex-col items-center rounded-2xl border px-2 py-3 transition-colors ${
                    active
                      ? "border-gold bg-gold-soft"
                      : isNext
                        ? "border-emerald/30"
                        : "border-line"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  <Icon size={18} strokeWidth={1.5} className={active ? "text-gold" : "text-muted"} />
                  <span className={`mt-1.5 text-xs ${active ? "font-semibold text-gold" : "text-muted"}`}>{t(key)}</span>
                  <span className="mt-0.5 text-base font-semibold tabular-nums">{timings.times[key]}</span>
                </li>
              );
            })}
          </ul>
          {fromCache && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
              <WifiOff size={13} strokeWidth={1.75} /> {t("offline")}
            </p>
          )}
        </>
      ) : state === "error" ? (
        <div className="py-6 text-center text-sm text-muted">
          <p>{t("loadError")}</p>
          <button onClick={load} className="mt-3 rounded-full border border-line px-4 py-1.5 text-fg">
            {t("retry")}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
          <LoaderCircle size={18} strokeWidth={1.75} className="animate-spin" /> {t("loading")}
        </div>
      )}

      <LocationSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Card>
  );
}

function LocationSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useT();
  const [location, setLocation] = useLocation();
  const [method, setMethod] = useCalcMethod();
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [geoState, setGeoState] = useState<"idle" | "busy" | "denied">("idle");

  useEffect(() => {
    if (open && location.kind === "city") {
      setCity(location.city);
      setCountry(location.country);
    }
  }, [open, location]);

  const useGeo = () => {
    if (!navigator.geolocation) return setGeoState("denied");
    setGeoState("busy");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ kind: "coords", lat: pos.coords.latitude, lon: pos.coords.longitude });
        setGeoState("idle");
        onClose();
      },
      () => setGeoState("denied"),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 600000 },
    );
  };

  const saveCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLocation({ kind: "city", city: city.trim(), country: country.trim() });
    onClose();
  };

  const input =
    "w-full rounded-xl border border-line bg-bg px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-gold";

  return (
    <BottomSheet open={open} onClose={onClose} title={t("changeLocation")}>
      <button
        onClick={useGeo}
        disabled={geoState === "busy"}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald px-4 py-3 font-medium text-white transition-opacity disabled:opacity-60 dark:text-[#0F171A]"
      >
        {geoState === "busy" ? (
          <LoaderCircle size={18} strokeWidth={1.75} className="animate-spin" />
        ) : (
          <LocateFixed size={18} strokeWidth={1.75} />
        )}
        {geoState === "busy" ? t("locating") : t("useMyLocation")}
      </button>
      {geoState === "denied" && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{t("geoDenied")}</p>}

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-line" />
        {t("orSearchCity")}
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={saveCity} className="space-y-3">
        <input className={input} placeholder={t("city")} value={city} onChange={(e) => setCity(e.target.value)} />
        <input
          className={input}
          placeholder={t("country")}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="submit" className="w-full rounded-2xl border border-line px-4 py-3 font-medium hover:bg-surface-2">
          {t("save")}
        </button>
      </form>

      <label className="mt-6 block text-sm font-medium text-muted">
        {t("calcMethod")}
        <select
          value={method}
          onChange={(e) => setMethod(Number(e.target.value))}
          className={`${input} mt-2 text-fg`}
        >
          {CALC_METHODS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </label>
    </BottomSheet>
  );
}
