<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(:pageTitle="currentCategory")(class="md_max-w-[600px]").md_rounded-b-xl
	Suspense
		template(#default)
			div.mt-20
				SkeletonDummyTimer
				div.relative.z-0.px-4
					div(v-if="displayRectangleCards").w-full.max-w-xl.mx-auto
						// page control components (mobile alignment)
						div.flex.flex-col.items-start.gap-y-2.w-full.mt-6
							V2SharedNavigateBackButton(backTo="Categories" @click="goToCategoriesPage")
							div.flex.gap-x-2.items-center.w-full
								V2SharedSearchBar(v-model="searchTerm" :category-items="categoryItems")
								V2SharedAddButton(@click="goToAddPage")
					div(v-if="displaySquareCards").w-full.max-w-xl
						// page control components (desktop alignment)
						div(v-if="displaySquareCards").flex.flex-col.items-start.gap-y-2.w-full.mt-6
							V2SharedNavigateBackButton(backTo="Categories" @click="goToCategoriesPage")
							div.flex.w-full.justify-between
								V2SharedSearchBar(v-model="searchTerm" :category-items="categoryItems").w-full.max-w-sm
								V2SharedAddButton(@click="goToAddPage").ml-2

					// Small Screens (Rectangle Cards), width scales and keeps a single column format
					div(v-if="displayRectangleCards").flex.flex-col.gap-y-3.my-4.items-stretch.block.w-full.max-w-xl.mx-auto
						V2InventoryItemCardRectangle(
							v-for="item in filteredCategoryItems"
							:key="item.itemID"
							@changeAmountUpdate="updateItemChangeAmount"
							@deleteItem="(item) => openDeleteForm(item)"
							@editDeal="(item) => openDealForm(item, category)"
							@editItem="(item) => openEditForm(item, category)"
							:changeCount="inventoryCountChanges[item.itemID] ?? 0"
							:currentCount="item.quantity"
							:imgName="item.imgName"
							:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:itemID="item.itemID"
							:itemName="item.name"
						).w-full
					// Large Screens (Square Cards)
					div(v-if="displaySquareCards" :style="{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }").my-4.w-full.mx-auto
						V2InventoryItemCardSquare(
							v-for="item in filteredCategoryItems"
							:key="item.itemID"
							@changeAmountUpdate="updateItemChangeAmount"
							@deleteItem="(item) => openDeleteForm(item)"
							@editDeal="(item) => openDealForm(item, category)"
							@editItem="(item) => openEditForm(item, category)"
							:changeCount="inventoryCountChanges[item.itemID] ?? 0"
							:currentCount="item.quantity"
							:imgName="item.imgName"
							:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:itemID="item.itemID"
							:itemName="item.name"
						)

					// submit button
					div.sticky.bottom-8.right-4.z-20.flex.justify-end.space-x-2.sm_ml-auto
						button(
							v-if="JSON.stringify(inventoryCountChanges) === '{}'"
							disabled
						).bg-cupboard-dg.w-60.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
							p.text-white.text-xl.font-bold No Changes
						button(v-else @click="goToReviewPage").bg-utd-orange.text-white.w-60.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
							p.text-white.text-xl.font-bold Review Changes
		//- Skeleton (Edit later)
		template(#fallback)
			div.flex.flex-row.mt-20
				div.w-screen
					// page control components
					div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10
						div.flex.flex-col.md_flex-row.md_space-x-5
							//- filter
							div.skeleton.w-full.h-12.md_w-44
							div.max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
								//- source
								div.skeleton.max-md_order-first.max-md_pb-3.w-full.h-12.md_w-44
								//- add item button
								div.skeleton.w-24.md_w-12.h-12
							div.flex.grow
							//- search
							div.skeleton.w-full.h-12
					//- Category grid and items
					div.skeleton.h-12
					div(style="grid-template-columns: repeat(auto-fill, minmax(288px, 1fr))").my-4.grid.place-items-center.gap-4
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
						div.skeleton.w-72.h-72
</template>

<script lang="ts" setup>
import { useRoute, navigateTo } from "#imports"
import { useInventoryStore } from "~/stores/useInventoryStore"

const searchTerm = ref("")
const inventoryCountChanges = ref({})
const route = useRoute()
const currentCategory = computed(() => route.params.categoryName)
const inventoryStore = useInventoryStore()
const windowWidth = ref(0)

const { data: items, refresh } = await useFetch("/api/inventory/items", {
	query: { getCounts: true },
})

// --Page navigations for each button--
// Back Button
const goToCategoriesPage = () => {
	navigateTo(`/v2/inventory/category-select`)
}
// Add Button
const goToAddPage = () => {
	const currentCategory = route.params.categoryName
	navigateTo(`/v2/inventory/${currentCategory}/add`)
}
// Review Changes Button
const goToReviewPage = () => {
	const currentCategory = route.params.categoryName
	const changesArray = Object.entries(inventoryCountChanges.value)
		.map(([itemID, countChange]) => {
			const original = items.value.find((i) => i.itemID === itemID)
			return {
				id: itemID,
				oldCount: original.quantity,
				newCount: original.quantity + countChange,
				name: original.name,
				imgName: original.imgName || "",
			}
		})
		.filter(Boolean)

	// Store changes into store
	inventoryStore.$patch({
		changedItems: changesArray,
	})
	navigateTo(`/v2/inventory/${currentCategory}/review-changes`)
}

// Determining when to display rectangle cards and square cards
onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener("resize", () => {
		windowWidth.value = window.innerWidth
	})
})

// For rectangle cards
const displayRectangleCards = computed(() => windowWidth.value < 1024) // Width is less than 1024
// For square cards
const displaySquareCards = computed(() => windowWidth.value >= 1024) // Width is greater than or equal to 1024

const categoryItems = computed(() => {
	if (!items.value) return []
	return items.value.filter((item) => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase())
})

const filteredCategoryItems = computed(() => {
	if (!searchTerm.value) return categoryItems.value
	const term = searchTerm.value.toLowerCase()
	return categoryItems.value.filter((item) => item.name.toLowerCase().includes(term))
})

const updateItemChangeAmount = (itemID, amountChange) => {
	if (!(itemID in inventoryCountChanges.value)) {
		inventoryCountChanges.value[itemID] = 0
	}
	if (amountChange) {
		inventoryCountChanges.value[itemID] += amountChange
	}

	if (inventoryCountChanges.value[itemID] === 0) {
		inventoryCountChanges.value = Object.fromEntries(Object.entries(inventoryCountChanges.value).filter(([key]) => key !== itemID))
	}
}
</script>
