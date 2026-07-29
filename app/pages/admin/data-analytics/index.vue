<template>
	<div>
		<div class="flex">
			<div :class="['flex min-h-screen shrink-0 flex-col border-r border-gray-400 shadow-xl', sidebarOpen ? 'w-48' : 'w-12']">
				<UCollapsible :open="sidebarOpen" class="flex w-full flex-col">
					<div class="group flex h-12 items-center">
						<span v-if="sidebarOpen" class="px-2 text-lg font-bold">Data Pages</span>
						<div class="ml-auto flex w-12 justify-center">
							<UButton
								class="w-min"
								color="neutral"
								variant="ghost"
								trailing-icon="i-lucide-panel-left"
								:ui="{
									trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
								}"
								@click="sidebarOpen = !sidebarOpen"
							/>
						</div>
					</div>
					<template v-if="!sidebarOpen">
						<UButton
							key="Current Inventory"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-boxes"
							class="h-12 w-full justify-center"
							@click="currentView = 'Current Inventory'"
						/>
						<UButton
							key="Items Donated"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-package-plus"
							class="h-12 w-full justify-center"
							@click="currentView = 'Items Donated'"
						/>
						<UButton
							key="Items Distributed"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-package-minus"
							class="h-12 w-full justify-center"
							@click="currentView = 'Items Distributed'"
						/>
						<UButton
							key="Source Contribution"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-building"
							class="h-12 w-full justify-center"
							@click="currentView = 'Source Contribution'"
						/>
						<UButton
							key="Visitors"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-users-round"
							class="h-12 w-full justify-center"
							@click="currentView = 'Visitors'"
						/>
						<UButton
							key="Audit Log"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-clipboard-clock"
							class="h-12 w-full justify-center"
							@click="currentView = 'Audit Log'"
						/>
					</template>
					<template #content>
						<div class="flex flex-row">
							<DataAnalyticsNavigationList @update:navigate-data="(dataPage) => (currentView = dataPage)" />
						</div>
					</template>
				</UCollapsible>
			</div>

			<div class="mx-10 my-4 min-w-0 flex-1">
				<DataAnalyticsInventoryGraph v-if="currentView === 'Current Inventory'" />
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

const currentView = ref<"Current Inventory" | "Source Contribution" | "Visitors" | "Items Donated" | "Items Distributed">("Current Inventory")

const sidebarOpen = ref(true)
</script>
