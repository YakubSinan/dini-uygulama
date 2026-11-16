"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/Card";
import { useT } from "@/lib/settings";
import { KazaTracker } from "./KazaTracker";
import { MemorizationList } from "./MemorizationList";

export function TrackerView() {
  const { t } = useT();
  const [tab, setTab] = useState<"kaza" | "hifz">("kaza");
  return (
    <div className="space-y-4 pt-3">
      <h1 className="px-1 font-serif text-[1.7rem] font-bold">{t("trackerTitle")}</h1>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: "kaza", label: t("kazaTitle") },
          { value: "hifz", label: t("memorizeTitle") },
        ]}
      />
      {tab === "kaza" ? <KazaTracker /> : <MemorizationList />}
    </div>
  );
}
