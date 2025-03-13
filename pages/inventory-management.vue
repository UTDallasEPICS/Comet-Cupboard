<template lang="pug">
div
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div.relative.z-0
					// page control components
					div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
						div.flex.flex-col.md_flex-row.md_space-x-5
							ControlsFilter(@filterChange="(selectedFilters) => (filters = selectedFilters)")
							div.max-md_order-first.flex.flex-row.space-x-5.max-md_pb-3
								button(@click="addItemsOpen = !addItemsOpen").button.flex.w-24.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
									PlusIcon.fill-white.stroke-white.h-7
						div.flex.grow
							ControlsSearch(@searchTermChange="(newTerm) => searchTermChange(newTerm)")

					Modal(title="Add Item" @toggleModal="addItemsOpen = false" :isOpen="addItemsOpen")
						AddItem(title="AddItem" @submit="submitAdd()")
					Modal(title="Edit Item" @toggleModal="editItemsOpen = false" :isOpen="editItemsOpen")
						EditItem(title="Edit Item" @submit="submitEdit()" :item="editingItem")
					Modal(title="Remove Item" @toggleModal="deleteItemsOpen = false" :isOpen="deleteItemsOpen")
						DeleteItem(title="Remove Item" @submit="submitDelete()" :item="deleteItem")
					Modal(title="Item Deal" @toggleModal="dealItemsOpen = false" :isOpen="dealItemsOpen")
						EditDeal(title="Item Deal" @submit="submitDeal()" :item="dealItem")
					Modal(title="Review Changes" @toggleModal="reviewChangesOpen = false" :isOpen="reviewChangesOpen")
						InventoryReviewChanges(@accept="submitInventoryCountChanges" @cancel="reviewChangesOpen = false" :changes="inventoryCountChanges")

					CategoryItemsGrid(v-for="category in Object.keys(filteredCategoryItems)" :headingName="category").my-4
						ItemCard(
							v-for="item in filteredCategoryItems[category]"
							typeOfCard="INVENTORY"
							@changeAmountUpdate="updateItemChangeAmount"
							@deleteItem="(item) => openDeleteForm(item)"
							@editDeal="(item) => openDealForm(item, category)"
							@editItem="(item) => openEditForm(item, category)"
							:changeCount="item.itemID in inventoryCountChanges ? inventoryCountChanges[item.itemID] : 0"
							:currentCount="item.quantity"
							:imgName="item.imgName"
							:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:itemID="item.itemID"
							:name="item.name"
						)
					// submit button
					div.sticky.bottom-8.z-20.flex.justify-end.pointer-events-none
						button(v-if="source === ''").button.bg-red-negative.text-white.w-full.sm_w-72.cursor-not-allowed.pointer-events-auto No Source Selected
						button(
							v-else-if="JSON.stringify(inventoryCountChanges) === '{}'"
						).button.bg-red-negative.text-white.w-full.sm_w-72.cursor-not-allowed.pointer-events-auto No Changes
						button(v-else @click="reviewChangesOpen = !reviewChangesOpen").button.bg-utd-green.text-white.w-full.sm_w-72.pointer-events-auto Review Changes
						button(v-on:click="scrollToTop").button(class="w-[50px]").bg-utd-green.text-white.drop-shadow-standard.pointer-events-auto
							ChevronUpIcon.m-auto.h-6.fill-white.stroke-white
		//- Skeleton
		template(#fallback)
			div.flex.flex-row
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
import { PlusIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"

const searchTerm = ref("")
const filters = ref([])
const source = ref("")
const inventoryCountChanges = ref({})
const addItemsOpen = ref(false)

const editingItem = ref(null)
const editItemsOpen = ref(false)
const reviewChangesOpen = ref(false)
const deleteItem = ref(null)
const deleteItemsOpen = ref(false)
const dealItem = ref(null)
const dealItemsOpen = ref(false)

const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: "smooth" })
}

const { data: items, refresh } = await useFetch("/api/inventory/items", {
	query: { getCounts: true },
})

const filteredCategoryItems = computed(() => {
	const categoryFilters = filters.value.filter((filter) => filter !== "Deals")
	const dealFilter = filters.value.includes("Deals")
	const searchFilter = new RegExp(searchTerm.value, "i")
	// show all items if no filters are selected
	return Object.groupBy(
		items.value.filter((item) => {
			return (
				(searchTerm.value == "" || searchFilter.test(item.name)) &&
				(categoryFilters.length == 0 || categoryFilters.includes(item.categoryName)) &&
				(!dealFilter || item.Deal)
			)
		}),
		(item) => {
			return item.categoryName
		}
	)
})

const searchTermChange = (newTerm) => {
	searchTerm.value = newTerm
}

const updateItemChangeAmount = (itemID, amountChange) => {
	if (!(itemID in inventoryCountChanges.value)) {
		inventoryCountChanges.value[itemID] = 0
	}
	if (amountChange) {
		inventoryCountChanges.value[itemID] += amountChange
	}
}

const submitInventoryCountChanges = async () => {
	await $fetch("/api/inventory/itemCountChanges", {
		method: "POST",
		body: {
			source: source.value,
			inventoryCountChanges: Object.keys(inventoryCountChanges.value).map((itemKey) => {
				return { itemID: itemKey, countChange: inventoryCountChanges.value[itemKey] }
			}),
		},
	})
	inventoryCountChanges.value = {}
	reviewChangesOpen.value = false
	refresh()
}

// modal controls

const submitAdd = () => {
	addItemsOpen.value = false
	refresh()
}

const openEditForm = (item, category) => {
	editingItem.value = { ...item, categoryName: category }
	editItemsOpen.value = true
}

const submitEdit = () => {
	editItemsOpen.value = false
	refresh()
}

const openDeleteForm = (item) => {
	deleteItem.value = { ...item }
	deleteItemsOpen.value = true
}

const submitDelete = () => {
	deleteItemsOpen.value = false
	refresh()
}

const openDealForm = (item, category) => {
	dealItem.value = { ...item, categoryName: category }
	dealItemsOpen.value = true
}

const submitDeal = () => {
	dealItemsOpen.value = false
	refresh()
}
</script>
