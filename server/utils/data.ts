type TimeLevel = "Day" | "Week" | "Month" | "Semester"

const semesterFromDate = (date: Date) => {
	const springSemesterStart = new Date(date.getFullYear(), 0)
	const springSemesterEnd = new Date(date.getFullYear(), 4, 31)
	const summerSemesterStart = new Date(date.getFullYear(), 5)
	const summerSemesterEnd = new Date(date.getFullYear(), 7, 24)
	// const fallSemesterStart = new Date(date.getFullYear(), 8)
	// const fallSemesterEnd = new Date(date.getFullYear(), 11, 31)

	let semester

	if (date >= springSemesterStart && date <= springSemesterEnd) {
		semester = "Spring"
	} else if (date >= summerSemesterStart && date <= summerSemesterEnd) {
		semester = "Summer"
	} else {
		semester = "Fall"
	}

	return `${semester} ${date.getFullYear()}`
}

const getTimeLevel = (date: Date, level: TimeLevel): string => {
	if (level === "Day") {
		return new Date(date).toLocaleDateString("en-US")
	} else if (level === "Week") {
		const weekStart = new Date(date)
		weekStart.setDate(weekStart.getDate() - weekStart.getDay())

		const weekEnd = new Date(weekStart)
		weekEnd.setDate(weekEnd.getDate() + 6)

		return `${weekStart.toLocaleDateString("en-US")} - ${weekEnd.toLocaleDateString("en-US")}`
	} else if (level === "Month") {
		return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
	} else {
		return semesterFromDate(new Date(date))
	}
}

export { getTimeLevel }
