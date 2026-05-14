<template>
	<div>
		<div class="flex justify-center">
			<div class="flex items-center justify-center bg-orange-400 w-2/3 h-15 rounded-b-lg">
				<h1 class="text-4xl font-bold text-white">{{ currentView }}</h1>
			</div>
		</div>
		
		<div class="p-4 flex gap-10">
			<div class="flex flex-row gap-x-4 gap-y-2">
				<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (currentView = dataPage)" />
			</div>	

			<div class="w-full h-full">
				<InventoryGraph v-if="currentView === 'inventory'"/>
				<SourceContributionGraph v-else-if="currentView === 'sourceContribution'"/>
				<VisitorsGraph v-else-if="currentView === 'visitors'"/>
			</div>
		</div>

	</div>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
import InventoryGraph from './components/InventoryGraph.vue'
import SourceContributionGraph from './components/SourceContributionGraph.vue'
import VisitorsGraph from './components/VisitorsGraph.vue'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const currentView = ref('inventory')

if (currentView.value === 'inventory'){
	currentView.value = 'inventory'
} else if (currentView.value === 'sourceContribution'){
	currentView.value = 'sourceContribution'
} else if (currentView.value === 'visitors'){
	currentView.value = 'visitors'
}

</script>