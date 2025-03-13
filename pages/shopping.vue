<template lang="pug">
div
	Suspense
		template(#default)
			div
				SkeletonDummyTimer
				div.flex.flex-row
					div.w-screen
						div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10.sm_text-nowrap
							div.flex.flex-col.md_flex-row.md_space-x-5
								ControlsFilter(@filterChange="(selectedFilters) => (filters = selectedFilters)")
							div.flex.grow
								ControlsSearch(@searchTermChange="(newTerm) => (searchTerm = newTerm)")
						CategoryItemsGrid(v-for="category in Object.keys(filteredCategoryItems)" :headingName="category").my-4
							ItemCard(
								v-for="item in filteredCategoryItems[category]"
								typeOfCard="SHOPPING"
								:imgName="item.imgName"
								:itemDeal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
								:itemID="item.itemID"
								:name="item.name"
							)
				div.sticky.bottom-5.flex.justify-end
					button(class="w-[50px]" @click="scrollToTop").button.bg-utd-green.text-white.drop-shadow-standard.pointer-events-auto
						ChevronUpIcon.m-auto.h-6.fill-white.stroke-white

		//- Skeleton - change as needed when UI changes, hardcoded here to reduce maintaining skeleton components
		template(#fallback)
			div.flex.flex-row
				div.w-screen
					div.flex.flex-col.md_flex-row.pb-7.max-md_space-y-3.md_space-x-10
						//- Filter and search
						div.flex.flex-col.md_w-44.md_flex-row.md_space-x-5
							div.skeleton.w-full.h-12
						div.flex.grow
							div.skeleton.w-full.h-12
					div
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
import { ChevronUpIcon } from "@heroicons/vue/24/solid"

const searchTerm = ref("")
const filters = ref([])

const scrollToTop = (): void => {
	window.scrollTo({ top: 0, behavior: "smooth" })
}

// get items with count greater than 0
const { data: items } = await useFetch("/api/inventory/items", {
	query: { checkAvailability: true },
})

const filteredCategoryItems = computed(() => {
	const categoryFilters = filters.value.filter((filter) => filter !== "Deals")
	const dealFilter = filters.value.includes("Deals")
	const searchFilter = new RegExp(searchTerm.value.trim(), "i")
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

onMounted(async () => {
	try {
		await $fetch("/api/cart/cart", { method: "PUT" })
	} catch (e) {
		/* lol */
	}
})
</script>
