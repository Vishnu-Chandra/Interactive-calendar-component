"use client";

import { useEffect, useMemo, useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import HeroSection from "@/components/HeroSection";
import NotesPanel from "@/components/NotesPanel";
import {
	getHolidayMarkers,
	getMonthGridDays,
	getMonthNotes,
	getSelectionKey,
	getSelectionNote,
	normalizeRange,
	type NotesByMonth,
} from "@/utils/calendar";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const INITIAL_DATE = new Date();
const STORAGE_KEY = "calendar-notes-by-month";

type MonthTheme = {
	imageUrl: string;
	name: string;
	accent: string;
	sceneGradient: string;
	cardFrom: string;
	cardTo: string;
	ribbonFrom: string;
	ribbonTo: string;
};

const MONTH_THEMES: MonthTheme[] = [
	{
		name: "Republic Season",
		accent: "#1d4ed8",
		sceneGradient: "radial-gradient(circle at 22% 18%, #eef4ff 0, transparent 38%), radial-gradient(circle at 80% 78%, #e6f8f4 0, transparent 34%), #dde7f5",
		cardFrom: "#ffffff",
		cardTo: "#f4f8ff",
		ribbonFrom: "#2563eb",
		ribbonTo: "#0f766e",
		imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Basant Breeze",
		accent: "#0f766e",
		sceneGradient: "radial-gradient(circle at 20% 16%, #f4fdf8 0, transparent 38%), radial-gradient(circle at 78% 80%, #fff7df 0, transparent 33%), #e6f2e6",
		cardFrom: "#ffffff",
		cardTo: "#f7fcf8",
		ribbonFrom: "#16a34a",
		ribbonTo: "#0891b2",
		imageUrl: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Festival Colors",
		accent: "#9333ea",
		sceneGradient: "radial-gradient(circle at 24% 18%, #fff1fb 0, transparent 38%), radial-gradient(circle at 80% 76%, #fef3c7 0, transparent 34%), #f1e8f7",
		cardFrom: "#ffffff",
		cardTo: "#faf5ff",
		ribbonFrom: "#7c3aed",
		ribbonTo: "#ea580c",
		imageUrl: "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Summer Dawn",
		accent: "#0369a1",
		sceneGradient: "radial-gradient(circle at 22% 18%, #e8f8ff 0, transparent 38%), radial-gradient(circle at 79% 79%, #fff3dc 0, transparent 34%), #e5eff8",
		cardFrom: "#ffffff",
		cardTo: "#f4faff",
		ribbonFrom: "#0284c7",
		ribbonTo: "#f97316",
		imageUrl: "https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Mango Glow",
		accent: "#c2410c",
		sceneGradient: "radial-gradient(circle at 22% 18%, #fff3d9 0, transparent 38%), radial-gradient(circle at 80% 78%, #ffe8e0 0, transparent 34%), #f9ece2",
		cardFrom: "#fffefb",
		cardTo: "#fff7ed",
		ribbonFrom: "#ea580c",
		ribbonTo: "#ca8a04",
		imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Monsoon Start",
		accent: "#0369a1",
		sceneGradient: "radial-gradient(circle at 24% 18%, #e7f5ff 0, transparent 38%), radial-gradient(circle at 82% 78%, #dff6ff 0, transparent 34%), #deedf6",
		cardFrom: "#ffffff",
		cardTo: "#eff8ff",
		ribbonFrom: "#0ea5e9",
		ribbonTo: "#2563eb",
		imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Monsoon Green",
		accent: "#15803d",
		sceneGradient: "radial-gradient(circle at 24% 20%, #e9fce9 0, transparent 38%), radial-gradient(circle at 78% 78%, #e0f2fe 0, transparent 34%), #e1efe5",
		cardFrom: "#ffffff",
		cardTo: "#f2fbf3",
		ribbonFrom: "#16a34a",
		ribbonTo: "#0f766e",
		imageUrl: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Tricolor Skies",
		accent: "#ea580c",
		sceneGradient: "radial-gradient(circle at 22% 20%, #fff3e0 0, transparent 38%), radial-gradient(circle at 80% 78%, #e0f2fe 0, transparent 34%), #f4ece4",
		cardFrom: "#ffffff",
		cardTo: "#fff7ed",
		ribbonFrom: "#f97316",
		ribbonTo: "#16a34a",
		imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Festive Autumn",
		accent: "#b45309",
		sceneGradient: "radial-gradient(circle at 22% 18%, #fff2d8 0, transparent 38%), radial-gradient(circle at 79% 80%, #fef3c7 0, transparent 34%), #f3e5d8",
		cardFrom: "#fffefb",
		cardTo: "#fff7ed",
		ribbonFrom: "#d97706",
		ribbonTo: "#c2410c",
		imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Diwali Lights",
		accent: "#7c2d12",
		sceneGradient: "radial-gradient(circle at 20% 16%, #fff4dc 0, transparent 38%), radial-gradient(circle at 82% 78%, #fee2e2 0, transparent 34%), #f6e8df",
		cardFrom: "#fffcfa",
		cardTo: "#fff7ed",
		ribbonFrom: "#c2410c",
		ribbonTo: "#7c3aed",
		imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Winter Prep",
		accent: "#1e3a8a",
		sceneGradient: "radial-gradient(circle at 22% 18%, #eef2ff 0, transparent 38%), radial-gradient(circle at 78% 78%, #e0f2fe 0, transparent 34%), #e6ebf5",
		cardFrom: "#ffffff",
		cardTo: "#f3f6ff",
		ribbonFrom: "#2563eb",
		ribbonTo: "#0ea5e9",
		imageUrl: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1200&q=80",
	},
	{
		name: "Year End Glow",
		accent: "#0f766e",
		sceneGradient: "radial-gradient(circle at 20% 16%, #e8fff9 0, transparent 38%), radial-gradient(circle at 82% 78%, #eef2ff 0, transparent 34%), #e5ecef",
		cardFrom: "#ffffff",
		cardTo: "#f1fdfb",
		ribbonFrom: "#0f766e",
		ribbonTo: "#0369a1",
		imageUrl: "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80",
	},
];

export default function Calendar() {
	const [currentMonthDate, setCurrentMonthDate] = useState(INITIAL_DATE);
	const [rangeStart, setRangeStart] = useState<number | null>(null);
	const [rangeEnd, setRangeEnd] = useState<number | null>(null);
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

	const activeYear = currentMonthDate.getFullYear();
	const activeMonthIndex = currentMonthDate.getMonth();
	const activeTheme = MONTH_THEMES[activeMonthIndex];
	const today = new Date();
	const todayDay =
		today.getFullYear() === activeYear && today.getMonth() === activeMonthIndex ? today.getDate() : null;
	const monthKey = `${activeYear}-${activeMonthIndex}`;
	const holidayMarkers = useMemo(() => getHolidayMarkers(activeYear, activeMonthIndex), [activeYear, activeMonthIndex]);
	const activeNotesState = getMonthNotes(notesByMonth, monthKey);

	const monthLabel = useMemo(
		() => currentMonthDate.toLocaleString("en-US", { month: "long" }),
		[currentMonthDate],
	);

	const monthCells = useMemo(
		() => getMonthGridDays(activeYear, activeMonthIndex),
		[activeYear, activeMonthIndex],
	);
	const { normalizedStart, normalizedEnd } = normalizeRange(rangeStart, rangeEnd);
	const activeSelectionKey = getSelectionKey(normalizedStart, normalizedEnd);
	const activeSelectionNote = getSelectionNote(activeNotesState.selectionNotes, activeSelectionKey);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(notesByMonth));
	}, [notesByMonth]);

	const handleSelectDay = (day: number) => {
		if (rangeStart === null || (rangeStart !== null && rangeEnd !== null)) {
			setRangeStart(day);
			setRangeEnd(null);
			return;
		}

		if (day >= rangeStart) {
			setRangeEnd(day);
			return;
		}

		setRangeEnd(rangeStart);
		setRangeStart(day);
	};

	const handleMonthNoteChange = (nextValue: string) => {
		setNotesByMonth((previous) => ({
			...previous,
			[monthKey]: {
				...(previous[monthKey] ?? { monthNote: "", selectionNotes: {} }),
				monthNote: nextValue,
			},
		}));
	};

	const handleSelectionNoteChange = (nextValue: string) => {
		if (!activeSelectionKey) return;

		setNotesByMonth((previous) => ({
			...previous,
			[monthKey]: {
				...(previous[monthKey] ?? { monthNote: "", selectionNotes: {} }),
				selectionNotes: {
					...(previous[monthKey]?.selectionNotes ?? {}),
					[activeSelectionKey]: nextValue,
				},
			},
		}));
	};

	const handlePreviousMonth = () => {
		setCurrentMonthDate((previous) => new Date(previous.getFullYear(), previous.getMonth() - 1, 1));
		setRangeStart(null);
		setRangeEnd(null);
	};

	const handleNextMonth = () => {
		setCurrentMonthDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + 1, 1));
		setRangeStart(null);
		setRangeEnd(null);
	};

	const clearSelection = () => {
		setRangeStart(null);
		setRangeEnd(null);
	};

	const handleContainerClick = (event: React.MouseEvent<HTMLElement>) => {
		const target = event.target as HTMLElement;
		if (target.closest('[data-day-cell="true"]')) {
			return;
		}

		if (rangeStart !== null || rangeEnd !== null) {
			clearSelection();
		}
	};

	return (
		<section
			className="grid min-h-dvh place-items-center px-2 py-2 sm:px-3 sm:py-3"
			style={{ background: activeTheme.sceneGradient }}
			onClick={handleContainerClick}
		>
			<div className="relative w-full max-w-[66rem] pt-8">
				<div className="absolute left-1/2 top-0 z-20 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-400 shadow-[0_6px_12px_rgba(0,0,0,0.22)] ring-2 ring-white/35 transition-transform duration-300 hover:scale-110" aria-hidden="true" />
				<div className="absolute left-1/2 top-3 z-10 h-8 w-px -translate-x-1/2 bg-gray-400/80 transition-opacity duration-300" aria-hidden="true" />
				<article
					className="relative overflow-hidden rounded-[0.5rem] shadow-[0_24px_50px_rgba(0,0,0,0.16),0_2px_0_rgba(0,0,0,0.05)] before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:h-1 before:bg-gradient-to-b before:from-black/10 before:to-transparent sm:rounded-[0.6rem]"
					style={{ animation: "card-rise-in 450ms cubic-bezier(0.22, 1, 0.36, 1) both", backgroundImage: `linear-gradient(to bottom, ${activeTheme.cardFrom}, ${activeTheme.cardTo})` }}
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
							rangeStart={normalizedStart}
							rangeEnd={normalizedEnd}
							monthNote={activeNotesState.monthNote}
							selectionNote={activeSelectionNote}
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
							rangeStart={normalizedStart}
							rangeEnd={normalizedEnd}
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
