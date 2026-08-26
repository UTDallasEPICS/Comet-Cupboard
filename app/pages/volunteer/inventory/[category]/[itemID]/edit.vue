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
					<InventoryEditorItemDetailsForm
						:item-i-d="itemID"
						:original-name="item.itemName"
						:original-category-i-d="item.categoryID"
						:original-archived="item.archived"
						:category-options="categoryOptions"
						:saving="isSavingItemDetails"
						@save="saveItemDetails"
					/>
					<InventoryEditorItemDealForm :item-i-d="itemID" :original-deal="item.deal" :saving="isSavingDeal" @save="saveDeal" />
					<InventoryEditorSpecificProductsForm
						:item-i-d="itemID"
						:specific-items="item.specificItems"
						:saving="isSavingProducts"
						:refresh-token="productRefreshToken"
						@save="saveProducts"
					/>
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

const isSavingItemDetails = ref(false)

const saveItemDetails = async (payload: { itemName: string; categoryID: string; archived: boolean }) => {
	isSavingItemDetails.value = true
	try {
		const formData = new FormData()
		formData.append("itemID", itemID)
		formData.append("itemName", payload.itemName)
		formData.append("categoryID", payload.categoryID)
		formData.append("archived", payload.archived.toString())
		await $fetch("/api/volunteer/inventory/item", { method: "PUT", body: formData })
		await refreshItem()
	} finally {
		isSavingItemDetails.value = false
	}
}

const isSavingDeal = ref(false)

const saveDeal = async (deal: { actualCount: number; adjustedCount: number } | null) => {
	isSavingDeal.value = true
	try {
		if (deal) await $fetch("/api/volunteer/inventory/item/deal", { method: "PUT", body: { itemID, ...deal } })
		else await $fetch("/api/volunteer/inventory/item/deal", { method: "DELETE", query: { itemID } })
		await refreshItem()
	} finally {
		isSavingDeal.value = false
	}
}

const isSavingProducts = ref(false)
const productRefreshToken = ref(0)

const saveProducts = async (payloads: FormData[]) => {
	isSavingProducts.value = true
	try {
		for (const payload of payloads) {
			await $fetch("/api/volunteer/inventory/item/specific-item", { method: "PUT", body: payload })
		}
		await refreshItem()
		productRefreshToken.value++
	} finally {
		isSavingProducts.value = false
	}
}
</script>
