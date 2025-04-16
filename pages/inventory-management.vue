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
								button(@click="currentModal = ModalType.ADD").flex.w-24.md_w-12.bg-utd-green.text-white.place-content-center.place-items-center
									PlusIcon.fill-white.stroke-white.h-7
						div.flex.grow
							ControlsSearch(@searchTermChange="(newTerm) => searchTermChange(newTerm)")

					Modal(v-if="currentModal == ModalType.ADD" title="Add Item" @toggleModal="closeModal")
						AddItem(@submit="closeModal")
					Modal(v-if="currentModal == ModalType.EDIT" title="Edit Item" @toggleModal="closeModal")
						EditItem(@submit="closeModal" :item="editingItem")
					Modal(v-if="currentModal == ModalType.DELETE" title="Remove Item" @toggleModal="closeModal")
						DeleteItem(@submit="closeModal" :item="deleteItem")
					Modal(v-if="currentModal == ModalType.DEAL" title="Item Deal" @toggleModal="closeModal")
						EditDeal(@submit="closeModal" :item="dealItem")
					Modal(v-if="currentModal == ModalType.REVIEW" title="Review Changes" @toggleModal="closeModal")
						InventoryReviewChanges(@accept="submitInventoryCountChanges" @cancel="closeModal" :changes="inventoryCountChanges")

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
					div.sticky.bottom-8.z-20.flex.justify-end.h-12.space-x-2
						button(v-if="JSON.stringify(inventoryCountChanges) === '{}'" disabled).bg-cupboard-dg.text-white.w-full.sm_w-72 No Changes
						button(v-else @click="currentModal = ModalType.REVIEW").bg-utd-green.text-white.w-full.sm_w-72 Review Changes
						button(class="w-[50px]" @click="scrollToTop").bg-utd-green.text-white
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
const inventoryCountChanges = ref({})
const currentModal = ref("")
const editingItem = ref(null)
const deleteItem = ref(null)
const dealItem = ref(null)

const ModalType = Object.freeze({
	ADD: "ADD",
	EDIT: "EDIT",
	DELETE: "DELETE",
	DEAL: "DEAL",
	REVIEW: "REVIEW",
})

const { data: items, refresh } = await useFetch("/api/inventory/items", {
	query: { getCounts: true },
})

const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: "smooth" })
}

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

const submitInventoryCountChanges = async (source) => {
	await $fetch("/api/inventory/itemCountChanges", {
		method: "POST",
		body: {
			source: source,
			inventoryCountChanges: Object.keys(inventoryCountChanges.value).map((itemKey) => {
				return { itemID: itemKey, countChange: inventoryCountChanges.value[itemKey] }
			}),
		},
	})
	inventoryCountChanges.value = {}
	currentModal.value = ""
	refresh()
}

// modal controls
const closeModal = () => {
	currentModal.value = ""
	refresh()
}

const openEditForm = (item, category) => {
	editingItem.value = { ...item, categoryName: category }
	currentModal.value = ModalType.EDIT
}

const openDeleteForm = (item) => {
	deleteItem.value = { ...item }
	currentModal.value = ModalType.DELETE
}

const openDealForm = (item, category) => {
	dealItem.value = { ...item, categoryName: category }
	currentModal.value = ModalType.DEAL
}
</script>
