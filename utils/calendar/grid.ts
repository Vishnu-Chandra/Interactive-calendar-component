export function getMonthGridDays(year: number, monthIndex: number): Array<number | null> {
	const firstDay = new Date(year, monthIndex, 1);
	const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
	const mondayStartOffset = (firstDay.getDay() + 6) % 7;
	const cells: Array<number | null> = Array(mondayStartOffset).fill(null);

	for (let day = 1; day <= daysInMonth; day += 1) {
		cells.push(day);
	}

	while (cells.length < 42) {
		cells.push(null);
	}

	return cells;
}