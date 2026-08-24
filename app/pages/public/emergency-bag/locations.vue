<template>
	<div>
		<NuxtLayout name="main" title="Emergency Bag Locations" :back-navigation="{ text: 'Back to Home', to: '/' }">
			<section class="space-y-6">
				<div class="flex items-center justify-between gap-3">
					<h2 class="text-lg font-semibold text-gray-900">Find A Pickup Point</h2>
					<UPopover>
						<UButton :icon="icons.sortFilter" variant="ghost" color="neutral" size="md" aria-label="Filter bag labels" />
						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter Labels</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="selectedLabels" :items="labelOptions" orientation="vertical" />
							</div>
						</template>
					</UPopover>
				</div>

				<div v-if="pending" class="py-8 text-center text-sm text-gray-500">Loading locations...</div>
				<div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					<UCard v-for="location in locations" :key="location.locationID">
						<div class="overflow-hidden rounded-lg border border-gray-200">
							<img :alt="location.locationName" :src="`/api/public/image/${location.imgName}`" class="h-44 w-full object-cover" />
							<UCollapsible>
								<template #default="{ open }">
									<UButton color="neutral" variant="ghost" block class="h-auto justify-between rounded-none p-4" :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'">
										<div class="min-w-0 text-left">
											<SharedTextCardTitle>{{ location.locationName }}</SharedTextCardTitle>
											<SharedTextBase class="mt-1 text-sm text-gray-600">Available Bags: {{ visibleBags(location).length }}</SharedTextBase>
										</div>
									</UButton>
								</template>
								<template #content>
									<div class="space-y-4 border-t border-gray-200 p-4">
										<SharedTextBaseSecondary>{{ location.description }}</SharedTextBaseSecondary>
										<div class="space-y-2">
											<SharedTextBase class="font-semibold">Bag Labels</SharedTextBase>
											<div v-if="visibleBags(location).length" class="space-y-2">
												<div v-for="(bag, index) in visibleBags(location)" :key="index" class="rounded-lg border border-gray-200 p-2">
													<div v-if="bag.emergencyBagLabels.length" class="flex flex-wrap gap-1">
														<UBadge v-for="label in bag.emergencyBagLabels" :key="label.emergencyBagLabelName" :label="label.emergencyBagLabelName" color="neutral" variant="outline" />
													</div>
													<SharedTextBaseSecondary v-else>No labels</SharedTextBaseSecondary>
												</div>
											</div>
											<SharedTextBaseSecondary v-else>No available bags match the selected labels.</SharedTextBaseSecondary>
										</div>
										<div v-if="location.mapEmbedUrl" class="h-52 overflow-hidden rounded-lg border border-gray-200">
											<iframe :src="location.mapEmbedUrl" width="100%" height="100%" :title="location.locationName" scrolling="no" allow="geolocation; gyroscope; accelerometer" style="border: 0px solid #fff; margin: 0; padding: 0" class="block" loading="lazy" />
										</div>
									</div>
								</template>
							</UCollapsible>
						</div>
					</UCard>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface LocationData {
	locationID: string
	locationName: string
	imgName: string
	mapEmbedUrl?: string | null
	description: string
	emergencyBags: Array<{
		emergencyBagLabels: Array<{ emergencyBagLabelName: string }>
	}>
}

const { data: locationResults, pending } = await useFetch<LocationData[]>("/api/public/emergency-bag/location-information")
const selectedLabels = ref<string[]>([])
const locations = computed(() => locationResults.value ?? [])

const labelOptions = computed(() => {
	const labels = locations.value.flatMap((location) => location.emergencyBags.flatMap((bag) => bag.emergencyBagLabels.map((label) => label.emergencyBagLabelName)))
	return [...new Set(labels)].sort((first, second) => first.localeCompare(second))
})

const visibleBags = (location: LocationData) => {
	return location.emergencyBags.filter((bag) => selectedLabels.value.every((selectedLabel) => bag.emergencyBagLabels.some((label) => label.emergencyBagLabelName === selectedLabel)))
}
</script>
