<template>
	<div>
		<NuxtLayout name="main" :title="`Add Category`" :back-navigation="{ text: 'Back to Manage Categories', to: '/admin/manage/categories' }">
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<UForm :validate="validate" :state="state" class="w-full space-y-4" @submit="onSubmit" @error="onError">
						<SharedLayoutSectionUCard title="Category Image">
							<UFormField
								id="image"
								name="image"
								label="Category Image"
								description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
								required
							>
								<div class="flex flex-col gap-2">
									<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
								</div>
							</UFormField>
						</SharedLayoutSectionUCard>
						<SharedLayoutSectionUCard title="Category Details">
							<UFormField
								id="categoryName"
								name="categoryName"
								label="Category Name"
								description="Category name must be at most 20 characters and only contain letters and spaces"
								required
							>
								<UInput v-model="state.categoryName" placeholder="Enter category name" />

								<div v-if="mostSimilarItems.length" class="border-border-soft mt-2 rounded-lg border p-2">
									<div class="mb-2 flex items-center gap-2">
										<SharedTextBaseSecondary> Similar existing categories </SharedTextBaseSecondary>
									</div>

									<div class="flex flex-wrap gap-2">
										<UBadge
											v-for="similarItem in mostSimilarItems"
											:key="similarItem.id"
											:label="similarItem.categoryName"
											color="neutral"
											variant="soft"
										/>
									</div>

									<SharedTextBaseSecondary class="mt-2 text-xs">
										Check that you're not creating a duplicate category.
									</SharedTextBaseSecondary>
								</div>
							</UFormField>
						</SharedLayoutSectionUCard>
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

const formSchema = imageSchema.extend({
	categoryName: z
		.string()
		.min(1, "Category name is required")
		.max(20, "Category name must be at most 20 characters")
		.regex(/^[A-Za-z ]+$/, "Category name must only contain letters and spaces"),
})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: undefined,
	categoryName: undefined,
}))

const { data: categories } = await useFetch("/api/student/inventory/categories", {
	method: "GET",
	query: {
		includeArchived: "true",
	},
})

const { query, filtered } = useFuzzySearch(categories ?? ref([]), { searchKeys: ["categoryName"] })
watch(
	() => state.value.categoryName,
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
		const formData = new FormData()
		formData.append("categoryID", "")
		formData.append("categoryName", event.data.categoryName)
		if (event.data.image) {
			formData.append("image", event.data.image)
		}
		formData.append("archived", "false")

		await $fetch("/api/admin/inventory/category", {
			method: "PUT",
			body: formData,
		})

		navigateTo("/admin/manage/categories")
	} catch (error) {
		// idk for now
	}
}
</script>
