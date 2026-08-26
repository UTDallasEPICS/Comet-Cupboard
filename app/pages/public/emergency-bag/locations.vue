<template>
	<div>
		<NuxtLayout name="main" title="Emergency Bag Locations" :back-navigation="{ text: 'Back to Home', to: '/' }">
			<div class="flex items-center justify-between">
				<SharedTextSectionTitle>Find A Pickup Point</SharedTextSectionTitle>
				<UPopover>
					<SharedButtonActionButton icon="i-lucide-sliders-horizontal" variant="ghost" action="neutral" size="md" aria-label="Filter bag labels" />
					<template #content>
						<div class="flex w-64 flex-col items-start gap-2 p-4">
							<SharedTextBase class="w-full font-semibold">Filter Labels</SharedTextBase>
							<USeparator />
							<UCheckboxGroup v-model="selectedLabels" :items="labelOptions" orientation="vertical" />
						</div>
					</template>
				</UPopover>
			</div>
			<USeparator class="my-4" />
			<SharedLayoutGrid :columns="1">
				<DomainCardEmergencyBagLocationCard
					v-for="location in locations"
					:key="location.locationID"
					:location-name="location.locationName"
					:img-name="location.imgName"
					:description="location.description"
					:map-embed-url="location.mapEmbedUrl"
					:visible-bags="visibleBags(location)"
				/>
			</SharedLayoutGrid>
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
	const labels = locations.value.flatMap((location) =>
		location.emergencyBags.flatMap((bag) => bag.emergencyBagLabels.map((label) => label.emergencyBagLabelName))
	)
	return [...new Set(labels)].sort((first, second) => first.localeCompare(second))
})

const visibleBags = (location: LocationData) => {
	return location.emergencyBags.filter((bag) =>
		selectedLabels.value.every((selectedLabel) => bag.emergencyBagLabels.some((label) => label.emergencyBagLabelName === selectedLabel))
	)
}
</script>
