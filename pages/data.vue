<template lang="pug">
div
	p I know these plots aren't the most intuitive to interact with
	p scroll on an axis or the graph to zoom in/out
	p drag-click on an axis or the graph to move it
	div(class="md_h-[calc(100vh-80px)]").flex.flex-col.md_flex-row.gap-4
		div.min-w-72.border-2.border-black.flex.flex-col.overflow-y-hidden.overflow-y-scroll.p-4.gap-y-2
			div
				Listbox(v-model="selectedQuery")
					ListboxButton(@click="queryOptionOpen = !queryOptionOpen").flex.w-full.items-center
						p Query
						ChevronUpIcon(v-if="queryOptionOpen").h-7.ml-auto
						ChevronDownIcon(v-else).h-7.ml-auto
					div(v-show="queryOptionOpen")
						ListboxOptions(static).border.rounded-xl.bg-white.w-full
							ListboxOption(v-for="query in queries" :key="query" v-slot="{ selected }" :value="query")
								div(:class="'cursor-pointer border p-2 ' + (selected ? 'bg-utd-orange text-white' : 'hover_bg-utd-orange hover_text-white')")
									| {{ query }}
			hr.border-black
			div
				Listbox(v-model="selectedTimeLevel")
					ListboxButton(@click="timeLevelOptionOpen = !timeLevelOptionOpen").flex.w-full.items-center
						p Time Level
						ChevronUpIcon(v-if="timeLevelOptionOpen").h-7.ml-auto
						ChevronDownIcon(v-else).h-7.ml-auto
					div(v-show="timeLevelOptionOpen")
						ListboxOptions(static).border.rounded-xl.bg-white.w-full
							ListboxOption(v-for="timeLevel in timeLevels" :key="timeLevel" v-slot="{ selected }" :value="timeLevel")
								div(:class="'cursor-pointer border p-2 ' + (selected ? 'bg-utd-orange text-white' : 'hover_bg-utd-orange hover_text-white')")
									| {{ timeLevel }}
			hr.border-black
			button(@click="timeFilterOptionOpen = !timeFilterOptionOpen").flex.w-full.items-center
				p Time Filter
				ChevronUpIcon(v-if="timeFilterOptionOpen").h-7.ml-auto
				ChevronDownIcon(v-else).h-7.ml-auto
			div(v-show="timeFilterOptionOpen")
				VueDatePicker(
					auto-position="bottom"
					range
					v-model="dateRange"
					:enable-time-picker="false"
					:max-date="new Date()"
					:preset-dates="presetDates"
					:teleport="true"
				)
			hr.border-black
			div(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut")
				Listbox(v-model="selectedViewLevel")
					ListboxButton(@click="viewLevelOptionOpen = !viewLevelOptionOpen").flex.w-full.items-center
						p View Level
						ChevronUpIcon(v-if="viewLevelOptionOpen").h-7.ml-auto
						ChevronDownIcon(v-else).h-7.ml-auto
					div(v-show="viewLevelOptionOpen")
						ListboxOptions(static).border.rounded-xl.bg-white.w-full
							ListboxOption(v-for="viewLevel in viewLevels" :key="viewLevel" v-slot="{ selected }" :value="viewLevel")
								div(:class="'cursor-pointer border p-2 ' + (selected ? 'bg-utd-orange text-white' : 'hover_bg-utd-orange hover_text-white')")
									| {{ viewLevel }}
			hr(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut").border-black
			div(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut")
				button(@click="viewFilterOptionOpen = !viewFilterOptionOpen").flex.w-full.items-center
					p View Filter
					ChevronUpIcon(v-if="viewFilterOptionOpen").h-7.ml-auto
					ChevronDownIcon(v-else).h-7.ml-auto
				div(v-show="viewFilterOptionOpen")
					Combobox(multiple v-model="selectedViewFilters")
						ul(v-if="selectedViewFilters").flex.flex-row.gap-1.m-1
							li(v-for="selectedViewFilter in selectedViewFilters" :key="selectedViewFilter" :value="selectedViewFilter")
								div.bg-utd-orange.text-white.pl-2.pr-2.pt-1.pb-1.rounded-xl
									| {{ selectedViewFilter }}
						ComboboxInput(@change="query = $event.target.value").text-black.border.w-full.p-1
						ComboboxOptions.text-black.border
							ComboboxOption(v-for="viewFilter in filteredViews" :key="viewFilter" :value="viewFilter").hover_bg-black.hover_text-white.p-1
								| {{ viewFilter }}
			hr(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut").border-black
			div(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut")
				Listbox(v-model="selectedAggregation")
					ListboxButton(@click="aggregationOptionOpen = !aggregationOptionOpen").flex.w-full.items-center
						p Aggregation
						ChevronUpIcon(v-if="aggregationOptionOpen").h-7.ml-auto
						ChevronDownIcon(v-else).h-7.ml-auto
					div(v-show="aggregationOptionOpen")
						ListboxOptions(static).border.rounded-xl.bg-white.w-full
							ListboxOption(v-for="agg in aggregations" :key="agg" v-slot="{ selected }" :value="agg")
								div(:class="'cursor-pointer border p-2 ' + (selected ? 'bg-utd-orange text-white' : 'hover_bg-utd-orange hover_text-white')")
									| {{ agg }}
			hr(v-if="selectedQuery === QueryType.ItemsIn || selectedQuery === QueryType.ItemsOut").border-black
		div.p-2.border-black.border-2.w-full.h-screen.md_h-full
			ClientOnly
				DataProcessedChart(
					:aggregation="aggregation"
					:data="processedData"
					:showLegend="showLegend"
					:timeFilter="{ start: startDate, end: endDate }"
					:timeLevel="selectedTimeLevel"
					:title="selectedQuery"
					:viewLevel="selectedQuery === QueryType.ItemsIn || (selectedQuery === QueryType.ItemsOut && selectedViewLevel !== 'Source') ? selectedViewLevel : 'All'"
				)
</template>

<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from "@headlessui/vue"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

const { data: itemsIn } = await useFetch("/api/data/itemsIn")
const { data: itemsOut } = await useFetch("/api/data/itemsOut")

// num of users, use All for viewLevel and have no viewFilters

const presetDates = ref([
	{ label: "Today", value: [new Date(), new Date()] },
	{ label: "Last 7 Days", value: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()] },
	{ label: "Last 30 Days", value: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()] },
	{ label: "Last Year", value: [new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date()] },
])

enum QueryType {
	ItemsIn = "Items In",
	ItemsOut = "Items Out",
	NumUsers = "Num Users",
	NumUniqueUsers = "Num Unique Users",
}

const queries = [QueryType.ItemsIn, QueryType.ItemsOut, QueryType.NumUsers, QueryType.NumUniqueUsers]
const selectedQuery = ref(QueryType.ItemsIn)
const timeLevels = [TimeLevelType.Day, TimeLevelType.Week, TimeLevelType.Month, TimeLevelType.Semester, TimeLevelType.Year]
const selectedTimeLevel = ref(TimeLevelType.Week)
const viewLevels = ["Item", "Category", "Source", "All"]
const selectedViewLevel = ref(viewLevels[0])
const dateRange = ref(presetDates.value[2].value)
const viewFilters = ["Grain", "NTFB", "Protein", "Vegetable", "Fruit"]
const selectedViewFilters = ref([])
const aggregations = ["none", "time", "view"]
const selectedAggregation = ref("none")
const query = ref("")

const queryOptionOpen = ref(true)
const timeLevelOptionOpen = ref(false)
const timeFilterOptionOpen = ref(false)
const viewLevelOptionOpen = ref(false)
const viewFilterOptionOpen = ref(false)
const aggregationOptionOpen = ref(false)

// just to place legend correctly
const windowWidth = ref(1)
onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
	open.value = true
})
onUnmounted(() => {
	window.removeEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
})

const aggregation = computed(() => {
	if (selectedAggregation.value !== "none" && (selectedQuery.value === QueryType.ItemsIn || selectedQuery.value === QueryType.ItemsOut)) {
		return { field: selectedAggregation.value }
	}
	return {}
})

const showLegend = computed(() => {
	return windowWidth.value > 825
})

const startDate = computed(() => {
	if (dateRange.value[0] === undefined) {
		return new Date()
	} else {
		return dateRange.value[0]
	}
})
const endDate = computed(() => {
	if (dateRange.value[1] === undefined) {
		return new Date()
	} else {
		return dateRange.value[1]
	}
})

const filteredViews = computed(() =>
	query.value === ""
		? viewFilters
		: viewFilters.filter((viewFilter) => viewFilter.toLowerCase().replace(/\s+/g, "").includes(query.value.toLowerCase().replace(/\s+/g, "")))
)

const processedData = computed(() => {
	if (selectedQuery.value === QueryType.ItemsIn) {
		return itemsIn.value.map((itemCountChange) => {
			return {
				date: new Date(itemCountChange.date),
				count: itemCountChange.amountChanged,
				Item: itemCountChange.Item.name,
				Category: itemCountChange.Item.categoryName,
				Source: itemCountChange.sourceName,
			}
		})
	} else if (selectedQuery.value === QueryType.ItemsOut) {
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
	} else if (selectedQuery.value === QueryType.NumUsers) {
		return itemsOut.value.map((order) => {
			return {
				date: new Date(order.date),
				count: 1,
			}
		})
	} else if (selectedQuery.value === QueryType.NumUniqueUsers) {
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
