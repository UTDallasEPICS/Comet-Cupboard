enum TimeLevelType {
	Day = "Day",
	Week = "Week",
	Month = "Month",
	Semester = "Semester",
	Year = "Year",
}

const semesterFromDate = (date) => {
	const springSemesterStart = new Date(date.getFullYear(), 0)
	const springSemesterEnd = new Date(date.getFullYear(), 4, 31)
	const summerSemesterStart = new Date(date.getFullYear(), 5)
	const summerSemesterEnd = new Date(date.getFullYear(), 7, 24)
	// const fallSemesterStart = new Date(date.getFullYear(), 8)
	// const fallSemesterEnd = new Date(date.getFullYear(), 11, 31)
	if (date >= springSemesterStart && date <= springSemesterEnd) {
		return "Spring"
	} else if (date >= summerSemesterStart && date <= summerSemesterEnd) {
		return "Summer"
	} else {
		return "Fall"
	}
}

const getTimeLevel = (date, level) => {
	if (level === TimeLevelType.Day) {
		return new Date(date).toLocaleDateString("en-US")
	} else if (level === TimeLevelType.Week) {
		const sunday = new Date(date)
		sunday.setDate(sunday.getDate() - sunday.getDay())
		const saturday = new Date(sunday)
		saturday.setDate(sunday.getDate() + 6)
		return sunday.toLocaleDateString("en-US") + " - " + saturday.toLocaleDateString("en-US")
	} else if (level === TimeLevelType.Month) {
		return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" })
	} else if (level === TimeLevelType.Semester) {
		return `${semesterFromDate(new Date(date))} ${new Date(date).getFullYear()}`
	} else if (level === TimeLevelType.Year) {
		return new Date(date).toLocaleDateString("en-US", { year: "numeric" })
	} else {
		return date
	}
}

export { getTimeLevel }
