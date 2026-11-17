"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, Compass, House, ListChecks, type LucideIcon } from "lucide-react";
import { useT } from "@/lib/settings";
import type { DictKey } from "@/lib/i18n";

const TABS: { href: string; label: DictKey; icon: LucideIcon }[] = [
  { href: "/", label: "navHome", icon: House },
  { href: "/quran", label: "navQuran", icon: BookOpen },
  { href: "/tracker", label: "navTracker", icon: ListChecks },
  { href: "/calendar", label: "navCalendar", icon: CalendarDays },
  { href: "/qibla", label: "navQibla", icon: Compass },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line/70 bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-xl grid-cols-5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                active ? "text-gold" : "text-muted hover:text-fg"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={active ? 1.75 : 1.5} />
              <span>{t(label)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
