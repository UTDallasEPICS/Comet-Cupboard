<template>
	<div>
		<!-- <div class="flex justify-center">
			<div class="flex items-center justify-center bg-final-utd-orange min-w-2/3 min-h-auto rounded-b-lg">
				<h1 class="text-4xl font-bold mb-2 text-white">{{ currentView }}</h1>
			</div>
		</div> -->

		<div class="flex gap-10">
			<div :class="['flex min-h-screen shrink-0 flex-col border-r border-gray-400 shadow-xl', sidebarOpen ? 'w-48' : 'w-12']">
				<UCollapsible :open="sidebarOpen" class="flex w-full flex-col">
					<div class="group flex h-12 items-center">
						<span v-if="sidebarOpen" class="px-2">Data Pages</span>
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
							key="Items Donated"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-package-plus"
							class="h-12 w-full justify-center"
							@click="currentView = 'Items Donated'"
						>
						</UButton>
						<UButton
							key="Items Distributed"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-package-plus"
							class="h-12 w-full justify-center"
							@click="currentView = 'Items Distributed'"
						>
						</UButton>
						<UButton
							key="Inventory"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-boxes"
							class="h-12 w-full justify-center"
							@click="currentView = 'Inventory'"
						>
						</UButton>
						<UButton
							key="Source Contribution"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-building"
							class="h-12 w-full justify-center"
							@click="currentView = 'Source Contribution'"
						>
						</UButton>
						<UButton
							key="Visitors"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-users-round"
							class="h-12 w-full justify-center"
							@click="currentView = 'Visitors'"
						>
						</UButton>
						<UButton
							key="Audit Log"
							color="neutral"
							variant="ghost"
							leading-icon="i-lucide-clipboard-clock"
							class="h-12 w-full justify-center"
							@click="currentView = 'Audit Log'"
						>
						</UButton>
					</template>
					<template #content>
						<div class="flex flex-row">
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
