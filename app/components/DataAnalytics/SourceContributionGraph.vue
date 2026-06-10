<template>
	<div>
		<div class="flex items-center justify-end">
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
		<button v-if="drilledDown" class="rounded-lg border border-solid px-3 py-1" style="cursor: pointer" @click="resetChart">Back</button>
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

const data = ref({})
const chartContainer = useTemplateRef("barContainer")
const chart = shallowRef(null)
const drilledDown = ref(false)
const clickedCategory = ref<string | null>(null)
const overviewState = shallowRef({
	labels: [],
	datasets: [],
})

const updateChart = async () => {
	if (!modelValue.value.start || !modelValue.value.end) return

	const sourceContributionData = await $fetch("/api/head-admin/data/source", {
		query: {
			startDate: modelValue.value.start ? modelValue.value.start.toDate(tz).toISOString() : undefined,
			endDate: modelValue.value.end ? modelValue.value.end.toDate(tz).toISOString() : undefined,
		},
	})

	// stores api data
	data.value = sourceContributionData

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

	if (drilledDown.value && clickedCategory.value) {
		showDrillDownView(clickedCategory.value)
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

const showDrillDownView = (categoryName: string) => {
	if (!chart.value) return

	const drilledDownLabels = Object.keys(data.value)

	const drilledDownData = Object.entries(data.value).map(([sourceName, categoryObject]) => {
		return categoryObject[categoryName] || 0
	})

	chart.value.data.labels = drilledDownLabels
	chart.value.data.datasets = [
		{
			label: categoryName,
			data: drilledDownData,
			backgroundColor: drilledDownLabels.map(s => getSourceColor(s)[0]),
			borderColor: drilledDownLabels.map(s => getSourceColor(s)[1]),
			fill: false
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

	clickedCategory.value = null

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.legend.display = true
	chart.value.options.plugins.title.display = false
	chart.value.update()
}

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
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, elements) {
				if (drilledDown.value) return
				if (!elements.length) return

				const clickedCategoryName = overviewState.value.labels[elements[0].index]

				clickedCategory.value = clickedCategoryName
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
