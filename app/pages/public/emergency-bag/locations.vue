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
							<UCheckboxGroup v-model="selectedLabels" :items="labelOptions" orientation="vertical" class="w-full pl-2" />
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
const { data: emergencyBagLabels } = await useFetch<{ emergencyBagLabelName: string }[]>("/api/public/emergency-bag/label")
const selectedLabels = ref<string[]>([])
const locations = computed(() => locationResults.value ?? [])

const labelOptions = computed(() => (emergencyBagLabels.value ?? []).map((label) => label.emergencyBagLabelName))
const activeSelectedLabels = computed(() => selectedLabels.value.filter((label) => labelOptions.value.includes(label)))

const visibleBags = (location: LocationData) => {
	return location.emergencyBags.filter((bag) =>
		activeSelectedLabels.value.every((selectedLabel) => bag.emergencyBagLabels.some((label) => label.emergencyBagLabelName === selectedLabel))
	)
}
</script>
