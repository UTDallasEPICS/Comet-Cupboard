<template>
	<NuxtLayout name="main" :title="title" :back-navigation="{ text: 'Back to Management', to: '/head-admin' }">
		<section class="space-y-6">
			<nav class="flex gap-1 overflow-x-auto border-b border-gray-200 pb-2" aria-label="Data analytics pages">
				<SharedButtonActionButton
					v-for="item in navigation"
					:key="item.to"
					:to="item.to"
					:icon="item.icon"
					:label="item.label"
					color="neutral"
					:variant="route.path === item.to ? 'soft' : 'ghost'"
					size="sm"
					class="shrink-0"
				/>
			</nav>
			<slot />
		</section>
	</NuxtLayout>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()

const route = useRoute()
const navigation = [
	{ label: "Inventory", icon: "i-lucide-boxes", to: "/head-admin/data-analytics/inventory" },
	{ label: "Items In", icon: "i-lucide-package-plus", to: "/head-admin/data-analytics/items-in" },
	{ label: "Items Out", icon: "i-lucide-package-minus", to: "/head-admin/data-analytics/items-out" },
	{ label: "Sources", icon: "i-lucide-building-2", to: "/head-admin/data-analytics/sources" },
	{ label: "Visits", icon: "i-lucide-users-round", to: "/head-admin/data-analytics/visits" },
	{ label: "Audit Log", icon: "i-lucide-clipboard-clock", to: "/head-admin/data-analytics/audit-log" },
]
</script>
