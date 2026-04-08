export type MonthTheme = {
  imageUrl: string;
  name: string;
  accent: string;
  sceneGradient: string;
  cardFrom: string;
  cardTo: string;
  ribbonFrom: string;
  ribbonTo: string;
};

export type DateSelection = {
  start: number | null;
  end: number | null;
};

export type RangeNote = {
  id: string;
  startDay: number;
  endDay: number;
  note: string;
};

export type MonthNotes = {
  monthNote: string;
  rangeNotes: RangeNote[];
};

export type NotesByMonth = Record<string, MonthNotes>;

export type NormalizedRange = {
  start: number | null;
  end: number | null;
};