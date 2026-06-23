<template>
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-4xl font-bold text-black">Source Contribution</h1>

			<DataAnalyticsOptionButton :date-range="displayRange" :show-time-level="false" :show-date-range="true">
				<div class="flex flex-col p-4">
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
						<div class="justify-left my-2 flex flex-col">
							<USwitch v-model="showCount" label="Show by count" class="my-2" />
							<USwitch v-model="sortByCount" label="Sort by count" />
						</div>
					</div>
				</div>
			</DataAnalyticsOptionButton>
		</div>
	</div>
	<div class="mt-5 flex min-h-32 w-full items-center justify-center rounded-lg bg-white shadow-2xl">
		<DataAnalyticsDataCardComponent title="Total Source Contributions" :value="totalSourceContributions" />
		<!-- <DataAnalyticsDataCardComponent v-if="!drilledDown" title="Average Contribution Size" :value="totalInventory" /> -->
	</div>
	<div>
		<div class="mt-10 flex flex-row gap-10">
			<DataAnalyticsVerticalDataComponent title="Source Share %" :items="sourceContributionShare" />
			<div class="min-h-140 w-full min-w-0">
				<button v-if="drilledDown" class="absolute rounded-lg border border-solid px-3 py-1" style="cursor: pointer" @click="resetChart">Back</button>
				<canvas ref="barContainer" class="mt-4" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from "chart.js"
import { Chart, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js/auto"
import { DateFormatter, getLocalTimeZone, today } from "@internationalized/date"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const inputDate = useTemplateRef("inputDate")
const tz = getLocalTimeZone()
const initialEnd = today(tz)

const modelValue = shallowRef({
	start: initialEnd.subtract({ days: 14 }),
	end: initialEnd,
})

const sourceData = ref<Record<string, Record<string, number>>>({})
const selectedCategory = ref<string | null>(null)

const chartContainer = useTemplateRef("barContainer")
const chart = shallowRef(null)

const overviewState = shallowRef({
	labels: [],
	datasets: [],
})
const drilledDown = ref(false)
const showCount = ref(false)
const sortByCount = ref(false)

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	const sourceContributionData = await $fetch("/api/head-admin/data/source", {
		query: {
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	// stores api data
	sourceData.value = sourceContributionData

	console.log(sourceData.value)
	console.log(sourceTotals.value)
	console.log(sourceContributionShare.value)
	console.log("currentCategoryData: ", currentCategoryData.value)

	// builds overview x-axis labels (categories)
	const categories = [...new Set(Object.values(sourceContributionData).flatMap(Object.keys))]

	// build sources for stack
	const sources = Object.keys(sourceContributionData)

	const datasets = sources.map((source) => ({
		label: source,
		data: categories.map((category) => sourceContributionData[source][category] || 0),
		backgroundColor: getSourceColor(source)[0],
		borderColor: getSourceColor(source)[1],
		borderWidth: 2,
		fill: false,
	}))

	// save overview chart
	overviewState.value = {
		labels: categories,
		datasets,
	}

	if (drilledDown.value && selectedCategory.value) {
		showDrillDownView(selectedCategory.value)
	} else {
		chart.value.data.labels = overviewState.value.labels
		chart.value.data.datasets = overviewState.value.datasets
		chart.value.update()
	}
}

watch(modelValue, () => {
	if (!modelValue.value.start || !modelValue.value.end) return
	updateChart()
})

watch(sortByCount, () => {
	if (drilledDown.value) {
		showDrillDownView(selectedCategory.value)
	} else {
		updateChart()
	}
})

const currentCategoryData = computed(() => {
	if (!selectedCategory.value) return {}

	return Object.entries(sourceData.value).reduce((acc, [sourceName, categories]) => {
		acc[sourceName] = categories[selectedCategory.value] ?? 0
		return acc
	}, {})
})

const sourceTotals = computed(() => {
	if (!selectedCategory.value) {
		return Object.entries(sourceData.value).reduce((acc, [sourceName, categories]) => {
			acc[sourceName] = Object.values(categories).reduce((sum, qty) => sum + qty, 0)
			return acc
		}, {})
	}

	return currentCategoryData.value
})

const sourceContributionShare = computed(() => {
	if (!totalSourceContributions.value) return []

	return Object.entries(sourceTotals.value)
		.map(([label, value]) => ({ label, value }))
		.sort((a, b) => b.value - a.value)
		.map(({ label, value }) => ({
			label,
			value: showCount.value ? value.toString() : ((value / totalSourceContributions.value) * 100).toFixed(1) + "%",
		}))
})

const totalSourceContributions = computed(() => {
	if (!selectedCategory.value) {
		return Object.values(sourceData.value)
			.flatMap((category) => Object.values(category))
			.reduce((sum, qty) => sum + qty, 0)
	}

	return Object.values(currentCategoryData.value).reduce((sum, qty) => sum + qty, 0)
})

// const averageContributionSize = computed (() => {
// 	return
// })

const showDrillDownView = (categoryName: string) => {
	if (!chart.value) return

	const entries = Object.entries(sourceData.value)
		.map(([sourceName, categoryData]) => ({
			sourceName,
			value: categoryData[categoryName] ?? 0,
		}))
		.filter((entry) => entry.value > 0)

	if (sortByCount.value) {
		entries.sort((a, b) => a.value - b.value)
	}

	chart.value.data.labels = entries.map((e) => e.sourceName)
	chart.value.data.datasets = [
		{
			label: categoryName,
			data: entries.map((e) => e.value),
			backgroundColor: entries.map((e) => getSourceColor(e.sourceName)[0]),
			borderColor: entries.map((e) => getSourceColor(e.sourceName)[1]),
			fill: false,
		},
	]
	chart.value.options.plugins.legend.display = false
	chart.value.options.plugins.title = {
		display: true,
		text: categoryName,
	}
	chart.value.update()
}

const resetChart = () => {
	if (!chart.value) return

	drilledDown.value = false

	selectedCategory.value = null

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.legend.display = true
	chart.value.options.plugins.title.display = false
	chart.value.update()
}

const displayRange = computed(() => {
	const { start, end } = modelValue.value

	if (!start || !end) return ""

	return `${start.month}/${start.day}/${start.year} - ${end.month}/${end.day}/${end.year}`
})

onMounted(async () => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: [],
			datasets: [],
		},
		plugins: [stackedTopLabelPlugin],
		options: {
			plugins: {
				legend: {
					display: true,
				},
				title: {
					display: false,
				},
			},
			responsive: true,
			maintainAspectRatio: false,
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, elements) {
				if (drilledDown.value) return
				if (!elements.length) return

				const clickedCategoryName = overviewState.value.labels[elements[0].index]

				selectedCategory.value = clickedCategoryName
				drilledDown.value = true
				showDrillDownView(clickedCategoryName)
			},
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				},
			},
		},
	})

	await updateChart()
})
</script>
