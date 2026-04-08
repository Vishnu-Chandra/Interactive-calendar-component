type DayCellProps = {
  day: number | null;
  dayIndex: number;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  isPendingRange: boolean;
  isWeekend: boolean;
  isToday: boolean;
  holidayLabel: string | null;
  motionIndex: number;
  onSelectDay: (day: number) => void;
};

export default function DayCell({
  day,
  dayIndex,
  isStart,
  isEnd,
  isInRange,
  isPendingRange,
  isWeekend,
  isToday,
  holidayLabel,
  motionIndex,
  onSelectDay,
}: DayCellProps) {
  if (day === null) {
    return <div className="flex h-10 w-full items-center justify-center sm:h-10" aria-hidden="true" />;
  }

  const hasRangeState = isStart || isEnd || isPendingRange || isInRange;
  const stateClass = hasRangeState
    ? isStart && isEnd
      ? "bg-blue-800 text-white font-bold rounded-full hover:bg-blue-800"
      : isStart
        ? "bg-blue-800 text-white font-bold rounded-l-full hover:bg-blue-800"
        : isEnd
          ? "bg-blue-800 text-white font-bold rounded-r-full hover:bg-blue-800"
          : isPendingRange
            ? "bg-blue-800 text-white font-semibold rounded-full hover:bg-blue-800"
            : "bg-sky-200 text-sky-900 hover:bg-sky-200"
    : "";

  const baseAppearanceClass = hasRangeState
    ? ""
    : isWeekend
      ? "bg-transparent text-blue-600 hover:bg-blue-100"
      : "bg-transparent text-[#1f2433] hover:bg-blue-100";

  const rangeShapeClass = isStart && !isEnd
    ? "rounded-l-full"
    : isEnd && !isStart
      ? "rounded-r-full"
      : isInRange
        ? "rounded-none"
        : isStart && isEnd
          ? "rounded-full"
          : "";

  const dayBadgeClass = hasRangeState
    ? ""
    : holidayLabel
      ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-700 ring-1 ring-rose-300"
      : isToday
        ? "inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-2 ring-blue-500"
        : "inline-flex h-8 w-8 items-center justify-center rounded-full";

  return (
    <button
      type="button"
      role="gridcell"
      data-day-cell="true"
      data-day-index={dayIndex}
      className={`relative flex h-10 w-full items-center justify-center border-0 text-[0.74rem] leading-none transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[#7cbdf0] sm:h-10 sm:text-[0.78rem] ${baseAppearanceClass} ${stateClass} ${rangeShapeClass}`}
      style={{
        animation: "day-pop-in 260ms ease both",
        animationDelay: `${Math.min(motionIndex, 20) * 16}ms`,
      }}
      onClick={() => onSelectDay(day)}
      title={holidayLabel ?? undefined}
      aria-selected={hasRangeState}
      aria-label={
        holidayLabel
          ? `Day ${day}, holiday: ${holidayLabel}`
          : isStart && isEnd
            ? `Day ${day}, start and end of selected range`
            : isStart
              ? `Day ${day}, start date`
              : isEnd
                ? `Day ${day}, end date`
                : isInRange
                  ? `Day ${day}, in selected range`
                  : `Select day ${day}`
      }
    >
      <span className={dayBadgeClass}>{day}</span>
      {holidayLabel ? (
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-white" aria-hidden="true" />
      ) : null}
    </button>
  );
}
