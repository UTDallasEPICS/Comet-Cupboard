<template>
	<div>
		<canvas ref="barContainer"></canvas>
	</div>
</template>

<script lang='ts' setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { data: sources } = await useFetch('/api/head-admin/data/source')

const chartContainer = useTemplateRef("barContainer")

const chart = shallowRef(null)

const chartData = computed(() => {
	if (!sources.value) return []

	const data = sources.value.flatMap(source => {
		return source.ItemCountChanges.map(change => ({
			sourceName: source.name,
			categoryName: change.Item.categoryName,
			amountChanged: change.amountChanged,
		}))
	})

	let total = {}
	for (const dict of data){
		if(!(dict.sourceName in total)){
			total[dict.sourceName] = {}
		}
		if(!(dict.categoryName in total[dict.sourceName])){
				total[dict.sourceName][dict.categoryName] = dict.amountChanged
		} else {
			total[dict.sourceName][dict.categoryName] += dict.amountChanged
		}
	}

	const categories = [...new Set(
		Object.values(total).flatMap(obj => Object.keys(obj))
	)]

	const datasets = Object.entries(total).map(([sourceNames, categoryMap]) => ({
		label: sourceNames,
		data: categories.map(cat => categoryMap[cat] || 0)
	}))

	return {
		labels: categories,
		datasets
	}
})

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: 'bar',
		data: {
			labels: chartData.value.labels,
			datasets: chartData.value.datasets,
		},
		options: {
			plugins: {
				title: {
					display: true,
					text: 'Source Contributions'
				},
			},
			responsive:true,
			scales: {
				x: {
					stacked: true
				},
				y:{
					stacked: true
				}
			}
		}
	})
})
</script>