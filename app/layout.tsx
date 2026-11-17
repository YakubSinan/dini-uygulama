import type { Metadata, Viewport } from "next";
import { Amiri, Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });
// KFGQPC Uthmanic Script HAFS: the Madani mushaf typeface of the King Fahd Quran Printing Complex.
const hafs = localFont({
  src: "./fonts/UthmanicHafs1Ver18.woff2",
  variable: "--font-hafs",
  display: "swap",
  fallback: ["Scheherazade New", "Traditional Arabic", "serif"],
});

export const metadata: Metadata = {
  title: "Rıhlemedar – Daily Worship and Quran",
  description: "Prayer times, daily hadith, Quran reader with Makkah imams, missed prayer tracker and Islamic calendar.",
  applicationName: "Rıhlemedar",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Rıhlemedar" },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0F171A" },
  ],
};

// Applies the saved theme and language before first paint to avoid a flash.
const bootScript = `(function(){try{var t=JSON.parse(localStorage.getItem('nur:theme')||'"system"');var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');var l=JSON.parse(localStorage.getItem('nur:lang')||'null');if(l)document.documentElement.lang=l;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${amiri.variable} ${hafs.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
