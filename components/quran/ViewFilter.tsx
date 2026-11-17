"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Eye } from "lucide-react";
import { VIEW_LAYERS, useT, useViewLayers, type ViewLayer } from "@/lib/settings";
import type { DictKey } from "@/lib/i18n";

const LABELS: Record<ViewLayer, DictKey> = {
  arabic: "layerArabic",
  translit: "layerTranslit",
  translation: "layerTranslation",
};

/** Checkbox rows for the three text layers, each with a one-tap "only this" shortcut. */
export function ViewLayerOptions() {
  const { t } = useT();
  const { layers, toggle, only, all } = useViewLayers();
  const allOn = VIEW_LAYERS.every((l) => layers[l]);

  return (
    <div>
      <ul className="space-y-1.5">
        {VIEW_LAYERS.map((layer) => {
          const on = layers[layer];
          const isOnly = on && VIEW_LAYERS.every((l) => l === layer || !layers[l]);
          return (
            <li key={layer} className="flex items-center gap-2">
              <button
                onClick={() => toggle(layer)}
                role="checkbox"
                aria-checked={on}
                className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-[15px] transition-colors ${
                  on ? "border-gold bg-gold-soft" : "border-line hover:bg-surface-2/60"
                }`}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    on ? "border-gold bg-gold text-white dark:text-[#0F171A]" : "border-line"
                  }`}
                >
                  {on && <Check size={14} strokeWidth={2.5} />}
                </span>
                <span className="truncate">{t(LABELS[layer])}</span>
              </button>
              <button
                onClick={() => only(layer)}
                disabled={isOnly}
                className="shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40"
                aria-label={`${t(LABELS[layer])} ${t("layerOnly")}`}
              >
                {t("layerOnly")}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2.5 flex items-center justify-between gap-2 px-1">
        <span className="text-xs text-muted">{t("viewFilterHint")}</span>
        <button
          onClick={all}
          disabled={allOn}
          className="shrink-0 text-xs font-semibold text-gold disabled:opacity-40"
        >
          {t("layerAll")}
        </button>
      </div>
    </div>
  );
}

/** Toolbar button with a dropdown to choose which text layers the reader shows. */
export function ViewFilter({ className }: { className: string }) {
  const { t } = useT();
  const { layers } = useViewLayers();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const filtered = !VIEW_LAYERS.every((l) => layers[l]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`${className} relative ${open || filtered ? "text-gold" : ""}`}
        aria-label={t("viewFilter")}
        aria-expanded={open}
        aria-haspopup="true"
        title={t("viewFilter")}
      >
        <Eye size={18} strokeWidth={1.75} />
        {filtered && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gold" />}
      </button>
      {open && (
        <div className="animate-fade absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-line bg-surface p-3 shadow-xl">
          <div className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
            {t("viewFilter")}
          </div>
          <ViewLayerOptions />
        </div>
      )}
    </div>
  );
}
