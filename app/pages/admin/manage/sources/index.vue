<template>
	<div>
		<NuxtLayout name="main" title="Manage Sources" :back-navigation="{ text: 'Back to Dashboard', to: '/admin' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" icon="i-lucide-search" placeholder="Search sources" class="relative grow">
						<SharedButtonActionButton
							leading-icon="i-lucide-plus"
							variant="ghost"
							action="positive"
							text="Add"
							class="bg-utd-green absolute right-0 text-white"
							:to="`/admin/manage/sources/add`"
						/>
					</UInput>
				</div>
				<USeparator class="my-4" />
				<UCard>
					<SharedTextSectionTitle>Active Sources</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="shownActiveSources.length !== 0">
						<li v-for="source in shownActiveSources" :key="source.sourceID">
							<DomainCardManageSourceItemCard :name="source.sourceName" :source-i-d="source.sourceID" />
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No active sources found</SharedTextBaseSecondary>
					</div>
				</UCard>

				<UCard class="mt-4">
					<SharedTextSectionTitle>Archived Sources</SharedTextSectionTitle>
					<USeparator class="my-4" />
					<SharedLayoutGrid v-if="shownArchivedSources.length !== 0">
						<li v-for="source in shownArchivedSources" :key="source.sourceID">
							<DomainCardManageSourceItemCard :name="source.sourceName" :source-i-d="source.sourceID" />
						</li>
					</SharedLayoutGrid>
					<div v-else class="flex flex-col items-center justify-center gap-y-4">
						<SharedTextBaseSecondary>No archived sources found</SharedTextBaseSecondary>
					</div>
				</UCard>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

interface SourceSummary {
	sourceID: string
	sourceName: string
	archived: boolean
}

const { data: sources } = await useFetch<SourceSummary[]>("/api/volunteer/inventory/source", {
	query: { includeArchived: true },
})

const sortedSources = computed(() => {
	if (!sources.value) {
		return []
	}
	const sorted = [...sources.value]
	sorted.sort((a, b) => a.sourceName.localeCompare(b.sourceName))
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedSources, { searchKeys: ["sourceName"] })

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
