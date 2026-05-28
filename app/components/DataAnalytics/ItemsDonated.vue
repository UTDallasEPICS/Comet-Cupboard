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
		<canvas ref="barContainer"/>
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

// const updateChart = async () => {
//     if (!modelValue.value.start || !modelValue.value.end) return
// }

const { data: sources } = await useFetch("/api/head-admin/data/source")

const chartContainer = useTemplateRef("barContainer")

const aggregatedData = computed(() => {
	if (!sources.value) return []

	const data = sources.value.flatMap((source) => {
		return source.ItemCountChanges.map((change) => ({
			sourceName: source.name,
			categoryName: change.Item.categoryName,
			amountChanged: change.amountChanged,
		}))
	})

	const total = {}
	for (const dict of data) {
		if (!(dict.sourceName in total)) {
			total[dict.sourceName] = {}
		}
		if (!(dict.categoryName in total[dict.sourceName])) {
			total[dict.sourceName][dict.categoryName] = dict.amountChanged
		} else {
			total[dict.sourceName][dict.categoryName] += dict.amountChanged
		}
	}

	return total
})

const chartData = computed(() => {
	const categories = [...new Set(Object.values(aggregatedData.value).flatMap((obj) => Object.keys(obj)))]

	const datasets = Object.entries(aggregatedData.value).map(([sourceNames, categoryMap]) => ({
		label: sourceNames,
		data: categories.map((cat) => categoryMap[cat] || 0),
	}))

	return {
		labels: categories,
		datasets,
	}
})

function addData(chart, labels, newData, sourceColors) {
	chart.data.labels = labels
	chart.data.datasets = [
		{
			data: newData,
			hoverBorderColor: "black",
			hoverBorderWidth: 2,
			borderColor: sourceColors.map(c => c[0]),
			backgroundColor: sourceColors.map(c => c[1]),
		},
	]
	chart.update()
}

function updateConfigByMutating(chart, title, showLegend) {
    chart.options.plugins.title.text = title
	chart.options.plugins.legend.display = showLegend
    chart.update();
}

function resetToOriginal(chart, categories, originalSourcesData){
	chart.data.labels = categories
	chart.data.datasets = originalSourcesData
	chart.update()
}

function wipeData(chart) {
	chart.data.labels = []
	chart.data.datasets = []
	chart.update()
}

function resetChart() {
	wipeData(chart.value)
	updateConfigByMutating(chart.value, 'Source Contributions')
	resetToOriginal(chart.value, originalCategoryLabels, originalSourcesData)
	chart.value.update()
	drilledDown.value = false
}

const chart = shallowRef(null)
const originalCategoryLabels = chartData.value.labels
const originalSourcesData = chartData.value.datasets
const drilledDown = ref(false)

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: chartData.value.labels,
			datasets: chartData.value.datasets,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: "Source Contributions",
				},
			},
			responsive: true,
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, categoryLabel, chart) {
				if (drilledDown.value) return
				
				const clickedCategoryName = chartData.value.labels[categoryLabel[0].index]

				const sourceColors = chart.data.datasets.map((dataset) =>{
					return [
						dataset.borderColor,
						dataset.backgroundColor,
					]
				})

				wipeData(chart)

				const sourceNames = Object.entries(aggregatedData.value).map(([sourceName, categoryMap]) => {
					return sourceName
				})

				const sourceCategoryQty = Object.entries(aggregatedData.value).map(([sourceName, categoryMap]) => {
					if (Object.keys(categoryMap).includes(clickedCategoryName)) return categoryMap[clickedCategoryName]
					else return 0
				})

				addData(chart, sourceNames, sourceCategoryQty, sourceColors)
				updateConfigByMutating(chart, clickedCategoryName, false)
				drilledDown.value = true
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
})
</script>
