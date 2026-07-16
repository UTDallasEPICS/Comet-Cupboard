<template>
	<div>
		<NuxtLayout name="main" title="Emergency Bag Locations" :back-navigation="{ text: 'Back to Home', to: '/' }" :refresh-page-timer="60">
			<section>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<UCard v-for="location in activeLocations" :key="location.name" class="flex h-full flex-col" :ui="{ body: { class: 'flex-grow' } }">
						<template #header>
							<div class="flex h-48 w-full items-center justify-center overflow-hidden rounded-t-lg border-b border-gray-100 bg-gray-50">
								<img :alt="location.name" :src="`/api/public/image/${location.imgName}`" class="block h-full w-full object-cover" />
							</div>
						</template>

						<div class="space-y-4">
							<div>
								<div class="flex items-center gap-2">
									<a
										v-if="location.description"
										:href="location.description"
										target="_blank"
										class="group text-primary-600 hover:text-primary-700 flex items-center gap-1.5 transition-colors"
									>
										<SharedTextCardTitle class="group-hover:underline">
											{{ location.name }}
										</SharedTextCardTitle>
										<UIcon name="i-lucide-square-arrow-up-right" class="text-sm opacity-50" />
									</a>
									<SharedTextCardTitle v-else>
										{{ location.name }}
									</SharedTextCardTitle>
								</div>

								<SharedTextBase class="text-xs text-gray-500">
									{{ location.address }}
								</SharedTextBase>
							</div>

							<UTable
								:data="getTableData(location.categoryCounts)"
								:columns="tableColumns"
								:ui="{ th: { base: 'text-[10px]' }, td: { base: 'py-2 text-sm' } }"
								empty="No bags"
							/>
						</div>

						<template #footer>
							<div class="flex items-center justify-between">
								<span class="text-xs font-medium tracking-wider text-gray-400 uppercase">Stock Level</span>
								<UBadge variant="outline" color="primary" size="md"> Total: {{ location.emergencyBags }} </UBadge>
							</div>
						</template>
					</UCard>
				</div>

				<footer class="mt-12">
					<USeparator class="mb-6" />
					<div class="flex items-start gap-3">
						<UIcon name="i-lucide-info" class="mt-0.5 text-xl text-gray-400" />
						<SharedTextBase class="text-sm text-gray-600"> <strong>*</strong> Not 100% nut-free </SharedTextBase>
					</div>
				</footer>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface LocationData {
	name: string
	address: string
	imgName: string
	description: string
	archived: boolean
	emergencyBags: number
	categoryCounts: Record<string, number>
}

const { data: locations, pending, refresh } = await useFetch<LocationData[]>("/api/public/location/locations")

const categoryMap: Record<string, string> = {
	NONVEGETARIAN_AND_NON_PEANUT_BUTTER: "Non-Veg and Nut-Free*",
	VEGETARIAN_AND_NON_PEANUT_BUTTER: "Veg and Nut-Free*",
	NONVEGETARIAN_AND_PEANUT_BUTTER: "Non-Veg and Nut",
	VEGETARIAN_AND_PEANUT_BUTTER: "Veg and Nut",
}

const getTableData = (categoryCounts: Record<string, number>) => {
	return Object.keys(categoryMap).map((key) => ({
		category: categoryMap[key],
		count: (categoryCounts?.[key] ?? 0).toString(),
	}))
}

const columnsDef = [
	{ header: "Bag Category", accessorKey: "category", type: "text" },
	{ header: "Quantity Available", accessorKey: "count", type: "text" },
]

const activeLocations = computed(() => {
	return locations.value?.filter((loc) => !loc.archived) ?? []
})

const tableColumns = buildNuxtUITable(columnsDef, {})

const countdown = ref(180)
let interval

const refreshNow = () => {
	reloadNuxtApp()
}

onMounted(() => {
	interval = setInterval(() => {
		countdown.value--

		if (countdown.value <= 0) {
			refreshNow()
			countdown.value = 60
		}
	}, 1000)
})

onBeforeUnmount(() => {
	clearInterval(interval)
})
</script>
