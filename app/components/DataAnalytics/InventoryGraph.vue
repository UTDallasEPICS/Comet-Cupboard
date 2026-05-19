<template>
    	<div>
			<canvas ref="barContainer"></canvas>

        <button v-if="inItemChart" class="border border-solid rounded-lg px-3 py-1" style="cursor: pointer;" @click="resetChart">Back</button>
        </div>
</template>

<script lang='ts' setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { data: categories } = await useFetch('/api/head-admin/data/category')

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
		return categories.value.map(cat => {
			const categoryTotalQty = cat.Items.reduce((sum, item) => {
				return sum + item.quantity
			}, 0)
			return categoryTotalQty
		})
	} else {
		return []
	}
})

const categoryItemList = computed(() => {
  if (!categories.value) return []
  
  return categories.value.flatMap(category => {
    return category.Items.map(item => ({
      categoryName: category.name,
      itemName: item.name,
      itemQty: item.quantity,
    }))
  })
})

const baseColors = [
	'#86ADDC',
	'#B0E4C8',
	'#FF9D93',
]

function generateColor(index: number){
	const hue = (index * 137) % 360

	return `hsl(${hue}, 70%, 65%)`
}

const colors = categories.value.map((_, index) => {
	return baseColors[index] || generateColor(index)
})

function addData(chart, labels, newData) {
    chart.data.labels = labels
    chart.data.datasets = [{					
					data: newData,
					hoverBorderColor: 'black',
					hoverBorderWidth: 2,
					backgroundColor: colors,
				}]
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
const inItemChart = ref(false)

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
					data: originalCategoryData,
					hoverBorderColor: 'black',
					hoverBorderWidth: 2,
					backgroundColor: colors,
				},
			],
		},
		options: {
			plugins:{
				legend:{
					display: false
				}
			},
			responsive: true,
			
			onHover(event, chartElement){
				chartContainer.value.style.cursor = chartElement[0] ? 'pointer' : 'default'
			},

			onClick(event, categoryLabel, chart) {
				if (!categoryLabel.length) return
				if (inItemChart.value) return
				const clickedCategoryName = chart.data.labels[categoryLabel[0].index]
				const itemsInCategory = categoryItemList.value.filter(item => item.categoryName === clickedCategoryName)

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