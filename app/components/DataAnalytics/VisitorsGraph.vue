<template>
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-4xl font-bold text-black">Visitors</h1>

			<DataAnalyticsOptionButton :grouping="grouping" :date-range="displayRange" :show-time-level="true" :show-date-range="true">
				<div class="flex flex-col p-4">
					<div class="justify-left flex flex-col">
						<p class="my-2 text-sm font-bold">Time Level</p>
						<USelect v-model="grouping" :items="['Day', 'Week', 'Month', 'Semester']" class="w-full" />
					</div>

					<div class="justify-left flex flex-col">
						<p class="my-2 text-sm font-bold">Time Range</p>
						<UInputDate ref="inputDate" v-model="modelValue" range>
							<template #trailing>
								<UPopover :reference="inputDate?.inputsRef[0]?.$el">
									<UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar" aria-label="Select a date range" class="px-0" />

									<template #content>
										<UCalendar v-model="modelValue" class="p-2" :number-of-months="2" range />
									</template>
								</UPopover>
							</template>
						</UInputDate>
					</div>
				</div>
			</DataAnalyticsOptionButton>
		</div>
	</div>
	<div class="mt-5 flex min-h-32 w-full items-center justify-center rounded-lg bg-white shadow-2xl">
		<DataAnalyticsDataCardComponent title="Total Visitors" :value="totalVisitors" />
		<DataAnalyticsDataCardComponent title="Total Unique Visitors" :value="totalUniqueVisitors" />
		<DataAnalyticsDataCardComponent title="Peak Visitor Count" :value="peakVisitors" />
		<DataAnalyticsDataCardComponent title="Average Visitors" :value="avgVisitors" />
	</div>
	<div class="min-h-140 w-full min-w-0">
		<canvas ref="lineContainer" />
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
import { Chart } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const grouping = ref("Day")
const groupingChange = ref(false)
const inputDate = useTemplateRef("inputDate")
const df = new DateFormatter("en-US", { month: "short", day: "numeric" })
const dfMonth = new DateFormatter("en-US", { month: "short" })
const tz = getLocalTimeZone()
const initialEnd = today(tz)

const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const visitorData = ref({})
const uniqueVisitorData = ref({})

const chartContainer = useTemplateRef("lineContainer")
const chart = shallowRef<Chart | null>(null)

const automatedGrouping = computed(() => {
	if (!modelValue.value.start || !modelValue.value.end) {
		return "Day"
	}

	const start = modelValue.value.start.toDate(tz)
	const end = modelValue.value.end.toDate(tz)

	const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

	if (diffDays <= 30) {
		return "Day"
	} else if (diffDays <= 90) {
		return "Week"
	} else if (diffDays <= 180) {
		return "Month"
	} else {
		return "Semester"
	}
})

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	const fetchVisitorData = await $fetch("/api/head-admin/data/visitor", {
		query: {
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	const fetchUniqueVisitorData = await $fetch("/api/head-admin/data/uniqueVisits", {
		query: {
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	visitorData.value = fetchVisitorData
	uniqueVisitorData.value = fetchUniqueVisitorData

	console.log(visitorData.value)
	console.log(uniqueVisitorData.value)
	console.log(totalVisitors.value)
	console.log(totalUniqueVisitors.value)
	console.log(peakVisitors.value)

	const dates = Object.keys(visitorData.value).map(formatLabel)

	if (!chart.value) return

	chart.value.data.labels = dates

	chart.value.data.datasets[0].data = Object.values(visitorData.value)

	chart.value.data.datasets[1].data = Object.values(uniqueVisitorData.value)

	chart.value.update()
}

watch([modelValue, grouping], () => {
	if (!modelValue.value.start || !modelValue.value.end) return
	updateChart()
})

watch(automatedGrouping, (newGrouping) => {
	if (groupingChange.value === false) {
		grouping.value = newGrouping
	}
})

const totalVisitors = computed(() => {
	return Object.values(visitorData.value).reduce((sum, qty) => sum + qty, 0)
})

const totalUniqueVisitors = computed(() => {
	return Object.values(uniqueVisitorData.value).reduce((sum, qty) => sum + qty, 0)
})

const peakVisitors = computed(() => {
	return Math.max(...Object.values(visitorData.value))
})

const avgVisitors = computed(() => {
	return (totalVisitors.value / Object.entries(visitorData.value).length).toFixed(1)
})

const formatLabel = (key: string) => {
	if (grouping.value === "Semester") {
		return key
	}

	if (grouping.value === "Week") {
		const [start, end] = key.split(" - ")

		return `${df.format(new Date(start))} - ${df.format(new Date(end))}`
	}

	if (grouping.value === "Month") {
		return `${dfMonth.format(new Date(key))}`
	}

	return df.format(new Date(key))
}

const displayRange = computed(() => {
	const { start, end } = modelValue.value

	if (!start || !end) return ""

	return `${start.month}/${start.day}/${start.year} - ${end.month}/${end.day}/${end.year}`
})

onMounted(async () => {
	chart.value = new Chart(chartContainer.value!, {
		type: "line",
		data: {
			labels: [],
			datasets: [
				{
					label: "Total Visitors",
					data: [],
					borderColor: "#e4701e",
				},
				{
					label: "Unique Visitors",
					data: [],
					borderColor: "#154734",
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: "index",
				intersect: false,
			},
		},
	})

	await updateChart()
})
</script>
