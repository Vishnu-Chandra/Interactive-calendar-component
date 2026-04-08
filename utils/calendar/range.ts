export function normalizeRange(rangeStart: number | null, rangeEnd: number | null): {
	normalizedStart: number | null;
	normalizedEnd: number | null;
} {
	if (rangeStart === null || rangeEnd === null) {
		return {
			normalizedStart: rangeStart,
			normalizedEnd: rangeEnd,
		};
	}

	return {
		normalizedStart: Math.min(rangeStart, rangeEnd),
		normalizedEnd: Math.max(rangeStart, rangeEnd),
	};
}

export function getSelectionKey(normalizedStart: number | null, normalizedEnd: number | null): string | null {
	if (normalizedStart === null) {
		return null;
	}

	return `${normalizedStart}-${normalizedEnd ?? normalizedStart}`;
}