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
		<canvas ref="barContainer" />
	</div>

	<div>
		<button v-if="firstDrillDown || secondDrillDown" class="rounded-lg border border-solid px-3 py-1" style="cursor: pointer" @click="resetChart">
			Back
		</button>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from "chart.js"
import { Chart, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const grouping = ref("Day")
const inputDate = useTemplateRef("inputDate")
const df = new DateFormatter("en-US", { month: "short", day: "numeric" })
const dfMonth = new DateFormatter("en-US", { month: "short" })
const tz = getLocalTimeZone()
const initialEnd = today(tz)

const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const data = ref({})
const chartContainer = useTemplateRef("barContainer")
const chart = shallowRef(null)
const firstDrillDown = ref(false)
const secondDrillDown = ref(false)
const selectedTimeLevel = ref<string | null>(null)
const clickedCategory = ref<string | null>(null)
const overviewState = shallowRef<{ labels: string[]; datasets: { data: number[] }[] }>({
	labels: [],
	datasets: [],
})

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	firstDrillDown.value = false
	secondDrillDown.value = false
	selectedTimeLevel.value = null
	clickedCategory.value = null

	const itemsDistributedData = await $fetch("/api/head-admin/data/itemsOut", {
		query: {
			timeLevel: grouping.value,
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	data.value = itemsDistributedData

	const formatted = {}
	Object.entries(itemsDistributedData).forEach(([key, value]) => {
		formatted[formatLabel(key)] = value
	})
	data.value = formatted

	const dateLabels = Object.keys(itemsDistributedData).map(formatLabel)

	const distributions = Object.values(itemsDistributedData)

	const distributedQty = distributions.map((date) => {
		return Object.values(date).reduce((sum: number, category: any) => {
			return sum + category.total
		}, 0)
	})


	overviewState.value = {
		labels: dateLabels,
		datasets: [
			{
				data: distributedQty,
			},
		],
	}

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.title.text = "Items Distributed"
	chart.value.update()
}

watch([modelValue, grouping], () => {
	if (!modelValue.value.start || !modelValue.value.end) return
	updateChart()
})

const showCategoryDrillDownView = (date: string) => {
	if (!chart.value) return

	const categoryData = data.value[date]

	const categoryLabels = Object.keys(categoryData)
	const categoryValues = categoryLabels.map((cat) => {
		return categoryData[cat].total
	})

	chart.value.data.labels = categoryLabels
	if (grouping.value === "Day" || grouping.value === "Week") {
		chart.value.data.datasets = [
			{
				data: categoryValues,
				backgroundColor: categoryLabels.map(c => getCategoryColor(c)),
			},
		]
		chart.value.options.plugins.title.text = `Categories distributed on ${date}`
	} else {
		chart.value.data.datasets = [
			{
				data: categoryValues,
				backgroundColor: categoryLabels.map(c => getCategoryColor(c)),
			},
		]
		chart.value.options.plugins.title.text = `Categories distributed in ${date}`
	}
	chart.value.update()
}

const showItemDrillDownView = (category: string) => {
	if (!chart.value) return

	const itemData = data.value[selectedTimeLevel.value][category].items

	const itemLabels = Object.keys(itemData)
	const itemValues = Object.values(itemData)

	chart.value.data.labels = itemLabels
	if (grouping.value === "Day" || grouping.value === "Week") {
		chart.value.data.datasets = [
			{
				data: itemValues,
				backgroundColor: getItemColor(category),
			},
		]
		chart.value.options.plugins.title.text = `${category} distributed on ${selectedTimeLevel.value}`
	} else {
		chart.value.data.datasets = [
			{
				data: itemValues,
				backgroundColor: getItemColor(category),
			},
		]
		chart.value.options.plugins.title.text = `${category} distributed in ${selectedTimeLevel.value}`
	}
	chart.value.update()
}

const resetChart = () => {
	if (!chart.value) return

	if (secondDrillDown.value) {
		secondDrillDown.value = false
		clickedCategory.value = null
		showCategoryDrillDownView(selectedTimeLevel.value!)
		return
	}

	firstDrillDown.value = false
	selectedTimeLevel.value = null

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.update()
}

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
		type: "bar",
		data: {
			labels: [],
			datasets: [],
		},
		plugins: [topLabelPlugin],
		options: {
			scales: {
				y: {
					beginAtZero: true,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
				},
			},
			responsive: true,
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, elements) {
				if (secondDrillDown.value) return
				if (!elements.length) return

				if (firstDrillDown.value) {
					const clickedCategoryName = chart.value.data.labels[elements[0].index]
					clickedCategory.value = clickedCategoryName
					secondDrillDown.value = true
					showItemDrillDownView(clickedCategoryName)
				} else {
					const clickedTime = overviewState.value.labels[elements[0].index]
					selectedTimeLevel.value = clickedTime
					firstDrillDown.value = true
					showCategoryDrillDownView(clickedTime)
				}
			},
		},
	})

	await updateChart()
})
</script>
