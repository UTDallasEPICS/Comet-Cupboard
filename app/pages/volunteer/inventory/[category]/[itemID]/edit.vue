<template>
	<div>
		<NuxtLayout name="main" :title="`Edit ${item?.name}`" :back-navigation="{ text: `Back to ${currentCategory}`, to: `/volunteer/inventory/${currentCategory}` }">
			<section>
				<div class="mx-auto w-min">
					<UForm :validate="validate" :state="state" class="w-96 space-y-4" @submit="onSubmit" @error="onError">
						<UFormField
							id="image"
							name="image"
							label="Item Image"
							description="JPG or PNG. 2MB Max. Dimensions between 200x200 and 4096x4096 pixels"
						>
							<div class="flex flex-col gap-2">
								<UFileUpload v-model="state.image" class="aspect-square w-full" label="Upload image" accept=".jpg,.jpeg,.png" />
							</div>
						</UFormField>
						<UFormField
							id="itemName"
							name="itemName"
							label="Item Name"
							description="Item name must be at most 20 characters and only contain letters and spaces"
						>
							<UInput v-model="state.itemName" placeholder="Enter item name" />
						</UFormField>
						<UCard
							:ui="{
								header: 'p-2 py-2 sm:p-2 sm:py-2',
								body: 'p-2 py-2 sm:p-2 sm:py-2',
							}"
						>
							<template #header>
								<SharedTextBase class="mb-1"> Existing Items with Similar Names </SharedTextBase>
							</template>
							<template #default>
								<ul class="space-y-1">
									<li v-for="similarItem in mostSimilarItems" :key="similarItem.id">
										<SharedTextBase>{{ similarItem.name }}</SharedTextBase>
									</li>
								</ul>
							</template>
						</UCard>
						<UFormField id="category" name="category" label="Category" description="Select the category for this item">
							<USelect v-model="state.category" :items="categoryOptions" placeholder="Select category" />
						</UFormField>
						<UFormField id="archived" name="archived" label="Archived" description="Check if the item is archived">
							<UCheckbox v-model="state.archived" />
						</UFormField>
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
const itemID = route.params.itemID as string

const { data: item } = await useFetch("/api/student/inventory/item/", {
	query: { itemID },
})

const { data: categories } = await useFetch("/api/student/inventory/categories")

const categoryOptions = computed(() => {
	return categories.value?.map((category) => {
		return category.name
	})
})

const originalImage = ref<Blob | null>(null)

const formSchema = imageSchema
	.extend({
		itemName: z
			.string()
			.min(1, "Item name is required")
			.max(20, "Item name must be at most 20 characters")
			.regex(/^[A-Za-z ]+$/, "Item name must only contain letters and spaces"),
		category: z.string().min(1, "Category is required"),
		archived: z.boolean().default(false),
	})
	.partial({
		image: true,
		itemName: true,
		category: true,
	})

const { schema, state, validate, onError } = createFormBuilder(formSchema, () => ({
	image: originalImage.value
		? new File([originalImage.value], item.value?.imgName, {
				type: originalImage.value.type,
			})
		: undefined,
	itemName: item.value?.name || undefined,
	category: item.value?.categoryName || undefined,
	archived: item.value?.archived || false,
}))

watchEffect(async () => {
	if (item.value) {
		originalImage.value = await $fetch<Blob>(`/api/public/image/${item.value.imgName}`, { responseType: "blob" })
		state.value.image = new File([originalImage.value], item.value.imgName, {
			type: originalImage.value.type,
		})
	} else {
		originalImage.value = null
	}
})

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
	return filtered.value.slice(0, 5)
})

const onSubmit = async (event) => {
	try {
		const formData = new FormData()
		formData.append("itemID", itemID)
		formData.append("name", event.data.itemName || "")
		formData.append("categoryName", event.data.category || "")
		if (event.data.image) {
			formData.append("image", event.data.image)
		}
		formData.append("archived", event.data.archived ? "true" : "false")

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
