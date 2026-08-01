<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Add ${currentCategory} Item`"
			:back-navigation="{ text: `Back to ${currentCategory}`, to: `/volunteer/inventory/${currentCategory}` }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UCard>
							<UFormField
								id="image"
								name="image"
								label="Item Image"
								description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
								required
							>
								<div class="flex flex-col gap-2">
									<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
								</div>
							</UFormField>
						</UCard>
						<UCard>
							<UFormField
								id="itemName"
								name="itemName"
								label="Item Name"
								description="Item name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.itemName" placeholder="Enter item name" />

								<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
									<div class="mb-2 flex items-center gap-2">
										<SharedTextBaseSecondary> Similar existing items </SharedTextBaseSecondary>
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

									<SharedTextBaseSecondary class="mt-2 text-xs"> Check that you're not creating a duplicate item. </SharedTextBaseSecondary>
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

const route = useRoute()
const currentCategory = route.params.category as string

const formSchema = imageSchema.extend({
	itemName: z
		.string()
		.min(1, "Item name is required")
		.max(20, "Item name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: undefined,
	itemName: undefined,
}))

const { data: items } = await useFetch("/api/student/inventory/items", {
	method: "GET",
	query: {
		checkAvailability: "false",
		includeArchived: "true",
	},
})
const { query, filtered } = useFuzzySearch(items ?? ref([]), { searchKeys: ["name"] })
watch(
	() => state.value.itemName,
	(name) => {
		query.value = name || ""
	},
	{ immediate: true }
)
const mostSimilarItems = computed(() => {
	return filtered.value.slice(0, 10)
})

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("name", event.data.itemName || "")
		formData.append("categoryName", currentCategory as string)
		formData.append("archived", "false")
		if (event.data.image) {
			formData.append("image", event.data.image)
		}

		await $fetch("/api/volunteer/inventory/item", {
			method: "PUT",
			body: formData,
		})

		navigateTo(`/volunteer/inventory/${currentCategory}`)
	} catch (error) {
		// idk for now
	}
}
</script>
