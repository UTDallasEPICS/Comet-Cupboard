<template>
	<div>
		<NuxtLayout name="main" :title="`Add Source`" :back-navigation="{ text: 'Back to Manage Sources', to: '/admin/manage/sources' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<UFormField
								id="sourceName"
								name="sourceName"
								label="Source Name"
								description="Source name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.sourceName" placeholder="Enter source name" />

								<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
									<div class="mb-2 flex items-center gap-2">
										<SharedTextBaseSecondary> Similar existing sources </SharedTextBaseSecondary>
									</div>

									<div class="flex flex-wrap gap-2">
										<UBadge
											v-for="similarItem in mostSimilarItems"
											:key="similarItem.id"
											:label="similarItem.name"
											color="neutral"
											variant="soft"
										/>
									</div>

									<SharedTextBaseSecondary class="mt-2 text-xs">
										Check that you're not creating a duplicate source.
									</SharedTextBaseSecondary>
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

const { data: sources } = await useFetch("/api/volunteer/inventory/sources", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const { query, filtered } = useFuzzySearch(sources ?? ref([]), { searchKeys: ["name"] })
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

const onSubmit = async (event) => {
	try {
        const payload = {
            name: event.data.sourceName,
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
