<template>
    	<div>
			<canvas ref="barContainer"></canvas>

        <button v-if="drilledDown" class="border border-solid rounded-lg px-3 py-1" style="cursor: pointer;" @click="resetChart">Back</button>
        </div>
</template>

<script lang='ts' setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const itemData = ref()
const chart = shallowRef<Chart | null>(null)
const chartContainer = useTemplateRef("barContainer")
const drilledDown = ref(false)
const clickedCategory = ref<string | null>(null)
const overviewState = shallowRef<{ labels: string[]; datasets: { label: string; data: number[] }[] }>({
	labels: [],
	datasets: [],
})

const updateChart = async () => {
	const currentInventoryData = await $fetch('/api/head-admin/data/category')

	const categories = Object.keys(currentInventoryData)

	const itemsInCategory = Object.values(currentInventoryData)

	itemData.value = currentInventoryData

	const itemQty = itemsInCategory.map((categoryItem) => {
		return Object.values(categoryItem).reduce((sum, qty) => {
			return sum + qty
		}, 0)
	})

	overviewState.value = {
		labels: categories,
		datasets: [
			{
				label: "Current Inventory",
				data: itemQty,
				backgroundColor: categories.map(c => getCategoryColor(c))
			}
		]
	}

	chart.value.data.labels = overviewState.value.labels
	chart.value.data.datasets = overviewState.value.datasets
	chart.value.update()
}

const showDrillDownView = (categoryName: string) => {
	if (!chart.value) return

	const categoryItems = itemData.value[categoryName]

	const drilledDownLabels = Object.keys(categoryItems)

	chart.value.data.labels = drilledDownLabels
	chart.value.data.datasets = [
		{
			label: `${categoryName} Inventory`,
			data: Object.values(categoryItems),
			backgroundColor: getItemColor(categoryName)
		},
	]
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
	chart.value.options.plugins.title.display = false
	chart.value.update()
}

onMounted(async() => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: [],
			datasets: [
				{
					data: [],
					hoverBorderColor: 'black',
					hoverBorderWidth: 2,
				},
			],
		},
		plugins: [topLabelPlugin], 
		options: {
			plugins:{
				legend:{
					display: false
				},
				title:{
					display: false
				}
			},
			responsive: true,
			
			onHover(event, chartElement){
				chartContainer.value.style.cursor = chartElement[0] ? 'pointer' : 'default'
			},

			onClick(event, elements) {
				if (drilledDown.value) return
				if (!elements.length) return

				const clickedCategoryName = overviewState.value.labels[elements[0].index]

				clickedCategory.value = clickedCategoryName
				drilledDown.value = true
				showDrillDownView(clickedCategoryName)
			},
		}
	})
	
	await updateChart()
})
</script>