"use client";

import { useState } from "react";
import { Check, Layers, Minus, Pencil, Plus, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/Card";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { useStored } from "@/lib/storage";
import { useT } from "@/lib/settings";
import { LOCALE, type DictKey } from "@/lib/i18n";
import { formatPercent } from "@/lib/format";

export const KAZA_PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const;
type KazaKey = (typeof KAZA_PRAYERS)[number];

const LABELS: Record<KazaKey, DictKey> = {
  fajr: "fajrPrayer",
  dhuhr: "dhuhr",
  asr: "asr",
  maghrib: "maghrib",
  isha: "isha",
  witr: "witr",
};

/** owed: total ever recorded as missed; done: total made up. Remaining = owed - done. */
type Entry = { owed: number; done: number };
type KazaState = Record<KazaKey, Entry>;

const EMPTY: KazaState = {
  fajr: { owed: 0, done: 0 },
  dhuhr: { owed: 0, done: 0 },
  asr: { owed: 0, done: 0 },
  maghrib: { owed: 0, done: 0 },
  isha: { owed: 0, done: 0 },
  witr: { owed: 0, done: 0 },
};

export function KazaTracker() {
  const { t, lang } = useT();
  const [state, setState] = useStored<KazaState>("kaza", EMPTY);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editKey, setEditKey] = useState<KazaKey | null>(null);
  const nf = new Intl.NumberFormat(LOCALE[lang]);

  const update = (key: KazaKey, fn: (e: Entry) => Entry) =>
    setState((prev) => ({ ...EMPTY, ...prev, [key]: fn(prev[key] ?? { owed: 0, done: 0 }) }));

  const totals = KAZA_PRAYERS.reduce(
    (acc, k) => ({ owed: acc.owed + (state[k]?.owed ?? 0), done: acc.done + (state[k]?.done ?? 0) }),
    { owed: 0, done: 0 },
  );
  const remaining = totals.owed - totals.done;
  const pct = totals.owed ? Math.round((totals.done / totals.owed) * 100) : 0;

  return (
    <Card>
      <CardTitle
        icon={Layers}
        action={
          <button
            onClick={() => window.confirm(t("resetConfirm")) && setState(EMPTY)}
            className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-2 hover:text-fg"
            aria-label={t("reset")}
            title={t("reset")}
          >
            <RotateCcw size={15} strokeWidth={1.75} />
          </button>
        }
      >
        {t("kazaTitle")}
      </CardTitle>

      {/* Overall progress */}
      <div className="rounded-2xl bg-surface-2 p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted">{t("remaining")}</div>
            <div className="text-3xl font-semibold tabular-nums">{nf.format(remaining)}</div>
          </div>
          <div className="text-right text-sm">
            <div className="text-emerald">
              {t("completed")}: <span className="font-semibold tabular-nums">{nf.format(totals.done)}</span>
            </div>
            <div className="text-muted">
              {t("total")}: <span className="tabular-nums">{nf.format(totals.owed)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-emerald transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1.5 text-right text-xs text-muted tabular-nums">
          {t("progress")} {formatPercent(pct, lang)}
        </div>
      </div>

      {totals.owed === 0 && <p className="mt-4 text-sm leading-relaxed text-muted">{t("kazaEmpty")}</p>}

      <ul className="mt-4 space-y-2">
        {KAZA_PRAYERS.map((key) => {
          const e = state[key] ?? { owed: 0, done: 0 };
          const left = e.owed - e.done;
          const p = e.owed ? (e.done / e.owed) * 100 : 0;
          return (
            <li key={key} className="rounded-2xl border border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <button
                    onClick={() => setEditKey(key)}
                    className="flex items-center gap-1.5 font-medium hover:text-gold"
                    aria-label={`${t(LABELS[key])} – ${t("edit")}`}
                  >
                    {t(LABELS[key])}
                    <Pencil size={12} strokeWidth={1.75} className="text-muted" />
                  </button>

                </div>
                <button
                  onClick={() => update(key, (x) => ({ ...x, owed: x.owed + 1 }))}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:text-fg active:scale-95"
                  aria-label={`${t(LABELS[key])}: ${t("addMissed")} (+1)`}
                  title={`${t("addMissed")} (+1)`}
                >
                  <Plus size={18} strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => update(key, (x) => (x.done < x.owed ? { ...x, done: x.done + 1 } : x))}
                  disabled={left <= 0}
                  className="flex h-10 items-center gap-1.5 rounded-full bg-emerald px-3.5 text-sm font-medium text-white transition-transform active:scale-95 disabled:opacity-30 dark:text-[#0F171A]"
                  aria-label={`${t(LABELS[key])}: ${t("markPrayed")} (-1)`}
                >
                  <Minus size={16} strokeWidth={2} />
                  {t("markPrayed")}
                </button>
              </div>
                  <div className="mt-2 text-xs text-muted tabular-nums">
                    {t("remaining")} <span className="font-semibold text-fg">{nf.format(left)}</span>
                    <span className="mx-1.5">·</span>
                    {t("completed")} {nf.format(e.done)}
                  </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${p}%` }} />
              </div>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() => setBulkOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/60 py-3 text-sm font-medium text-gold hover:bg-gold-soft"
      >
        <Plus size={16} strokeWidth={1.75} /> {t("bulkAdd")}
      </button>

      <BulkAddSheet
        open={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onApply={(keys, amount) =>
          setState((prev) => {
            const next = { ...EMPTY, ...prev };
            keys.forEach((k) => (next[k] = { ...next[k], owed: next[k].owed + amount }));
            return next;
          })
        }
      />
      <EditSheet
        prayer={editKey}
        entry={editKey ? state[editKey] ?? { owed: 0, done: 0 } : null}
        onClose={() => setEditKey(null)}
        onSave={(remainingCount) =>
          editKey && update(editKey, (x) => ({ ...x, owed: x.done + Math.max(0, remainingCount) }))
        }
      />
    </Card>
  );
}

type Unit = "days" | "months" | "years";
const UNIT_DAYS: Record<Unit, number> = { days: 1, months: 30, years: 365 };

function BulkAddSheet({
  open,
  onClose,
  onApply,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (keys: KazaKey[], amount: number) => void;
}) {
  const { t } = useT();
  const [target, setTarget] = useState<"all" | KazaKey>("all");
  const [count, setCount] = useState("1");
  const [unit, setUnit] = useState<Unit>("years");
  const keys = target === "all" ? [...KAZA_PRAYERS] : [target];

  const apply = (amount: number) => {
    if (amount > 0) onApply(keys, amount);
    onClose();
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      active ? "border-gold bg-gold-soft text-fg" : "border-line text-muted hover:text-fg"
    }`;

  return (
    <BottomSheet open={open} onClose={onClose} title={t("bulkAdd")}>
      <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t("applyTo")}</div>
      <div className="flex flex-wrap gap-2">
        <button className={chip(target === "all")} onClick={() => setTarget("all")}>
          {t("allPrayers")}
        </button>
        {KAZA_PRAYERS.map((k) => (
          <button key={k} className={chip(target === k)} onClick={() => setTarget(k)}>
            {t(LABELS[k])}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => apply(30)}
          className="rounded-2xl border border-line py-3 font-semibold hover:bg-surface-2"
        >
          {t("addOneMonth")}
        </button>
        <button onClick={() => apply(365)} className="rounded-2xl bg-gold py-3 font-semibold text-white dark:text-[#0F171A]">
          {t("addOneYear")}
        </button>
      </div>

      <div className="mt-6 mb-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{t("customAmount")}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply(Math.max(0, Math.floor(Number(count) || 0)) * UNIT_DAYS[unit]);
        }}
        className="flex gap-2"
      >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-24 rounded-xl border border-line bg-bg px-3 py-2.5 text-[15px] outline-none focus:border-gold"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value as Unit)}
          className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-3 py-2.5 text-[15px] outline-none focus:border-gold"
        >
          <option value="days">{t("unitDays")}</option>
          <option value="months">{t("unitMonths")}</option>
          <option value="years">{t("unitYears")}</option>
        </select>
        <button type="submit" className="flex items-center gap-1 rounded-xl bg-emerald px-4 font-medium text-white dark:text-[#0F171A]">
          <Check size={16} strokeWidth={2} /> {t("apply")}
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-muted">{t("bulkHint")}</p>
    </BottomSheet>
  );
}

function EditSheet({
  prayer,
  entry,
  onClose,
  onSave,
}: {
  prayer: KazaKey | null;
  entry: Entry | null;
  onClose: () => void;
  onSave: (remaining: number) => void;
}) {
  const { t } = useT();
  const [value, setValue] = useState("");
  const current = entry ? entry.owed - entry.done : 0;

  return (
    <BottomSheet open={prayer !== null} onClose={onClose} title={prayer ? `${t(LABELS[prayer])} · ${t("setRemaining")}` : ""}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const n = Math.floor(Number(value));
          if (value !== "" && Number.isFinite(n)) onSave(n);
          setValue("");
          onClose();
        }}
        className="flex gap-2"
      >
        <input
          type="number"
          inputMode="numeric"
          min={0}
          autoFocus
          placeholder={String(current)}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-line bg-bg px-4 py-3 text-[15px] outline-none focus:border-gold"
        />
        <button type="submit" className="rounded-xl bg-gold px-5 font-semibold text-white dark:text-[#0F171A]">
          {t("save")}
        </button>
      </form>
    </BottomSheet>
  );
}
