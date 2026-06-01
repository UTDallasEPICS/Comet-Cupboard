<template>
	<div>
		<div class="flex justify-center">
			<div class="flex items-center justify-center bg-final-utd-orange min-w-2/3 min-h-auto rounded-b-lg">
				<h1 class="text-4xl font-bold mb-2 text-white">{{ currentView }}</h1>
			</div>
		</div>
		
		<div class="p-4 flex gap-10">
			<div class="flex flex-row gap-x-4 gap-y-2">
				<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (currentView = dataPage)" />
			</div>	

			<div class="w-full h-full">
				<DataAnalyticsInventoryGraph v-if="currentView === 'Inventory'"/>
				<DataAnalyticsSourceContributionGraph v-else-if="currentView === 'Source Contribution'"/>
				<DataAnalyticsVisitorsGraph v-else-if="currentView === 'Visitors'"/>
				<DataAnalyticsItemsDonated v-else-if="currentView === 'Items Donated'"/>
				<DataAnalyticsItemsDistributed v-else-if="currentView === 'Items Distributed'"/>
			</div>
		</div>

	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const currentView = ref<'Inventory' | 'Source Contribution' | 'Visitors' | 'Items Donated' | 'Items Distributed'>('Inventory')
</script>