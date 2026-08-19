<template>
	<div>
		<NuxtLayout name="main" title="Manage Locations" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search locations" class="relative grow">
						<UButton :icon="icons['add']" variant="ghost" color="neutral" class="absolute bg-utd-green text-white right-0" :to="`/admin/manage/locations/add`" />
					</UInput>
				</div>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="location in shownActiveLocations" :key="location.locationID">
						<ManageLocationItemCard :name="location.name" :img-name="location.imgName" :description="location.description" />
					</li>
				</ul>

				<USeparator class="my-4" />

				<SharedTextSectionTitle>Archived Locations</SharedTextSectionTitle>

				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="location in shownArchivedLocations" :key="location.locationID">
						<ManageLocationItemCard :name="location.name" :img-name="location.imgName" :description="location.description" />
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: locations } = await useFetch("/api/public/location/locations", {
	query: { includeArchived: true },
})

const sortedLocations = computed(() => {
	if (!locations.value) {
		return []
	}
	const sorted = [...locations.value]
	sorted.sort((a, b) => a.name.localeCompare(b.name))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedLocations, { searchKeys: ["name"] })

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
