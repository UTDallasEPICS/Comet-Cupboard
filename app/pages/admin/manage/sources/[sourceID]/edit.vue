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
					:saving="isSavingSourceDetails"
					@save="saveSourceDetails"
				/>
				<ManageSourceFieldsEditor :source-i-d="sourceID" :refresh-token="fieldRefreshToken" @save="saveField" @remove="removeField" />
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
const isSavingSourceDetails = ref(false)
const fieldRefreshToken = ref(0)

const saveSourceDetails = async (payload: { sourceName: string; archived: boolean }) => {
	isSavingSourceDetails.value = true
	try {
		await $fetch("/api/admin/inventory/source", { method: "PUT", body: { sourceID, ...payload } })
		await refreshSources()
	} finally {
		isSavingSourceDetails.value = false
	}
}

const saveField = async (payload: { fieldID?: string; body: Record<string, unknown> }) => {
	await $fetch("/api/admin/inventory/source/field", {
		method: payload.fieldID ? "PUT" : "POST",
		body: payload.fieldID ? { fieldID: payload.fieldID, ...payload.body } : payload.body,
	})
	fieldRefreshToken.value += 1
}

const removeField = async (fieldID: string) => {
	await $fetch("/api/admin/inventory/source/field", { method: "DELETE", body: { fieldID } })
	fieldRefreshToken.value += 1
}
</script>
