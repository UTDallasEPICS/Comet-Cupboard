<template>
	<div>
		<NuxtLayout name="main" title="All Items" :back-navigation="{ text: 'Back to Categories', to: '/student/shopping' }">
			<section>
				<div class="flex flex-row flex-nowrap items-center gap-2">
					<UInput v-model="query" type="text" :icon="icons['search']" placeholder="Search items" class="grow" />
					<UPopover>
						<UButton :icon="icons['sortFilter']" variant="ghost" color="neutral" size="md" />

						<template #content>
							<div class="flex w-64 flex-col items-start gap-2 p-4">
								<SharedTextBase class="w-full font-semibold">Filter</SharedTextBase>
								<USeparator />
								<UCheckboxGroup v-model="toggleItems" :items="toggleOptions" orientation="vertical" />
								<SharedTextBase class="w-full font-semibold">Sort</SharedTextBase>
								<USeparator />
								<USelect v-model="sortOption" :items="sortOptions" class="w-full max-w-md grow" />
							</div>
						</template>
					</UPopover>
				</div>
				<USeparator class="my-4" />
				<ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li v-for="item in filtered" :key="item.itemID">
						<ShoppingItemCard
							type-of-card="SHOPPING"
							:img-name="item.imgName"
							:item-deal="item.Deal ? { actualCount: item.Deal.actualCount, adjustedCount: item.Deal.adjustedCount } : {}"
							:item-i-d="item.itemID"
							:name="item.name"
							:quantity="item.quantity"
						/>
					</li>
				</ul>
			</section>
		</NuxtLayout>
	</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const sortOption = ref("Alphabetical")
const sortOptions = ["Alphabetical", "Quantity"]

const { data: items } = await useFetch("/api/student/inventory/items", {
	query: { checkAvailability: "true" },
})

const toggleOptions = ref(["Deal"])
const toggleItems = ref([])
const shownItems = computed(() => {
	return items.value.filter((item) => {
		return !toggleItems.value.includes("Deal") || item.Deal !== null
	})
})

const sortedItems = computed(() => {
	if (!shownItems.value) {
		return []
	}
	const sorted = [...shownItems.value]
	if (sortOption.value === "Alphabetical") {
		sorted.sort((a, b) => a.name.localeCompare(b.name))
	} else if (sortOption.value === "Quantity") {
		sorted.sort((a, b) => b.quantity - a.quantity)
	}
	return sorted
})

const { query, filtered } = useFuzzySearch(sortedItems, { searchKeys: ["name"] })
</script>
