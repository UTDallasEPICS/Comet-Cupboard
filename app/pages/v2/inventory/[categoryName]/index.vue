<template lang="pug">
div
    Suspense
        template(#default)
            div
                SkeletonDummyTimer
                div.relative.z-0.px-4
                    div.flex.justify-center
                        // page control components
                        div.flex.flex-col.items-start.gap-y-2
                            V2SharedNavigateBackButton(backTo="Categories" @click="goToCategoriesPage")
                            div.flex.flex-row.gap-x-2.items-center
                                V2SharedSearchBar(v-model="searchTerm" :category-items="categoryItems")
                                V2SharedAddButton(@click="goToAddPage")

                    // Small Screens (Rectangle Cards), width scales and keeps a single column format
                    div.flex.flex-col.gap-y-3.my-4.items-center.block.lg_hidden.w-full.max-w-lg
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
						)
                    // Large Screens (Square Cards), 5 column format
                    div.grid.gap-4.my-4.width-full.hidden.lg_grid.lg_grid-cols-5
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
                    div.sticky.bottom-8.right-4.z-20.flex.justify-end.space-x-2.sm_ml-auto.h-12
                        button(v-if="JSON.stringify(inventoryCountChanges) === '{}'" disabled).bg-cupboard-dg.text-white.min-w-48.md_w-64.rounded-xl No Changes
                        button(v-else @click="goToReviewPage").bg-utd-orange.text-white.min-w-48.md_w-64.rounded-xl Review Changes
        //- Skeleton (Edit later)
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
import { useRoute, navigateTo } from '#imports' 
import { useInventoryStore } from '~/stores/useInventoryStore'

const searchTerm = ref("")
const inventoryCountChanges = ref({})
const route = useRoute()
const currentCategory = computed(() => route.params.categoryName)
const inventoryStore = useInventoryStore()

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
    const changesArray = Object.entries(inventoryCountChanges.value).map(([itemID, countChange]) => {
        const original = items.value.find(i => i.itemID === itemID)
        return {
            id: itemID,
            oldCount: original.quantity,
            newCount: (original.quantity) + countChange,
            name: original.name,
            imgName: original.imgName || ''
        }
    }).filter(Boolean)

    // Store changes into store
    inventoryStore.$patch({ 
        changedItems: changesArray
    })
    navigateTo(`/v2/inventory/${currentCategory}/review-changes`)
}

const categoryItems = computed(() => {
	if(!items.value) return []
    return items.value.filter(item => item.categoryName?.toLowerCase() === currentCategory.value?.toLowerCase())
})

const filteredCategoryItems = computed(() => {
  if (!searchTerm.value) return categoryItems.value
  const term = searchTerm.value.toLowerCase()
  return categoryItems.value.filter(item => item.name.toLowerCase().includes(term))
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