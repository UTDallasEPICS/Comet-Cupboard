<template>
	<div>
		<NuxtLayout
			name="main"
			:title="`Edit ${item?.itemName}`"
			:back-navigation="{ text: `Back to ${currentCategory}`, to: `/volunteer/inventory/${currentCategory}` }"
		>
			<USeparator class="my-4" />
			<section>
				<div v-if="item" class="mx-auto w-full max-w-xl space-y-4">
					<InventoryItemDetailsEditor
						:item-i-d="itemID"
						:original-name="item.itemName"
						:original-category-i-d="item.categoryID"
						:original-archived="item.archived"
						:category-options="categoryOptions"
						@updated="refreshItem"
					/>
					<InventoryItemDealEditor :item-i-d="itemID" :original-deal="item.deal" @updated="refreshItem" />
					<InventorySpecificProductsEditor :item-i-d="itemID" :specific-items="item.specificItems" @updated="refreshItem" />
				</div>
			</section>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: false })

const route = useRoute()
const currentCategory = route.params.category as string
const itemID = route.params.itemID as string

const { data: item, refresh: refreshItem } = await useFetch("/api/student/inventory/item", {
	query: { itemID },
})

const { data: categories } = await useFetch("/api/student/inventory/categories")

const categoryOptions = computed(() => {
	return categories.value?.map((category) => {
		return { label: category.categoryName, value: category.categoryID }
	})
})
</script>
