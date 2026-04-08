export type PersistedNotes = {
	monthNote: string;
	selectionNotes: Record<string, string>;
};

export type NotesByMonth = Record<string, PersistedNotes>;

export function getMonthNotes(notesByMonth: NotesByMonth, monthKey: string): PersistedNotes {
	return notesByMonth[monthKey] ?? { monthNote: "", selectionNotes: {} };
}

export function getSelectionNote(selectionNotes: Record<string, string>, activeSelectionKey: string | null): string {
	if (!activeSelectionKey) {
		return "";
	}

	return selectionNotes[activeSelectionKey] ?? "";
}