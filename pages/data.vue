<template lang="pug">
div
	div.overflow-visible.p-3
		div.flex.gap-1.w-fit
			VueDatePicker(v-model="startDate" :enable-time-picker="false")
			VueDatePicker(v-model="endDate" :enable-time-picker="false")

		div.flex.flex-wrap.gap-1.mt-1
			div.relative.z-10
				Listbox(v-model="selectedQuery")
					ListboxButton.button.bg-utd-orange.text-white.w-40
						| {{ selectedQuery }}
					ListboxOptions.text-center.border.rounded-xl.overflow-hidden.absolute.bg-white.w-full
						ListboxOption(v-for="query in queries" :key="query" :value="query").cursor-pointer.border.p-1.hover_bg-black.hover_text-white
							| {{ query }}
			div.relative.z-10
				Listbox(v-model="selectedTimeLevel")
					ListboxButton.button.bg-utd-orange.text-white.w-40
						| {{ selectedTimeLevel }}
					ListboxOptions.text-center.border.rounded-xl.overflow-hidden.absolute.bg-white.w-full
						ListboxOption(v-for="timeLevel in timeLevels" :key="timeLevel" :value="timeLevel").cursor-pointer.border.p-1.hover_bg-black.hover_text-white
							| {{ timeLevel }}

			div.relative.z-10
				Listbox(v-model="selectedViewLevel")
					ListboxButton.button.bg-utd-orange.text-white.w-40
						| {{ selectedViewLevel }}
					ListboxOptions.text-center.border.rounded-xl.overflow-hidden.absolute.bg-white.w-full
						ListboxOption(v-for="viewLevel in viewLevels" :key="viewLevel" :value="viewLevel").cursor-pointer.border.p-1.hover_bg-black.hover_text-white
							| {{ viewLevel }}

			div.z-9
				button(@click="aggregation = !aggregation").button.bg-utd-green.text-white.w-full.px-4
					| Toggle Aggregate by time ({{ aggregation }})

		div
			Combobox(multiple v-model="selectedViewFilters")
				ul(v-if="selectedViewFilters").flex.flex-row.gap-1.m-1
					li(v-for="selectedViewFilter in selectedViewFilters" :key="selectedViewFilter" :value="selectedViewFilter")
						div.bg-utd-orange.text-white.pl-2.pr-2.pt-1.pb-1.rounded-xl
							| {{ selectedViewFilter }}
				ComboboxInput(@change="query = $event.target.value").text-black.border.w-full.p-1
				ComboboxOptions.text-black.border
					ComboboxOption(v-for="viewFilter in filteredViews" :key="viewFilter" :value="viewFilter").hover_bg-black.hover_text-white.p-1
						| {{ viewFilter }}

	ClientOnly
		DataProcessedChart(
			:aggregation="aggregation ? { field: 'time' } : {}"
			:data="processedData"
			:timeFilter="{ start: startDate, end: endDate }"
			:timeLevel="selectedTimeLevel"
			:title="selectedQuery"
			:viewLevel="selectedViewLevel"
		).h-screen.w-full
</template>

<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue"
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
const viewFilters = ["Grain", "NTFB", "Protein", "Vegetable", "Fruit"]
const selectedViewFilters = ref([viewFilters[0]])
const aggregation = ref(false)

const query = ref("")
const filteredViews = computed(() =>
	query.value === ""
		? viewFilters
		: viewFilters.filter((viewFilter) => viewFilter.toLowerCase().replace(/\s+/g, "").includes(query.value.toLowerCase().replace(/\s+/g, "")))
)

const processedData = computed(() => {
	if (selectedQuery.value === "itemsIn") {
		return itemsIn.value.map((itemCountChange) => {
			return {
				date: new Date(itemCountChange.date),
				count: itemCountChange.amountChanged,
				Item: itemCountChange.Item.name,
				Category: itemCountChange.Item.categoryName,
				Source: itemCountChange.sourceName,
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
