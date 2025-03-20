<template lang="pug">
div
	VueDatePicker(v-model="startDate" :enable-time-picker="false")
	VueDatePicker(v-model="endDate" :enable-time-picker="false")

	Listbox(v-model="selectedQuery")
		ListboxButton.border-2.border-black
			| {{ selectedQuery }}
		ListboxOptions
			ListboxOption(v-for="query in queries" :key="query" :value="query").cursor-pointer
				| {{ query }}

	Listbox(v-model="selectedTimeLevel")
		ListboxButton.border-2.border-black
			| {{ selectedTimeLevel }}
		ListboxOptions
			ListboxOption(v-for="timeLevel in timeLevels" :key="timeLevel" :value="timeLevel").cursor-pointer
				| {{ timeLevel }}

	Listbox(v-model="selectedViewLevel")
		ListboxButton.border-2.border-black
			| {{ selectedViewLevel }}
		ListboxOptions
			ListboxOption(v-for="viewLevel in viewLevels" :key="viewLevel" :value="viewLevel").cursor-pointer
				| {{ viewLevel }}

	button(@click="aggregation = !aggregation")
		| Aggregate by time = {{ aggregation }}

	ClientOnly
		DataProcessedChart(
			:aggregation="aggregation ? { field: 'time' } : {}"
			:data="processedData"
			:timeFilter="{ start: startDate, end: endDate }"
			:timeLevel="selectedTimeLevel"
			:title="selectedQuery"
			:viewFilter="viewFilters"
			:viewLevel="selectedViewLevel"
		).h-screen
</template>

<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

const { data: itemsIn } = await useFetch("/api/data/itemsIn")
const { data: itemsOut } = await useFetch("/api/data/itemsOut")

// num of users, use All for viewLevel and have no viewFilters

const queries = ["itemsIn", "itemsOut", "numUsers", "numUniqueUsers"]
const selectedQuery = ref(queries[0])
const timeLevels = ["Day", "Week", "Month", "Semester", "Year"]
const selectedTimeLevel = ref(timeLevels[0])
const viewLevels = ["Item", "Category", "Source", "All"]
const selectedViewLevel = ref(viewLevels[0])
const startDate = ref(null)
const endDate = ref(null)
const viewFilters = ref({})
const aggregation = ref(false)

const processedData = computed(() => {
	if (selectedQuery.value === "itemsIn") {
		return itemsIn.value.map((itemCountChange) => {
			return {
				date: new Date(itemCountChange.date),
				count: itemCountChange.amountChanged,
				Item: itemCountChange.Item.name,
				Category: itemCountChange.Item.categoryName,
				Source: itemCountChange.source,
			}
		})
	} else if (selectedQuery.value === "itemsOut") {
		return itemsOut.value.flatMap((order) => {
			return order.OrderItems.map((item) => {
				return {
					date: new Date(order.date),
					count: item.count,
					Item: item.Item.name,
					Category: item.Item.categoryName,
				}
			})
		})
	} else if (selectedQuery.value === "numUsers") {
		return itemsOut.value.map((order) => {
			return {
				date: new Date(order.date),
				count: 1,
			}
		})
	} else if (selectedQuery.value === "numUniqueUsers") {
		// num unique users per time period
		let result = itemsOut.value.map((order) => {
			return {
				date: new Date(order.date),
				netID: order.netID,
				count: 1,
			}
		})

		// group by time, then by netID, then filter out duplicates
		result = Object.groupBy(result, (order) => {
			return getTimeLevel(order.date, selectedTimeLevel.value)
		})
		Object.keys(result).forEach((time) => {
			result[time] = Object.groupBy(result[time], (order) => {
				return order.netID
			})
			// remove duplicates
			Object.keys(result[time]).forEach((netID) => {
				result[time][netID] = result[time][netID][0]
			})
		})

		// unravel the data
		result = Object.keys(result).flatMap((time) => {
			return Object.keys(result[time]).flatMap((netID) => {
				return result[time][netID]
			})
		})
		return result
	} else {
		return []
	}
})

// TOO LAZY TO USE UTILS RIGHT NOW, WILL DO LATER

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
</script>
