<template>
	<div>
		<!-- <div class="flex justify-center">
			<div class="flex items-center justify-center bg-final-utd-orange min-w-2/3 min-h-auto rounded-b-lg">
				<h1 class="text-4xl font-bold mb-2 text-white">{{ currentView }}</h1>
			</div>
		</div> -->

		<div class="flex gap-10">
			<div :class="['flex min-h-screen flex-col border-r border-gray-400 shadow-xl', sidebarOpen ? 'w-64' : 'w-8']">
				<UCollapsible v-model:open ="sidebarOpen" class="flex flex-col w-full gap-2">
					<UButton
						class="group"
						color="neutral"
						variant="ghost"
						trailing-icon="i-lucide-panel-left"
						:ui="{
							trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
						}"
						block
					/>

					<template #content>
						<div class="flex flex-row gap-x-4 gap-y-2">
							<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (currentView = dataPage)" />
						</div>
					</template>
				</UCollapsible>
			</div>

			<div class="h-full w-full">
				<DataAnalyticsInventoryGraph v-if="currentView === 'Inventory'" />
				<DataAnalyticsSourceContributionGraph v-else-if="currentView === 'Source Contribution'" />
				<DataAnalyticsVisitorsGraph v-else-if="currentView === 'Visitors'" />
				<DataAnalyticsItemsDonated v-else-if="currentView === 'Items Donated'" />
				<DataAnalyticsItemsDistributed v-else-if="currentView === 'Items Distributed'" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, elements } from "chart.js"
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const currentView = ref<"Inventory" | "Source Contribution" | "Visitors" | "Items Donated" | "Items Distributed">("Inventory")

const sidebarOpen = ref(false)
</script>
