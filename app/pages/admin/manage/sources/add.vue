<template>
	<div>
		<NuxtLayout name="main" title="Add Source" :back-navigation="{ text: 'Back to Manage Sources', to: '/admin/manage/sources' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<ManageSourceEditorSourceForm :sources="sources" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

interface SourceSummary {
	sourceID: string
	sourceName: string
	archived: boolean
}

const { data: sources } = await useFetch<SourceSummary[]>("/api/volunteer/inventory/source", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const onSubmit = async (sourceName: string) => {
	try {
		const payload = {
			sourceID: "",
			sourceName,
			archived: false,
		}

		await $fetch("/api/admin/inventory/source", {
			method: "PUT",
			body: payload,
		})

		navigateTo("/admin/manage/sources")
	} catch (error) {
		// idk for now
	}
}
</script>
