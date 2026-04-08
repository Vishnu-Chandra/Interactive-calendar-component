"use client";

import { useCallback } from "react";
import { WEEKDAYS } from "../calendar.constants";
import { useCalendar } from "../hooks/useCalendar";
import CalendarGrid from "./CalendarGrid";
import HeroSection from "./HeroSection";
import NotesPanel from "./NotesPanel";

export default function Calendar() {
  const {
    activeTheme,
    activeYear,
    holidayMarkers,
    monthCells,
    monthKey,
    monthLabel,
    monthNote,
    rangeEnd,
    rangeStart,
    selectionNote,
    todayDay,
    clearSelection,
    handleMonthNoteChange,
    handleNextMonth,
    handlePreviousMonth,
    handleSelectDay,
    handleSelectionNoteChange,
  } = useCalendar();

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      if (
        target.closest('[data-day-cell="true"]') ||
        target.closest('[data-notes-panel="true"]') ||
        target.closest("textarea, input, select, option, button")
      ) {
        return;
      }

      if (rangeStart !== null || rangeEnd !== null) {
        clearSelection();
      }
    },
    [clearSelection, rangeEnd, rangeStart],
  );

  return (
    <section
      className="grid min-h-dvh place-items-center px-2 py-2 sm:px-3 sm:py-3"
      style={{ background: activeTheme.sceneGradient }}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-[66rem] pt-8">
        <div
          className="absolute left-1/2 top-0 z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-400 shadow-[0_6px_12px_rgba(0,0,0,0.22)] ring-2 ring-white/35 transition-transform duration-300 hover:scale-110"
          aria-hidden="true"
        />
        <div
          className="absolute left-1/2 top-3 z-10 h-8 w-px -translate-x-1/2 bg-gray-400/80 transition-opacity duration-300"
          aria-hidden="true"
        />
        <article
          className="relative overflow-hidden rounded-[0.5rem] shadow-[0_24px_50px_rgba(0,0,0,0.16),0_2px_0_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-1 before:bg-gradient-to-b before:from-black/10 before:to-transparent sm:rounded-[0.6rem]"
          style={{
            animation: "card-rise-in 450ms cubic-bezier(0.22, 1, 0.36, 1) both",
            backgroundImage: `linear-gradient(to bottom, ${activeTheme.cardFrom}, ${activeTheme.cardTo})`,
          }}
        >
          <div className="grid grid-cols-1">
            <HeroSection
              monthLabel={monthLabel}
              year={activeYear}
              imageUrl={activeTheme.imageUrl}
              themeName={activeTheme.name}
              ribbonFrom={activeTheme.ribbonFrom}
              ribbonTo={activeTheme.ribbonTo}
            />

            <div className="grid grid-cols-1 gap-3 border-t border-t-[#e6ebf2] px-2.5 pb-2.5 pt-2.5 sm:px-3 sm:pb-3 sm:pt-3 md:grid-cols-[12rem_1fr] md:gap-3.5 lg:grid-cols-[13rem_1fr]">
              <div className="order-2 md:order-1">
                <NotesPanel
                  monthLabel={monthLabel}
                  year={activeYear}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  monthNote={monthNote}
                  selectionNote={selectionNote}
                  onMonthNoteChange={handleMonthNoteChange}
                  onSelectionNoteChange={handleSelectionNoteChange}
                  onClearSelection={clearSelection}
                />
              </div>

              <div className="order-1 md:order-2">
                <CalendarGrid
                  weekdays={WEEKDAYS}
                  days={monthCells}
                  monthLabel={monthLabel}
                  year={activeYear}
                  rangeStart={rangeStart}
                  rangeEnd={rangeEnd}
                  todayDay={todayDay}
                  holidayMarkers={holidayMarkers}
                  animationKey={monthKey}
                  themeAccent={activeTheme.accent}
                  onPreviousMonth={handlePreviousMonth}
                  onNextMonth={handleNextMonth}
                  onSelectDay={handleSelectDay}
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}