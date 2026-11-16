import { Suspense } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarView />
    </Suspense>
  );
}
