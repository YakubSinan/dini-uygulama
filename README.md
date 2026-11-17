# Rıhlemedar – Daily Worship and Quran (PWA)

A mobile-first Progressive Web App built with Next.js 15 (App Router), TypeScript and Tailwind CSS 4. It is available in Turkish, German and English.

## Features
- **Home:** a daily hadith (18 authentic hadiths, each with commentary and a practical takeaway in all three languages). Prayer times from the Aladhan API, with geolocation or manual city entry and a choice of calculation method; the current prayer is highlighted, with a live countdown to the next one. A widget shows the next holy day.
- **Quran:** search by name (Arabic, Latin, TR, DE, EN), by surah number, by page (1–604) or by juz. A last-read bookmark. Uthmani script in the KFGQPC Uthmanic Hafs (Madani mushaf) typeface at an adjustable size. A view filter shows any combination of Arabic, transliteration and translation, and Diyanet, Bubenheim and Sahih International translations, one at a time or together. An audio player for five Imams of Masjid al-Haram that plays a whole surah gaplessly (ayahs are decoded ahead and scheduled back to back with the Web Audio API), scrolls to the current ayah automatically, and works with lock-screen controls.
- **Tracker:** a missed-prayer (qada) counter for 6 prayers, with +1/-1, bulk add and progress bars. A checklist of memorized surahs (114) with a short-surahs filter and percentages.
- **Qibla:** a Qibla finder with a live compass (device orientation sensor), the great-circle bearing and distance to the Kaaba, from GPS or the saved prayer-times location.
- **Calendar:** a monthly grid showing Gregorian and Hijri (Umm al-Qura) dates. Events are marked with dots, and tapping one opens a bottom sheet explaining its meaning, history and the recommended worship. You can adjust the Hijri date by up to ±2 days.

## Offline
- All progress is saved in `localStorage` (keys prefixed with `nur:`; the prefix is kept from the app's earlier name so saved data survives the rename).
- Each API response is stored in Cache Storage (`lib/api.ts`), so any page you have opened once still works without a connection.
- `public/sw.js` caches the app shell and static assets. It is registered in production builds only.

## Scripts
```
npm run dev          # development server
npm run build        # production build (type-checked)
npm start            # serve the production build (needed to test the service worker / install)
npm run icons        # regenerate PNG icons from public/icons/*.svg
npm run check:emoji  # fail if any emoji exists in the source
```

## Installing on a phone
Install prompts require HTTPS. Deploy to an HTTPS host, for example Vercel's free tier, or use an HTTPS tunnel. Then:
- **iOS Safari:** Share > Add to Home Screen.
- **Android Chrome:** menu > Install app.
