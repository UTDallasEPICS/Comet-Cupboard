<template lang="pug">
div
	div.flex.absolute.top-20.left-0.w-full.h-16.z-30.justify-center
		V2SharedHeaderSubheader(:pageTitle="currentCategory")(class="md_max-w-[600px]").md_rounded-b-3xl
	Suspense
		template(#default)
			div.mt-20
				SkeletonDummyTimer
				div.relative.z-0.px-4
					div(v-if="displayRectangleCards").w-full.max-w-xl.mx-auto
						// page control components (mobile alignment)
						div.flex.flex-col.items-start.w-full.mt-6
							V2SharedNavigateBackButton(backTo="Categories" @click="goToCategoriesPage")
							div.flex.flex-col.md_flex-row.gap-2.items-center.w-full
								V2SharedSearchBar(v-model="searchTerm" :category-items="categoryItems")
								// Sort dropdown
								div.flex.gap-2.items-center
									Listbox(v-model="sortOption" v-slot="{ open }")
										div.relative
											ListboxButton.modal-button.flex.flex-row.w-48.bg-white.text-sm.px-3.items-center.text-left.font-normal.border.border-cupboardv2-lg.h-8
												div.grow
													| {{ sortOption }}
												ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
												ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
											TransitionsDropDown
												ListboxOptions.absolute.top-10.z-50.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-48.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
													ListboxOption(
														v-for="option in sortOptions"
														:key="option"
														:value="option"
													).p-1.text-center.text-sm.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
														| {{ option }}
									V2SharedAddButton(@click="goToAddPage" class="w-20")
					div(v-if="displaySquareCards").w-full.max-w-xl
						// page control components (desktop alignment)
						div(v-if="displaySquareCards").flex.flex-col.items-start.gap-y-2.w-full.mt-6
							V2SharedNavigateBackButton(backTo="Categories" @click="goToCategoriesPage")
							div.flex.w-full.justify-between.gap-x-2
								V2SharedSearchBar(v-model="searchTerm" :category-items="categoryItems").w-full.max-w-sm
								// Sort dropdown
								Listbox(v-model="sortOption" v-slot="{ open }")
									div.relative
										ListboxButton.modal-button.flex.flex-row.w-48.bg-white.text-sm.px-3.items-center.text-left.font-normal.border.border-cupboardv2-lg.h-8
											div.grow
												| {{ sortOption }}
											ChevronUpIcon(v-if="open").fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
											ChevronDownIcon(v-else).fill-cupboardv2-dg.stroke-cupboardv2-dg.h-5
										TransitionsDropDown
											ListboxOptions.absolute.top-10.z-50.bg-white.drop-shadow-standard.rounded-xl.w-full.max-h-36.divide-y.divide-cupboard-lg.overflow-y-auto.overscroll-contain
												ListboxOption(
													v-for="option in sortOptions"
													:key="option"
													:value="option"
												).p-1.text-center.text-sm.cursor-pointer.text-wrap.hover_bg-cupboardv2-lg
													| {{ option }}
								V2SharedAddButton(@click="goToAddPage" class="w-32")
					// Small Screens (Rectangle Cards), width scales and keeps a single column format
					div(v-if="displayRectangleCards").flex.flex-col.gap-y-3.my-4.items-stretch.block.w-full.max-w-xl.mx-auto
						V2InventoryItemCardRectangle(
							v-for="item in filteredCategoryItems"
							:key="item.itemID"
							@changeAmountUpdate="updateItemChangeAmount"
							@deleteItem="(item) => openDeleteForm(item)"
							@editDeal="(item) => openDealForm(item, category)"
							@editItem="(item) => openEditForm(item, category)"
							:changeCount="inventoryStore.changes[item.itemID]?.newCount - inventoryStore.changes[item.itemID]?.oldCount || 0"
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
							:changeCount="getChangeCount(item.itemID)"
							:currentCount="item.quantity"
							:imgName="item.imgName"
							:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:itemID="item.itemID"
							:itemName="item.name"
						)

					// Submit button
					div.sticky.bottom-8.right-4.z-20.flex.justify-end.space-x-2.sm_ml-auto
						button(
							v-if="Object.keys(inventoryStore.changes || {}).length === 0"
							disabled
						).bg-cupboard-dg.w-60.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
							p.text-white.text-xl.font-bold No Changes
						button(v-else @click="goToReviewPage").bg-utd-orange.text-white.w-60.h-12.rounded-xl.flex.items-center.justify-center.drop-shadow-standard
							p.text-white.text-xl.font-bold Review Changes
		//- Skeleton (Edit later)
		template(#fallback)
			div.mt-20.w-full.relative.z-0.px-4.mx-auto 
				// Page Controls
				div.flex.flex-col.items-start.gap-y-2.w-full.mt-6 
					// Back Button
					div.skeleton.h-10.w-32.rounded-lg 

					// Search/Filter/Add Button (mobile)
					div.flex.gap-x-2.items-center.w-full.lg_hidden 
						div.skeleton.h-10.w-full.rounded-lg
						div.skeleton.h-10.w-48.rounded-lg
						div.skeleton.h-10.w-12.rounded-lg

					// Desktop layout
					div.hidden.lg_block.w-full.max-w-xl.flex.flex-col.items-start.gap-y-2.w-full
						div.flex.w-full.justify-between
							div.skeleton.w-full.rounded-lg
							div.skeleton.h-10.w-48.ml-2.rounded-lg
							div.skeleton.h-10.w-12.ml-2.rounded-lg

				// Rectangle Cards (mobile)
				div.flex.flex-col.gap-y-3.my-4.items-stretch.block.w-full.lg_hidden
					div.skeleton.h-40.w-full.rounded-xl(v-for="n in 5" :key="n")

				// Square Cards (desktop)
				div.hidden.lg_grid.my-4.w-full.grid.gap-4(
					:style="{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))'}"
				)
					div.skeleton.h-64.w-full.rounded-xl(v-for="n in 8" :key="n")

				// Footer button
				div.sticky.bottom-8.right-4.z-20.flex.justify-end.w-full.mt-6
					div.skeleton.w-60.h-12.rounded-xl
</template>

<script lang="ts" setup>
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/vue/24/solid"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue"
import { useRoute, navigateTo } from "#imports"
import { useInventoryStore } from "~/stores/useInventoryStore"
import Fuse from "fuse.js"

const searchTerm = ref("")
const route = useRoute()
const currentCategory = computed(() => route.params.categoryName)
const inventoryStore = useInventoryStore()
const windowWidth = ref(0)
// Allow items to update based on sorting dropdown
const reactiveItems = ref<any[]>([])

// Sorting options for the cards
const sortOption = ref("Frequently Selected") // default
const sortOptions = ["Frequently Selected", "Newest Items"]

const { data: items } = await useFetch("/api/inventory/items", {
	query: { getCounts: true },
})

// Populate reactiveItems
// This basically observes items, and when items first become available the callback runs and copies
// the array into reactiveItems.value
// This allows computed cards to show after filtering
watch(items, (val) => {
	reactiveItems.value = val || []
}, { immediate: true })

// --Page navigations for each button--
// Back Button
const goToCategoriesPage = () => {
	if(inventoryStore.totalChanges > 0) {
		navigateTo(`/v2/inventory/return-verify?category=${currentCategory.value}`)
	}
	else {
		inventoryStore.resetChanges()
		navigateTo(`/v2/inventory/category-select`)
	}
}
// Add Button
const goToAddPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/v2/inventory/${cat}/add`)
}
// Review Changes Button
const goToReviewPage = () => {
	// To avoid unexpected paths
	const cat = currentCategory.value || route.params.categoryName
	navigateTo(`/v2/inventory/${cat}/review-changes`)
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

// Watches reactiveItems and currentCategory, returns only items whose categoryName matches the URL
const categoryItems = computed(() => {
	return reactiveItems.value.filter(
		item => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase()
	)
})

const filteredCategoryItems = computed(() => {
	if(!categoryItems.value) return []

	// Sort by search
	const term = searchTerm.value.trim()
	let filtered: typeof categoryItems.value = []

	if(!term) {
		// Nothing searched, show all
		filtered = [...categoryItems.value]
	} else {
		const fuse = new Fuse(categoryItems.value, {
			keys: ["name"],
			threshold: 0.6,
		})
		filtered = fuse.search(term).map(r => r.item)
	}

	// Sort by frequently selected
	if(sortOption.value === "Frequently Selected") {
		// Compares pairs of items and decides their order based on popualarity score
		filtered.sort((a, b) => {
			const aScore = computeExponentialWeight(a.popularityCounts || {})
			const bScore = computeExponentialWeight(b.popularityCounts || {})

			return bScore - aScore // descending order
		})
	// Sort by newest items
	} else if(sortOption.value === "Newest Items") {
		// Compares pairs of items and decides their order based on timestamp
		filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
	}

	return filtered
})

// Function for computing exponential weight in frequency sorting
function computeExponentialWeight(counts: Record<string, number> = {}) {
	const DECAY_RATE = 0.7; // decay constant of a 3-day half-life, makes recent days matter most
	const MAX_DAYS = 3;

	const today = new Date()
	let score = 0

	// Iterate over each count
	for(const [dateStr, count] of Object.entries(counts || {})) {
		// Store day in a date object so we can do math w/ it
		const day = new Date(dateStr)
		// Converting time difference into days
		const diff = (today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24)

		// Remove anything older than 3 days (last 3 days accounted for)
		if(diff <= MAX_DAYS) {
			const decay = Math.exp(-DECAY_RATE * diff) // Decay amount based on difference time (days)
			score += count * decay
		}
	}
	return score
}

const updateItemChangeAmount = (itemID: string, amountChange: number) => {
	const item = reactiveItems.value.find(i => i.itemID === itemID)
	if(!item) return 

	const existingChange = inventoryStore.changes[itemID]
	const oldCount = item.quantity 
	const currentNewCount = existingChange?.newCount ?? oldCount
	const newCount = currentNewCount + amountChange 

	if(newCount === oldCount) {
		inventoryStore.removeItem(itemID)
		return 
	}

	inventoryStore.updateItemCount({
		id: itemID,
		oldCount,
		newCount,
		name: item.name,
		imgName: item.imgName
	})
}

// Helper to get per-item change count
const getChangeCount = (itemID: string) => {
	const entry = inventoryStore.changes?.[itemID]
	if(!entry) return 0
	const newCount = entry.newCount ?? 0 
	const oldCount = entry.oldCount ?? 0 
	return newCount - oldCount
}
</script>
