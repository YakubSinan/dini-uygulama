/** Coordinates of the Kaaba, Masjid al-Haram, Makkah. */
export const KAABA = { lat: 21.422487, lon: 39.826206 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/** Initial great-circle bearing from a point to the Kaaba, in degrees clockwise from true north. */
export function qiblaBearing(lat: number, lon: number): number {
  const φ1 = rad(lat);
  const φ2 = rad(KAABA.lat);
  const Δλ = rad(KAABA.lon - lon);
  const y = Math.sin(Δλ);
  const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Great-circle distance to the Kaaba in kilometres (haversine). */
export function distanceToKaaba(lat: number, lon: number): number {
  const dφ = rad(KAABA.lat - lat);
  const dλ = rad(KAABA.lon - lon);
  const a = Math.sin(dφ / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dλ / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Signed smallest angle from `from` to `to`, in (-180, 180]. Positive means turn clockwise. */
export function angleDiff(from: number, to: number): number {
  const d = (((to - from) % 360) + 540) % 360 - 180;
  return d === -180 ? 180 : d;
}
