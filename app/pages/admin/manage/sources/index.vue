<template>
	<div>
		<NuxtLayout name="main" title="Manage Sources" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search sources" class="relative grow">
						<UButton :icon="icons['add']" variant="ghost" color="neutral" class="absolute bg-utd-green text-white right-0" :to="`/admin/manage/sources/add`" />
					</UInput>
				</div>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="source in shownActiveSources" :key="source.sourceID">
						<ManageSourceItemCard :name="source.name" :source-i-d="source.sourceID" />
					</li>
				</ul>

				<USeparator class="my-4" />

				<SharedTextSectionTitle>Archived Sources</SharedTextSectionTitle>

				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="source in shownArchivedSources" :key="source.sourceID">
						<ManageSourceItemCard :name="source.name" :source-i-d="source.sourceID" />
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { data: sources } = await useFetch("/api/volunteer/inventory/sources", {
	query: { includeArchived: true },
})

const sortedSources = computed(() => {
	if (!sources.value) {
		return []
	}
	const sorted = [...sources.value]
	sorted.sort((a, b) => a.name.localeCompare(b.name))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedSources, { searchKeys: ["name"] })

const shownActiveSources = computed(() => {
	return filtered.value.filter((source) => {
		return source.archived === false
	})
})

const shownArchivedSources = computed(() => {
	return filtered.value.filter((source) => {
		return source.archived === true
	})
})
</script>
