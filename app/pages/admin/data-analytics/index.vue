<template>
	<div class="p-4">
		<div class="flex flex-row gap-x-4">
			<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (currentView = dataPage)" />
		</div>
		
		<div>
			<InventoryGraph v-if="currentView === 'inventory'"></InventoryGraph>
			<SourceContributionGraph v-else-if="currentView === 'sourceContribution'"></SourceContributionGraph>
			<VisitorsGraph v-else-if="currentView === 'visitors'"></VisitorsGraph>
		</div>

	</div>
</template>

<script lang="ts" setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
import { Chart, RadialLinearScale, PointElement, LineElement, Filler,} from "chart.js/auto"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const currentView = 'visitors'

</script>