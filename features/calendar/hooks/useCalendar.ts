import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { INITIAL_DATE, MONTH_THEMES, STORAGE_KEY } from "../calendar.constants";
import type { NotesByMonth } from "../calendar.types";
import { getHolidayMarkers, getMonthGridDays, normalizeRange } from "../utils/date.utils";
import {
  findRangeContainingDay,
  findRangeNoteByBounds,
  getMonthNotes,
  upsertRangeNote,
} from "../utils/notes.utils";

export function useCalendar() {
  const [currentMonthDate, setCurrentMonthDate] = useState(INITIAL_DATE);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [notesByMonth, setNotesByMonth] = useState<NotesByMonth>(() => {
    if (typeof window === "undefined") {
      return {};
    }

    const storedNotes = localStorage.getItem(STORAGE_KEY);
    if (!storedNotes) {
      return {};
    }

    try {
      return JSON.parse(storedNotes) as NotesByMonth;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }
  });
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const activeYear = currentMonthDate.getFullYear();
  const activeMonthIndex = currentMonthDate.getMonth();
  const activeTheme = MONTH_THEMES[activeMonthIndex];
  const monthKey = `${activeYear}-${activeMonthIndex}`;

  const today = new Date();
  const todayDay =
    today.getFullYear() === activeYear && today.getMonth() === activeMonthIndex ? today.getDate() : null;

  const monthLabel = useMemo(
    () => currentMonthDate.toLocaleString("en-US", { month: "long" }),
    [currentMonthDate],
  );

  const monthCells = useMemo(
    () => getMonthGridDays(activeYear, activeMonthIndex),
    [activeYear, activeMonthIndex],
  );

  const holidayMarkers = useMemo(
    () => getHolidayMarkers(activeYear, activeMonthIndex),
    [activeYear, activeMonthIndex],
  );

  const activeMonthNotes = useMemo(() => {
    if (!isHydrated) {
      return { monthNote: "", rangeNotes: [] };
    }

    return getMonthNotes(notesByMonth, monthKey);
  }, [isHydrated, monthKey, notesByMonth]);

  const normalizedSelection = useMemo(
    () => normalizeRange(selectionStart, selectionEnd),
    [selectionEnd, selectionStart],
  );

  const selectedRangeNote = useMemo(
    () => {
      const exactMatch = findRangeNoteByBounds(
        activeMonthNotes.rangeNotes,
        normalizedSelection.start,
        normalizedSelection.end,
      );

      if (exactMatch) {
        return exactMatch;
      }

      if (normalizedSelection.start === null) {
        return null;
      }

      return findRangeContainingDay(activeMonthNotes.rangeNotes, normalizedSelection.start);
    },
    [activeMonthNotes.rangeNotes, normalizedSelection.end, normalizedSelection.start],
  );

  const activeSelectionNote = selectedRangeNote?.note ?? "";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesByMonth));
  }, [notesByMonth]);

  const clearSelection = useCallback(() => {
    setSelectionStart(null);
    setSelectionEnd(null);
  }, []);

  const handleSelectDay = useCallback((day: number) => {
    if (selectionStart === null || selectionEnd !== null) {
      setSelectionStart(day);
      setSelectionEnd(null);
      return;
    }

    if (day >= selectionStart) {
      setSelectionEnd(day);
      return;
    }

    setSelectionEnd(selectionStart);
    setSelectionStart(day);
  }, [selectionEnd, selectionStart]);

  const handleMonthNoteChange = useCallback((nextValue: string) => {
    setNotesByMonth((previous) => ({
      ...previous,
      [monthKey]: {
        ...getMonthNotes(previous, monthKey),
        monthNote: nextValue,
      },
    }));
  }, [monthKey]);

  const handleSelectionNoteChange = useCallback((nextValue: string) => {
    if (normalizedSelection.start === null) {
      return;
    }

    const startDay = normalizedSelection.start;
    const endDay = normalizedSelection.end ?? normalizedSelection.start;

    setNotesByMonth((previous) => {
      const monthNotes = getMonthNotes(previous, monthKey);
      const nextRangeNotes = upsertRangeNote(monthNotes.rangeNotes, startDay, endDay, nextValue);

      return {
        ...previous,
        [monthKey]: {
          ...monthNotes,
          rangeNotes: nextRangeNotes,
        },
      };
    });
  }, [monthKey, normalizedSelection.end, normalizedSelection.start]);

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonthDate((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
    clearSelection();
  }, [clearSelection]);

  const handleNextMonth = useCallback(() => {
    setCurrentMonthDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
    clearSelection();
  }, [clearSelection]);

  return {
    activeTheme,
    activeYear,
    holidayMarkers,
    monthCells,
    monthKey,
    monthLabel,
    monthNote: activeMonthNotes.monthNote,
    rangeEnd: normalizedSelection.end,
    rangeStart: normalizedSelection.start,
    selectionNote: activeSelectionNote,
    todayDay,
    clearSelection,
    handleMonthNoteChange,
    handleNextMonth,
    handlePreviousMonth,
    handleSelectDay,
    handleSelectionNoteChange,
  };
}
