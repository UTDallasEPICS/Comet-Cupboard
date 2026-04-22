<template>
	<div class="p-4">
		<div class="flex flex-row gap-x-4">
			<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (navigateData = dataPage)" />
		</div>
		
		<div class="chart-container" style="position: relative; height: auto; width: 100%;">
			<canvas ref="barContainer" style="cursor: pointer;"></canvas>
    	</div>

		<button style="cursor: pointer;" @click="resetChart">Back</button>

	</div>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
import {ref} from 'vue'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { data: categories} = await useFetch('/api/head-admin/data/category')

const chartContainer = useTemplateRef("barContainer")

const labelName = computed(() => {
	if (categories.value){
		return categories.value.map(c => c.name)
	} else {
		return []
	}
})

const categoryItemQty = computed (() =>{
	if (categories.value){
		return categories.value.map(cat => cat.Items.length)
	}else{
		return []
	}
})

const categoryItemList = categories.value.flatMap(category =>{
	return category.Items.map(item => {
		return {
			categoryName: category.name,
			itemName: item.name,
			itemQty: item.quantity,
		}
	})
})

function addData(chart, labels, newData) {
    chart.data.labels = labels
    chart.data.datasets = [{					
					label: 'Total Inventory Category Count',
					data: newData,
					hoverBorderColor: 'black',
					hoverBorderWidth: 2,
					backgroundColor: [
						'#86ADDC',
						'#B0E4C8',
						'#BDE8F8',
						'#C6DEDB',
						'#DCEBF2',
						'#EECCDD',
						'#EFBCB3',
						'#FAFAD4',
						'#FEDBCF',
						'#FF9D93',
						'#FFBD81',
						'#FBD873',
					]}]
    chart.update();
}

function wipeData(chart){
	chart.data.labels = []
	chart.data.datasets = []
	chart.update()
}

const chart = shallowRef(null)
const originalCategoryLabels = labelName.value
const originalCategoryData = categoryItemQty.value
let inItemChart = ref(false)

function resetChart(){
	wipeData(chart.value)
	addData(chart.value, originalCategoryLabels, originalCategoryData)
	chart.value.update()
	inItemChart.value = false
}

onMounted(() => {
	chart.value = new Chart(chartContainer.value!, {
		type: "bar",
		data: {
			labels: labelName.value,
			datasets: [
				{
					label: 'Total Inventory Count',
					data: originalCategoryData,
					hoverBorderColor: 'black',
					hoverBorderWidth: 2,
					backgroundColor: [
						'#86ADDC',
						'#B0E4C8',
						'#BDE8F8',
						'#C6DEDB',
						'#DCEBF2',
						'#EECCDD',
						'#EFBCB3',
						'#FAFAD4',
						'#FEDBCF',
						'#FF9D93',
						'#FFBD81',
						'#FBD873',
					],
				},
			],
		},
		options: {
			responsive: true,
			
			onHover(event, chartElement){
				chartContainer.value.style.cursor = chartElement[0] ? 'pointer' : 'default'
			},

			onClick(event, categoryLabel, chart) {
				const clickedCategoryName = chart.data.labels[categoryLabel[0].index]
				const itemsInCategory = categoryItemList.filter(item => item.categoryName === clickedCategoryName)

				if (inItemChart.value) return
				wipeData(chart)

				const itemNames = itemsInCategory.map((item) => {
					return item.itemName
				})

				const itemQuantity = itemsInCategory.map((item) => {
					return item.itemQty
				})

				addData(chart, itemNames, itemQuantity)
				inItemChart.value = true
			},
		}
	})
})
</script>