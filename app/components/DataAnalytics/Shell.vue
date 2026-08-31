<template>
	<NuxtLayout name="main" :title="title" :back-navigation="{ text: 'Back to Management', to: '/head-admin' }">
		<section class="space-y-6">
			<div class="space-y-3 border-b border-gray-200 pb-2">
				<div>
					<SharedTextBaseSecondary class="text-xs font-medium tracking-wide text-gray-500 uppercase">Base Tables</SharedTextBaseSecondary>
					<nav class="mt-1 flex gap-1 overflow-x-auto" aria-label="Base table pages">
						<SharedButtonActionButton
							v-for="item in baseTableNavigation"
							:key="item.to"
							:to="item.to"
							:leading-icon="item.icon"
							:text="item.label"
							action="neutral"
							:button-variant="route.path === item.to ? 'soft' : 'ghost'"
							size="sm"
							class="shrink-0"
						/>
					</nav>
				</div>
				<div>
					<SharedTextBaseSecondary class="text-xs font-medium tracking-wide text-gray-500 uppercase">Derived Analytics</SharedTextBaseSecondary>
					<nav class="mt-1 flex gap-1 overflow-x-auto" aria-label="Derived analytics pages">
						<SharedButtonActionButton
							v-for="item in derivedAnalyticsNavigation"
							:key="item.to"
							:to="item.to"
							:leading-icon="item.icon"
							:text="item.label"
							action="neutral"
							:button-variant="route.path === item.to ? 'soft' : 'ghost'"
							size="sm"
							class="shrink-0"
						/>
					</nav>
				</div>
			</div>
			<slot />
		</section>
	</NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()

const route = useRoute()
const baseTableNavigation = [
	{ label: "Inventory", icon: "i-lucide-boxes", to: "/head-admin/data-analytics/inventory" },
	{ label: "Items In", icon: "i-lucide-package-plus", to: "/head-admin/data-analytics/items-in" },
	{ label: "Items Out", icon: "i-lucide-package-minus", to: "/head-admin/data-analytics/items-out" },
	{ label: "Audit Log", icon: "i-lucide-clipboard-clock", to: "/head-admin/data-analytics/audit-log" },
]
const derivedAnalyticsNavigation = [
	{ label: "Visits", icon: "i-lucide-users-round", to: "/head-admin/data-analytics/visits" },
	{ label: "Source Contribution", icon: "i-lucide-building-2", to: "/head-admin/data-analytics/sources" },
	{ label: "Demand Trends", icon: "i-lucide-trending-up", to: "/head-admin/data-analytics/demand-trends" },
]
</script>
