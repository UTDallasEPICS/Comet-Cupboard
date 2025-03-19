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
})

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

const layout = {
	title: {
		text: props.title,
	},
	barmode: "stack",
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

const processedData = computed(() => {
	let result = props.data

	// filter by time
	result = result.filter((element) => {
		return (
			(props.timeFilter.start == undefined || element.date >= props.timeFilter.start) &&
			(props.timeFilter.end == undefined || element.date <= props.timeFilter.end)
		)
	})

	// filter by view
	if (!isObjectEmpty(props.viewFilter)) {
		result = result.filter((element) => {
			// check if element has any of the viewFilter fields
			return Object.keys(props.viewFilter).find((key) => {
				return element[key] !== undefined && viewFilter[key].includes(element[key])
			})
		})
	}

	// group by viewLevel
	if (props.viewLevel === ViewLevelType.All) {
		result = { All: result }
	} else {
		result = Object.groupBy(result, (element) => {
			return element[props.viewLevel]
		})
	}

	// for each stack
	// group by timeLevel
	Object.keys(result).forEach((key) => {
		result[key] = Object.groupBy(result[key], (element) => {
			const time = element.date
			if (props.timeLevel === TimeLevelType.Day) {
				return new Date(time).toLocaleDateString("en-US")
			} else if (props.timeLevel === TimeLevelType.Week) {
				return (
					new Date(time).toLocaleDateString("en-US") +
					" - " +
					new Date(new Date(time).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US")
				)
			} else if (props.timeLevel === TimeLevelType.Month) {
				return new Date(time).toLocaleDateString("en-US", { month: "short", year: "numeric" })
			} else if (props.timeLevel === TimeLevelType.Semester) {
				return `${semesterFromDate(new Date(time))} ${new Date(time).getFullYear()}`
			} else if (props.timeLevel === TimeLevelType.Year) {
				return new Date(time).toLocaleDateString("en-US", { year: "numeric" })
			} else {
				return time
			}
		})
	})

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
