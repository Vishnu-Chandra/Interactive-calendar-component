import type { MonthNotes, NotesByMonth, RangeNote } from "../calendar.types";

type LegacyMonthNotes = {
  monthNote?: unknown;
  rangeNotes?: unknown;
  selectionNotes?: Record<string, string>;
};

function parseRangeKey(key: string): { startDay: number; endDay: number } | null {
  const [startRaw, endRaw] = key.split("-");
  const startDay = Number.parseInt(startRaw, 10);
  const endDay = Number.parseInt(endRaw ?? startRaw, 10);

  if (Number.isNaN(startDay) || Number.isNaN(endDay)) {
    return null;
  }

  return {
    startDay: Math.min(startDay, endDay),
    endDay: Math.max(startDay, endDay),
  };
}

function normalizeRangeNotes(input: unknown): RangeNote[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((entry): entry is Partial<RangeNote> => Boolean(entry && typeof entry === "object"))
    .map((entry) => {
      const startDay = Number(entry.startDay);
      const endDay = Number(entry.endDay);
      const note = typeof entry.note === "string" ? entry.note : "";

      if (!Number.isFinite(startDay) || !Number.isFinite(endDay)) {
        return null;
      }

      const normalizedStart = Math.min(startDay, endDay);
      const normalizedEnd = Math.max(startDay, endDay);
      return {
        id: typeof entry.id === "string" && entry.id ? entry.id : createRangeId(normalizedStart, normalizedEnd),
        startDay: normalizedStart,
        endDay: normalizedEnd,
        note,
      };
    })
    .filter((entry): entry is RangeNote => entry !== null)
    .sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);
}

function legacySelectionMapToRangeNotes(selectionNotes: Record<string, string> | undefined): RangeNote[] {
  if (!selectionNotes) {
    return [];
  }

  return Object.entries(selectionNotes)
    .map(([key, note]) => {
      const parsed = parseRangeKey(key);
      if (!parsed) {
        return null;
      }

      return {
        id: createRangeId(parsed.startDay, parsed.endDay),
        startDay: parsed.startDay,
        endDay: parsed.endDay,
        note,
      };
    })
    .filter((entry): entry is RangeNote => entry !== null)
    .sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);
}

export function getMonthNotes(notesByMonth: NotesByMonth, monthKey: string): MonthNotes {
  const rawMonthNotes = (notesByMonth as Record<string, unknown>)[monthKey] as LegacyMonthNotes | undefined;
  if (!rawMonthNotes || typeof rawMonthNotes !== "object") {
    return { monthNote: "", rangeNotes: [] };
  }

  const monthNote = typeof rawMonthNotes.monthNote === "string" ? rawMonthNotes.monthNote : "";
  const rangeNotes = normalizeRangeNotes(rawMonthNotes.rangeNotes);

  if (rangeNotes.length > 0) {
    return { monthNote, rangeNotes };
  }

  return {
    monthNote,
    rangeNotes: legacySelectionMapToRangeNotes(rawMonthNotes.selectionNotes),
  };
}

export function createRangeId(startDay: number, endDay: number): string {
  return `${startDay}-${endDay}`;
}

export function findRangeContainingDay(rangeNotes: RangeNote[], day: number): RangeNote | null {
  return rangeNotes.find((entry) => day >= entry.startDay && day <= entry.endDay) ?? null;
}

export function findRangeNoteByBounds(
  rangeNotes: RangeNote[],
  start: number | null,
  end: number | null,
): RangeNote | null {
  if (start === null) {
    return null;
  }

  const finalEnd = end ?? start;
  return rangeNotes.find((entry) => entry.startDay === start && entry.endDay === finalEnd) ?? null;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart <= bEnd && bStart <= aEnd;
}

export function upsertRangeNote(
  rangeNotes: RangeNote[],
  startDay: number,
  endDay: number,
  note: string,
): RangeNote[] {
  const trimmedNote = note.trim();

  if (!trimmedNote) {
    return rangeNotes.filter((entry) => !(entry.startDay === startDay && entry.endDay === endDay));
  }

  const overlapping = rangeNotes.filter((entry) => rangesOverlap(entry.startDay, entry.endDay, startDay, endDay));
  const mergedStart = overlapping.reduce((min, entry) => Math.min(min, entry.startDay), startDay);
  const mergedEnd = overlapping.reduce((max, entry) => Math.max(max, entry.endDay), endDay);
  const stableNotes = rangeNotes.filter((entry) => !rangesOverlap(entry.startDay, entry.endDay, startDay, endDay));

  return [
    ...stableNotes,
    {
      id: createRangeId(mergedStart, mergedEnd),
      startDay: mergedStart,
      endDay: mergedEnd,
      note: trimmedNote,
    },
  ].sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);
}

export function getDaysWithNotes(rangeNotes: RangeNote[] | null | undefined): Set<number> {
  const days = new Set<number>();

  if (!Array.isArray(rangeNotes)) {
    return days;
  }

  for (const entry of rangeNotes) {
    for (let day = entry.startDay; day <= entry.endDay; day += 1) {
      days.add(day);
    }
  }

  return days;
}
