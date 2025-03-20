<template lang="pug">
div
	ClientOnly
		DataPlotlyChart(:data="processedData" :layout="layout").h-screen
</template>

<script lang="ts" setup>
enum TimeLevelType {
	Day = "Day",
	Week = "Week",
	Month = "Month",
	Semester = "Semester",
	Year = "Year",
}

enum ViewLevelType {
	Item = "Item",
	Category = "Category",
	Source = "Source",
	All = "All",
}

const props = defineProps({
	title: {
		type: String,
		required: true,
	},
	data: {
		type: Array,
		required: true,
	},
	timeLevel: {
		type: String as PropType<TimeLevelType>,
		required: true,
	},
	timeFilter: {
		type: Object,
		required: false,
		default: () => ({
			start: undefined,
			end: undefined,
		}),
	},
	viewLevel: {
		type: String as PropType<ViewLevelType>,
		required: false,
		default: "All",
	},
	viewFilter: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
	aggregation: {
		type: Object,
		required: false,
		default: () => {
			return {}
		},
	},
})

const { title, data, timeLevel, timeFilter, viewLevel, viewFilter, aggregation } = toRefs(props)

/*

Dimensions are x, y, and the stacked

Time Level: Per Day, Week, Month, Semester, Year
Time Filter: Start DateTime, End DateTime (down to the day?)
View Level if applicable: Per Item, Per Category, Per Source, Per Inventory
View Filter if applicable: Item, Category, Source

Aggregations: Sum, Max
Aggregation Filter: Field to aggregate on

*/

// data must have a date field
// need data to be very flat
// timeFilter is in form { start: Date, end: Date }
// viewFilter is in form { fields: string, values: [] }

const isObjectEmpty = (obj) => {
	return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

const layout = computed(() => {
	return {
		title: {
			text: title.value,
		},
		barmode: "stack",
	}
})

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

const getNextTimeLevel = (date, level) => {
	if (level === TimeLevelType.Day) {
		const nextDay = new Date(date)
		nextDay.setDate(nextDay.getDate() + 1)
		return getTimeLevel(nextDay, level)
	} else if (level === TimeLevelType.Week) {
		// always return sunday
		const nextWeek = new Date(date)
		nextWeek.setDate(nextWeek.getDate() - nextWeek.getDay() + 7)
		return getTimeLevel(nextWeek, level)
	} else if (level === TimeLevelType.Month) {
		return getTimeLevel(new Date(date.getFullYear(), date.getMonth() + 1), level)
	} else if (level === TimeLevelType.Semester) {
		const semester = semesterFromDate(date)
		if (semester === "Spring") {
			return `Summer ${date.getFullYear()}`
		} else if (semester === "Summer") {
			return `Fall ${date.getFullYear()}`
		} else {
			return `Spring ${date.getFullYear() + 1}`
		}
	} else if (level === TimeLevelType.Year) {
		return getTimeLevel(new Date(date.getFullYear() + 1), level)
	}
}

const processedData = computed(() => {
	let result = data.value

	// filter by time
	result = result.filter((element) => {
		return (
			(timeFilter.value.start == undefined || element.date >= timeFilter.value.start) &&
			(timeFilter.value.end == undefined || element.date <= timeFilter.value.end)
		)
	})

	// filter by view
	if (!isObjectEmpty(viewFilter.value)) {
		result = result.filter((element) => {
			// check if element has any of the viewFilter fields
			return Object.keys(viewFilter.value).find((key) => {
				return element[key] !== undefined && viewFilter[key].includes(element[key])
			})
		})
	}

	// get the first and last time level
	const firstDate = result.reduce((min, element) => {
		return new Date(element.date) < min ? new Date(element.date) : min
	}, new Date(result[0].date))
	const lastDate = result.reduce((max, element) => {
		return new Date(element.date) > max ? new Date(element.date) : max
	}, new Date(result[0].date))

	// FIX THIS LATER TO BE MORE EFFICIENT
	const curDate = new Date(firstDate)
	let counter = 0
	const allTimeLevels = {}
	while (curDate <= lastDate) {
		const level = getTimeLevel(curDate, timeLevel.value)
		if (allTimeLevels[level] == undefined) {
			allTimeLevels[level] = counter
			counter++
		}
		curDate.setDate(curDate.getDate() + 1)
	}

	// group by viewLevel
	if (viewLevel.value === ViewLevelType.All) {
		result = { All: result }
	} else {
		result = Object.groupBy(result, (element) => {
			return element[viewLevel.value]
		})
	}

	// for each stack
	// group by timeLevel
	Object.keys(result).forEach((key) => {
		result[key] = Object.groupBy(result[key], (element) => {
			const time = element.date
			if (timeLevel.value) {
				return getTimeLevel(time, timeLevel.value)
			} else {
				return time
			}
		})
	})

	// for each stack, add the missing time levels and order them

	Object.keys(result).forEach((stack) => {
		const updatedKVEntries = {}
		Object.keys(allTimeLevels).forEach((timeLevel) => {
			updatedKVEntries[timeLevel] = result[stack][timeLevel] || []
		})
		result[stack] = updatedKVEntries
	})

	// if aggregation field is time, vertically per time
	// assume homogenous data for time field
	if (!isObjectEmpty(aggregation.value) && aggregation.value.field == "time") {
		const x = Object.keys(allTimeLevels).map((time) => {
			return time
		})
		const y = Object.keys(allTimeLevels).map((time) => {
			return Object.keys(result).reduce((acc, stack) => {
				// technically at this point each result[stack][time] is an array
				// since groupBy returns array for each key, even if it's 1 element
				return (
					acc +
					result[stack][time].reduce((acc2, element) => {
						return acc2 + element.count
					}, 0)
				)
			}, 0)
		})
		return [
			{
				x: x,
				y: y,
				type: "bar",
				hoverinfo: "x+y",
				text: y,
			},
		]
	}
	// if aggregation field is viewLevel, across a stack

	// assign x and y values
	result = Object.keys(result).map((stack) => {
		return {
			x: Object.keys(result[stack]).map((time) => {
				return time
			}),
			y: Object.keys(result[stack]).map((time) => {
				return result[stack][time].reduce((acc, element) => {
					return acc + element.count
				}, 0)
			}),
			type: "bar",
			hoverinfo: "y+name",
			text: Object.keys(result[stack]).map((time) => {
				return `${stack} ${result[stack][time].reduce((acc, element) => {
					return acc + element.count
				}, 0)}`
			}),
			name: stack,
		}
	})

	return result
})
</script>
