<template>
	<div>
		<div class="flex items-center justify-end">
			<div class="justify-left mr-2 flex flex-col gap-1">
				<p class="text-right text-sm">Time Level</p>
				<USelect v-model="grouping" :items="['Day', 'Week', 'Month', 'Semester']" class="w-28" />
			</div>

			<div class="flex flex-col justify-center gap-1">
				<p class="text-right text-sm">Time Range</p>

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
		<canvas ref="lineContainer"/>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js"
import { Chart } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const grouping = ref("Day")
const inputDate = useTemplateRef("inputDate")
const df = new DateFormatter("en-US", { month: "short", day: "numeric" })
const dfMonth = new DateFormatter("en-US", { month: "short" })
const tz = getLocalTimeZone()
const initialEnd = today(tz)

const chartContainer = useTemplateRef("lineContainer")

const chart = shallowRef<Chart | null>(null)

const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	const totalVisitorData = await $fetch("/api/head-admin/data/visitor", {
		query:{
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		}
	})
	console.log("totalVisitorData: ", totalVisitorData)

	const uniqueVisitorData = await $fetch("/api/head-admin/data/uniqueVisits", {
		query: {
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	const dates = Object.keys(totalVisitorData).map(formatLabel)

	const totalVisitors = Object.values(totalVisitorData)

	const uniqueVisitors = Object.values(uniqueVisitorData)

	if (!chart.value) return

	chart.value.data.labels = dates

	chart.value.data.datasets[0].data = totalVisitors

	chart.value.data.datasets[1].data = uniqueVisitors

	chart.value.update()
}

watch([modelValue, grouping], () =>{
	if (!modelValue.value.start || !modelValue.value.end) return
	updateChart()
})

// watch(modelValue, () => {
// 	if (!modelValue.value.start || !modelValue.value.end) return
// 	const start = modelValue.value.start.toDate(tz)
// 	const end = modelValue.value.end.toDate(tz)
// 	const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

// 	if (diffDays <= 30) {
// 		grouping.value = "Day"
// 	} else if (diffDays <= 90) {
// 		grouping.value = "Week"
// 	} else {
// 		grouping.value = "Month"
// 	}
// }

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
			interaction: {
				mode: "index",
				intersect: false,
			},
		},
	})
	
	await updateChart()
})
</script>
