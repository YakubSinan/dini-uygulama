export interface Reciter {
  id: string;
  name: string;
  arabic: string;
  /** EveryAyah folder; files are named SSSAAA.mp3 */
  everyAyah: string;
  /** Islamic Network CDN fallback: [bitrate, edition]; files are named by global ayah number */
  islamicNetwork?: [number, string];
}

/** Imams of Masjid al-Haram, Makkah. All stream URLs verified to respond. */
export const RECITERS: Reciter[] = [
  {
    id: "sudais",
    name: "Abdul Rahman Al-Sudais",
    arabic: "عبد الرحمن السديس",
    everyAyah: "Abdurrahmaan_As-Sudais_192kbps",
    islamicNetwork: [192, "ar.abdurrahmaansudais"],
  },
  {
    id: "shuraim",
    name: "Saud Al-Shuraim",
    arabic: "سعود الشريم",
    everyAyah: "Saood_ash-Shuraym_128kbps",
    islamicNetwork: [64, "ar.saoodshuraym"],
  },
  {
    id: "maher",
    name: "Maher Al-Muaiqly",
    arabic: "ماهر المعيقلي",
    everyAyah: "MaherAlMuaiqly128kbps",
    islamicNetwork: [128, "ar.mahermuaiqly"],
  },
  {
    id: "dosari",
    name: "Yasser Al-Dosari",
    arabic: "ياسر الدوسري",
    everyAyah: "Yasser_Ad-Dussary_128kbps",
  },
  {
    id: "juhany",
    name: "Abdullah Awad Al-Juhany",
    arabic: "عبد الله عواد الجهني",
    everyAyah: "Abdullaah_3awwaad_Al-Juhaynee_128kbps",
  },
];

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

const pad3 = (n: number) => String(n).padStart(3, "0");

export function audioUrls(reciter: Reciter, surah: number, ayah: number, globalNumber: number): string[] {
  const urls = [`https://everyayah.com/data/${reciter.everyAyah}/${pad3(surah)}${pad3(ayah)}.mp3`];
  if (reciter.islamicNetwork) {
    const [bitrate, edition] = reciter.islamicNetwork;
    urls.push(`https://cdn.islamic.network/quran/audio/${bitrate}/${edition}/${globalNumber}.mp3`);
  }
  return urls;
}
