import { useCallback } from "react";
import DayCell from "./DayCell";

type CalendarGridProps = {
  monthLabel: string;
  year: number;
  weekdays: string[];
  days: Array<number | null>;
  rangeStart: number | null;
  rangeEnd: number | null;
  todayDay: number | null;
  holidayMarkers: Record<number, string>;
  animationKey: string;
  themeAccent: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
};

export default function CalendarGrid({
  monthLabel,
  year,
  weekdays,
  days,
  rangeStart,
  rangeEnd,
  todayDay,
  holidayMarkers,
  animationKey,
  themeAccent,
  onPreviousMonth,
  onNextMonth,
  onSelectDay,
}: CalendarGridProps) {
  const selectionText =
    rangeStart === null
      ? "Tap a day to set the start"
      : rangeEnd === null
        ? `${monthLabel} ${rangeStart} selected as start date`
        : `${monthLabel} ${rangeStart} - ${monthLabel} ${rangeEnd}`;

  const handleGridKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.getAttribute("data-day-cell") !== "true") {
      return;
    }

    const key = event.key;
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(key)) {
      return;
    }

    const dayButtons = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-day-cell="true"]'),
    );
    const currentIndex = dayButtons.indexOf(target as HTMLButtonElement);
    if (currentIndex < 0) {
      return;
    }

    event.preventDefault();

    let nextIndex = currentIndex;
    if (key === "ArrowLeft") nextIndex -= 1;
    if (key === "ArrowRight") nextIndex += 1;
    if (key === "ArrowUp") nextIndex -= 7;
    if (key === "ArrowDown") nextIndex += 7;
    if (key === "Home") nextIndex = currentIndex - (currentIndex % 7);
    if (key === "End") nextIndex = currentIndex + (6 - (currentIndex % 7));

    nextIndex = Math.max(0, Math.min(dayButtons.length - 1, nextIndex));
    dayButtons[nextIndex]?.focus();
  }, []);

  return (
    <section
      key={animationKey}
      className="w-full"
      style={{ animation: "month-fade-in 260ms ease" }}
      aria-label="Month calendar"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPreviousMonth}
          className="rounded-md px-2 py-0.5 text-lg transition hover:bg-blue-100 active:scale-95"
          style={{ color: themeAccent }}
          aria-label="Go to previous month"
        >
          ←
        </button>
        <h2 className="text-[0.85rem] font-semibold text-[#1f2c3d] sm:text-[0.95rem]">
          {monthLabel} {year}
        </h2>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded-md px-2 py-0.5 text-lg transition hover:bg-blue-100 active:scale-95"
          style={{ color: themeAccent }}
          aria-label="Go to next month"
        >
          →
        </button>
      </div>

      <p className="mb-0.5 text-[0.62rem] font-semibold text-[#3f4a5e] max-[480px]:text-[0.69rem]" aria-live="polite">
        {selectionText}
      </p>

      <div className="mb-1 grid grid-cols-7 text-center" role="row">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className="flex h-8 w-full items-center justify-center text-xs font-semibold tracking-wide text-gray-600"
            role="columnheader"
          >
            <span className={index > 4 ? "text-sky-600" : undefined}>{day}</span>
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 text-center"
        role="grid"
        aria-label="Month days"
        onKeyDown={handleGridKeyDown}
      >
        {days.map((day, index) => {
          const weekdayIndex = index % 7;

          return (
            <DayCell
              key={`${day ?? "empty"}-${index}`}
              day={day}
              dayIndex={index}
              isStart={day !== null && rangeStart !== null && day === rangeStart}
              isEnd={day !== null && rangeEnd !== null && day === rangeEnd}
              isInRange={
                day !== null &&
                rangeStart !== null &&
                rangeEnd !== null &&
                day > rangeStart &&
                day < rangeEnd
              }
              isPendingRange={day !== null && rangeStart !== null && rangeEnd === null && day === rangeStart}
              isWeekend={weekdayIndex > 4}
              isToday={day !== null && day === todayDay}
              holidayLabel={day === null ? null : holidayMarkers[day] ?? null}
              motionIndex={index}
              onSelectDay={onSelectDay}
            />
          );
        })}
      </div>
    </section>
  );
}
