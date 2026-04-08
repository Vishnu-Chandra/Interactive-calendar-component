type NotesPanelProps = {
  monthLabel: string;
  year: number;
  rangeStart: number | null;
  rangeEnd: number | null;
  monthNote: string;
  selectionNote: string;
  onMonthNoteChange: (nextValue: string) => void;
  onSelectionNoteChange: (nextValue: string) => void;
  onClearSelection: () => void;
};

export default function NotesPanel({
  monthLabel,
  year,
  rangeStart,
  rangeEnd,
  monthNote,
  selectionNote,
  onMonthNoteChange,
  onSelectionNoteChange,
  onClearSelection,
}: NotesPanelProps) {
  const rangeLabel =
    rangeStart === null
      ? "No range selected"
      : rangeEnd === null
        ? `${monthLabel} ${rangeStart}, ${year} (start)`
        : `${monthLabel} ${rangeStart} to ${monthLabel} ${rangeEnd}, ${year}`;

  return (
    <aside
      className="flex flex-col gap-3 border-b border-b-[#e7ebf1] pb-2 md:border-b-0 md:border-r md:border-r-[#e7ebf1] md:pb-0 md:pr-3"
      aria-label="Notes"
    >
      <div className="rounded-lg border border-[#e7ebf1] bg-white/75 px-3 py-2 shadow-[0_4px_10px_rgba(15,23,42,0.04)]">
        <p className="m-0 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[#64748b]">Notes Panel</p>
        <h2 className="m-0 mt-1 text-sm font-semibold text-[#0f172a]">Plan Your Month</h2>
      </div>

      <section className="rounded-lg border border-[#e7ebf1] bg-white px-3 py-2.5 shadow-[0_4px_10px_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
        <p className="mb-1 text-xs font-semibold text-[#64748b]">Monthly Memo</p>
        <textarea
          value={monthNote}
          onChange={(event) => onMonthNoteChange(event.target.value)}
          className="min-h-[4.6rem] w-full resize-y rounded-md border border-[#e5e7eb] bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)] px-2.5 py-1.5 text-[0.8rem] leading-[22px] text-[#2c3341] placeholder:text-[#8b90a0] transition-all duration-200 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 md:min-h-[5.2rem]"
          placeholder={`Write memo for ${monthLabel} ${year}...`}
        />
      </section>

      <section className="rounded-lg border border-[#e7ebf1] bg-white px-3 py-2.5 shadow-[0_4px_10px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <p className="m-0 text-xs font-semibold text-[#64748b]">Selected Range</p>
          <button
            type="button"
            className="min-h-7 cursor-pointer rounded-full border border-[#d8dfeb] bg-white px-2.5 py-0.5 text-[0.62rem] font-semibold text-[#3c5b7d] transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={onClearSelection}
            disabled={rangeStart === null}
          >
            Clear
          </button>
        </div>
        <p className="mb-2 mt-1 text-sm leading-[1.35] text-gray-500">{rangeLabel}</p>
        <textarea
          value={selectionNote}
          onChange={(event) => onSelectionNoteChange(event.target.value)}
          className="min-h-[4.6rem] w-full resize-y rounded-md border border-[#e5e7eb] bg-[repeating-linear-gradient(white,white_22px,#e5e7eb_23px)] px-2.5 py-1.5 text-[0.8rem] leading-[22px] text-[#2c3341] placeholder:text-[#8b90a0] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 md:min-h-[5.2rem]"
          placeholder="Write note for the selected range..."
          disabled={rangeStart === null}
        />
      </section>
    </aside>
  );
}