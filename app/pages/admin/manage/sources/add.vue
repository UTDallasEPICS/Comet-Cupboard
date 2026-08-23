<template>
	<div>
		<NuxtLayout name="main" title="Add Source" :back-navigation="{ text: 'Back to Manage Sources', to: '/admin/manage/sources' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<SharedTextCardTitle>Source Details</SharedTextCardTitle>
							<USeparator class="my-4" />
							<UFormField
								id="sourceName"
								name="sourceName"
								label="Source Name"
								description="Source name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.sourceName" placeholder="Enter source name" class="w-full" />

								<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
									<div class="mb-2 flex items-center gap-2">
										<SharedTextBaseSecondary> Similar existing sources </SharedTextBaseSecondary>
									</div>

									<div class="flex flex-wrap gap-2">
										<UBadge
											v-for="similarItem in mostSimilarItems"
											:key="similarItem.sourceID"
											:label="similarItem.sourceName"
											color="neutral"
											variant="soft"
										/>
									</div>

									<SharedTextBaseSecondary class="mt-2 text-xs"> Check that you're not creating a duplicate source. </SharedTextBaseSecondary>
								</div>
							</UFormField>
						</UCard>
						<footer class="sticky right-4 bottom-8 mt-4 flex justify-end space-x-2 sm:ml-auto">
							<SharedButtonPositiveAction type="submit" text="Submit" />
						</footer>
					</UForm>
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import * as z from "zod"

definePageMeta({ layout: false })

const formSchema = z.object({
	sourceName: z
		.string()
		.min(1, "Source name is required")
		.max(20, "Source name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Source name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	sourceName: undefined,
}))

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

const { query, filtered } = useFuzzySearch(sources ?? ref([]), { searchKeys: ["sourceName"] })
watch(
	() => state.value.sourceName,
	(name) => {
		query.value = name || ""
	},
	{ immediate: true }
)
const mostSimilarItems = computed(() => {
	return filtered.value.slice(0, 5)
})

const onSubmit = async (event: { data: { sourceName: string } }) => {
	try {
		const payload = {
			sourceID: "",
			sourceName: event.data.sourceName,
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
