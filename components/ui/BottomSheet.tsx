"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useHydrated } from "@/lib/storage";
import { useT } from "@/lib/settings";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: Props) {
  const hydrated = useHydrated();
  const { t } = useT();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!hydrated || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <div className="animate-fade absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="animate-sheet pb-safe relative max-h-[88dvh] w-full max-w-xl overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl outline-none"
      >
        <div className="flex justify-center pt-2.5">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-3">
          <div className="min-w-0 flex-1 text-lg font-semibold leading-snug">{title}</div>
          <button
            onClick={onClose}
            aria-label={t("close")}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-2 text-muted hover:text-fg"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>
        <div className="max-h-[calc(88dvh-72px)] overflow-y-auto px-5 pb-8">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
