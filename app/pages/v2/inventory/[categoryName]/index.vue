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
							div.flex.xs_flex-col.gap-2.items-center.w-full
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

					// Submit button
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
const inventoryCountChanges = ref({})
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

			console.log("Item A:", a.name, "Created:", a.createdAt, "Counts:", a.popularityCounts, "Score:", aScore)
			console.log("Item B:", b.name, "Created:", b.createdAt, "Counts:", b.popularityCounts, "Score:", bScore)

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
function computeExponentialWeight(counts: any) {
	// Store current day
	const today = new Date()
	// Each day in counts contributes to this score, accumulating the weight
	let score = 0

	// Iterate over each count
	for(const [dateStr, count] of Object.entries(counts || {})) {
		// Store day in a date object so we can do math w/ it
		const day = new Date(dateStr)
		// Converting time difference into days
		const diff = (today.getTime() - day.getTime()) / (1000 * 60 * 60 * 24)

		// Remove anything older than 3 days (last 3 days accounted for)
		if(diff <= 3) {
			const decay = Math.exp(-0.7 * diff) // Decay amount based on difference time (days)
			score += count * decay
		}
	}
	return score
}

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
