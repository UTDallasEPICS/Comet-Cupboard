<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Add ${currentCategory} Item`"
			:back-navigation="{ text: `Back to ${currentCategory}`, to: `/volunteer/inventory/${currentCategory}` }"
		>
			<USeparator class="my-4" />
			<section>
				<div class="mx-auto w-full max-w-xl">
					<InventoryEditorCreateItemForm :items="items" @submit="onSubmit" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
import type { CreateInventoryItemForm } from "#shared/utils/formSchemas"

definePageMeta({ layout: false })

const route = useRoute()
const currentCategory = route.params.category as string

const { data: items } = await useFetch("/api/student/inventory/items", {
	method: "GET",
	query: {
		checkAvailability: "false",
		includeArchived: "true",
	},
})
const { data: categories } = await useFetch<{ categoryID: string; categoryName: string }[]>("/api/student/inventory/categories", { method: "GET" })
const onSubmit = async (payload: CreateInventoryItemForm) => {
	try {
		const categoryID = categories.value?.find(
			(category: { categoryID: string; categoryName: string }) => category.categoryName === currentCategory
		)?.categoryID
		if (!categoryID) return

		const formData = new FormData()
		formData.append("itemID", "")
		formData.append("itemName", payload.itemName)
		formData.append("categoryID", categoryID)
		formData.append("archived", "false")
		formData.append("image", payload.image)

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
