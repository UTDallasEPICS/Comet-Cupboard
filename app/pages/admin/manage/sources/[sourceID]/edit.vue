<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit ${currentSource?.sourceName ?? 'Source'}`"
			:back-navigation="{ text: 'Back to Manage Sources', to: '/admin/manage/sources' }"
		>
			<USeparator class="my-4" />
			<section class="mx-auto w-full max-w-xl space-y-4">
				<ManageSourceDetailsEditor
					v-if="currentSource"
					:source-i-d="sourceID"
					:original-name="currentSource.sourceName"
					:original-archived="currentSource.archived"
					@updated="refreshSources"
				/>
				<ManageSourceFieldsEditor :source-i-d="sourceID" />
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

const route = useRoute()
const sourceID = route.params.sourceID as string
const { data: sources, refresh: refreshSources } = await useFetch<SourceSummary[]>("/api/volunteer/inventory/source", {
	query: { includeArchived: "true" },
})
const currentSource = computed(() => sources.value?.find((source) => source.sourceID === sourceID))
</script>
