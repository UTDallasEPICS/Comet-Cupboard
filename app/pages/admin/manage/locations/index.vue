<template>
	<div>
		<NuxtLayout name="main" title="Manage Locations" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search locations" class="relative grow">
						<SharedButtonActionButton
							leading-icon="i-lucide-plus"
							variant="ghost"
							action="positive"
							text="Add"
							class="bg-utd-green absolute right-0 text-white"
							:to="`/admin/manage/locations/add`"
						/>
					</UInput>
				</div>
				<USeparator class="my-4" />
				<UCard>
					<SharedTextSectionTitle>Active Locations</SharedTextSectionTitle>
					<USeparator class="my-4" />

					<SharedLayoutGrid v-if="shownActiveLocations.length != 0" class="mt-4">
						<li v-for="location in shownActiveLocations" :key="location.locationID">
							<DomainCardManageLocationItemCard
								:name="location.locationName"
								:img-name="location.imgName"
								:description="location.description"
								:location-i-d="location.locationID"
							/>
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No active locations found</SharedTextBaseSecondary>
					</div>
				</UCard>

				<UCard class="mt-4">
					<SharedTextSectionTitle>Archived Locations</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="shownArchivedLocations.length != 0" class="mt-4">
						<li v-for="location in shownArchivedLocations" :key="location.locationID">
							<DomainCardManageLocationItemCard
								:name="location.locationName"
								:img-name="location.imgName"
								:description="location.description"
								:location-i-d="location.locationID"
							/>
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No archived locations found</SharedTextBaseSecondary>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: locations } = await useFetch("/api/volunteer/location", {
	query: { includeArchived: true },
})

const sortedLocations = computed(() => {
	if (!locations.value) {
		return []
	}
	const sorted = [...locations.value]
	sorted.sort((a, b) => a.locationName.localeCompare(b.locationName))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedLocations, { searchKeys: ["locationName"] })

const shownActiveLocations = computed(() => {
	return filtered.value.filter((location) => {
		return location.archived === false
	})
})

const shownArchivedLocations = computed(() => {
	return filtered.value.filter((location) => {
		return location.archived === true
	})
})
</script>
