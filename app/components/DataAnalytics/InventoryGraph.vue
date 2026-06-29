<template>
	<div>
		<div class="mb-4 flex items-center justify-between">
			<h1 class="text-4xl font-bold text-black">Current Inventory</h1>

			<DataAnalyticsOptionButton :show-time-level="false" :show-date-range="false">
				<div class="flex flex-col p-4">
					<div class="justify-left my-2 flex flex-col">
						<USwitch v-model="showCount" label="Show by count" class="my-2" />
						<USwitch v-model="sortByCount" label="Sort by count" />
					</div>
				</div>
			</DataAnalyticsOptionButton>
		</div>
	</div>
	<div class="mt-4 flex min-h-32 w-full items-center justify-center rounded-3xl border bg-white">
		<DataAnalyticsDataCardComponent v-if="!drilledDown" title="Total Inventory" :value="totalInventory" />
		<DataAnalyticsDataCardComponent v-if="drilledDown" title="Total Count" :value="itemCount" />
	</div>
	<div class="mt-10 flex flex-row gap-10">
		<DataAnalyticsVerticalDataComponent v-if="!drilledDown" title="Category Quantity" :items="sortedCategories" />
		<DataAnalyticsVerticalDataComponent v-if="drilledDown" title="Item Concentration" :items="itemConcentration" />
		<div class="min-h-140 w-full min-w-0">
			<button v-if="drilledDown" class="absolute rounded-lg border border-solid px-3 py-1 m-4" style="cursor: pointer" @click="resetChart">Back</button>
			<div class="h-full w-full border border-gray-300 px-8">
				<canvas ref="barContainer" class="mt-4" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from "chart.js"
import { Chart, RadialLinearScale, PointElement, LineElement, Filler } from "chart.js/auto"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const inventoryData = ref<Record<string, Record<string, number>>>({})
const selectedCategory = ref<string | null>(null)

const chart = shallowRef<Chart | null>(null)
const chartContainer = useTemplateRef("barContainer")

const overviewState = shallowRef<{ labels: string[]; datasets: { label: string; data: number[] }[] }>({
	labels: [],
	datasets: [],
})
const drilledDown = ref(false)
const showCount = ref(false)
const sortByCount = ref(false)

const updateChart = async () => {
	inventoryData.value = await $fetch("/api/head-admin/data/category")

	const entries = Object.entries(inventoryData.value).map(([label, items]) => ({
		label,
		value: Object.values(items).reduce((sum, qty) => sum + qty, 0),
	}))

	const sortedEntries = sortByCount.value ? [...entries].sort((a, b) => a.value - b.value) : entries

	overviewState.value = {
		labels: sortedEntries.map((e) => e.label),
		datasets: [
			{
				label: "Current Inventory",
				data: sortedEntries.map((e) => e.value),
				backgroundColor: sortedEntries.map((e) => getCategoryColor(e.label)),
			},
		],
	}

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.title.text = "Category View"
	chart.value.update()
}

watch(sortByCount, () => {
	if (drilledDown.value) {
		showDrillDownView(selectedCategory.value)
	} else {
		updateChart()
	}
})

const sortedCategories = computed(() => {
	return Object.entries(inventoryData.value)
		.map(([category, items]) => ({
			label: category,
			value: Object.values(items).reduce((sum, qty) => {
				return sum + qty
			}, 0),
		}))
		.sort((a, b) => b.value - a.value)
})

const totalInventory = computed(() => {
	return Object.values(inventoryData.value)
		.flatMap((items) => Object.values(items))
		.reduce((sum, qty) => sum + qty, 0)
})

const currentCategoryItems = computed(() => {
	if (!selectedCategory.value) return {}

	return inventoryData.value[selectedCategory.value] ?? {}
})

const itemCount = computed(() => {
	return Object.values(currentCategoryItems.value).reduce((sum, qty) => {
		return sum + qty
	}, 0)
})

const itemConcentration = computed(() => {
	if (!itemCount.value) return []

	return Object.entries(currentCategoryItems.value)
		.map(([label, value]) => ({ label, value }))
		.sort((a, b) => b.value - a.value)
		.map(({ label, value }) => ({
			label,
			value: showCount.value ? value.toString() : ((value / itemCount.value) * 100).toFixed(1) + "%",
		}))
})

const showDrillDownView = (categoryName: string) => {
	if (!chart.value) return

	const categoryItems = inventoryData.value[categoryName]

	const entries = Object.entries(categoryItems).map(([label, value]) => ({
		label,
		value: value,
	}))

	if (sortByCount.value) {
		entries.sort((a, b) => a.value - b.value)
	}

	chart.value.data.labels = entries.map((e) => e.label)

	chart.value.data.datasets = [
		{
			label: `${categoryName} Inventory`,
			data: entries.map((e) => e.value),
			backgroundColor: getItemColor(categoryName),
		},
	]

	chart.value.options.plugins.title = {
		display: true,
		text: categoryName + " Items",
		...titleOptions,
	}
	chart.value.update()
}

const resetChart = () => {
	if (!chart.value) return

	drilledDown.value = false

	selectedCategory.value = null

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.options.plugins.title = {
		display: true,
		text: "Category View",
		...titleOptions,
	}
	chart.value.update()
}

const titleOptions = {
	color: "#000000",
	font: {
		size: 30,
		weight: "bold",
	},
	padding: {
		top: 10,
		bottom: 40,
	},
}

onMounted(async () => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: [],
			datasets: [
				{
					data: [],
					hoverBorderColor: "black",
					hoverBorderWidth: 2,
				},
			],
		},
		plugins: [topLabelPlugin],
		options: {
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					...titleOptions,
				},
			},
			responsive: true,
			onHover(event, chartElement) {
				chartContainer.value.style.cursor = chartElement[0] ? "pointer" : "default"
			},

			onClick(event, elements) {
				if (drilledDown.value) return
				if (!elements.length) return

				const selectedCategoryName = overviewState.value.labels[elements[0].index]

				selectedCategory.value = selectedCategoryName
				drilledDown.value = true
				showDrillDownView(selectedCategoryName)
			},
		},
	})

	await updateChart()
})
</script>
