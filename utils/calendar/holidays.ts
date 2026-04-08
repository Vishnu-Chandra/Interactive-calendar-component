export function getHolidayMarkers(year: number, monthIndex: number): Record<number, string> {
	const indianHolidaysByMonth: Record<number, Record<number, string>> = {
		0: {
			1: "New Year Day",
			14: "Makar Sankranti / Pongal",
			26: "Republic Day",
		},
		1: {
			19: "Chhatrapati Shivaji Maharaj Jayanti",
		},
		2: {
			8: "International Women's Day",
			22: "Ugadi / Gudi Padwa (approx)",
		},
		3: {
			14: "Ambedkar Jayanti",
			22: "Akshaya Tritiya (approx)",
		},
		4: {
			1: "Maharashtra Day / Labour Day",
		},
		5: {
			21: "International Yoga Day",
		},
		6: {
			29: "Muharram (approx)",
		},
		7: {
			15: "Independence Day",
			30: "Raksha Bandhan (approx)",
		},
		8: {
			5: "Teachers' Day",
			19: "Ganesh Chaturthi (approx)",
		},
		9: {
			2: "Gandhi Jayanti",
			24: "Dussehra (approx)",
		},
		10: {
			12: "Diwali (approx)",
			14: "Children's Day",
		},
		11: {
			25: "Christmas",
		},
	};

	const monthMarkers = indianHolidaysByMonth[monthIndex] ?? {};
	const markers: Record<number, string> = {};

	for (const [dayStr, label] of Object.entries(monthMarkers)) {
		const day = Number.parseInt(dayStr, 10);
		markers[day] = `${label}, ${year}`;
	}

	return markers;
}